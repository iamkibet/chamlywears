<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->withCount('variants')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create(): Response
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'sku' => 'required|string|max:255|unique:products,sku',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.compare_at_price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'string',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);
        
        // Ensure unique slug
        $counter = 1;
        $originalSlug = $validated['slug'];
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Extract variants data
        $variants = $validated['variants'];
        unset($validated['variants']);

        // Set default values
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['featured'] = $validated['featured'] ?? false;
        $validated['has_variants'] = true;

        // Calculate available colors and sizes from variants
        $availableColors = collect($variants)->pluck('color')->filter()->unique()->values()->toArray();
        $availableSizes = collect($variants)->pluck('size')->filter()->unique()->values()->toArray();
        $validated['available_colors'] = $availableColors;
        $validated['available_sizes'] = $availableSizes;

        // Create the product
        $product = Product::create($validated);

        // Create variants
        $totalStock = 0;
        foreach ($variants as $variantData) {
            $variantSku = $product->sku . '-' . Str::upper(Str::random(4));
            while (ProductVariant::where('sku', $variantSku)->exists()) {
                $variantSku = $product->sku . '-' . Str::upper(Str::random(4));
            }

            $variant = $product->variants()->create([
                'sku' => $variantSku,
                'color' => $variantData['color'],
                'size' => $variantData['size'],
                'price' => $variantData['price'] ?? $product->price,
                'compare_at_price' => $variantData['compare_at_price'] ?? $product->compare_at_price,
                'stock' => $variantData['stock'],
                'images' => $variantData['images'] ?? [],
                'is_active' => true,
            ]);

            $totalStock += $variantData['stock'];
        }

        // Update total stock
        $product->update(['total_stock' => $totalStock]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product with variants created successfully!');
    }

    public function edit(Product $product): Response
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load(['category', 'variants']),
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'sku' => ['required', 'string', 'max:255', Rule::unique('products')->ignore($product->id)],
            'images' => 'nullable|array',
            'images.*' => 'string',
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.compare_at_price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'string',
        ]);

        // Generate slug from name if name changed
        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
            
            // Ensure unique slug
            $counter = 1;
            $originalSlug = $validated['slug'];
            while (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Extract variants data
        $variants = $validated['variants'];
        unset($validated['variants']);

        // Calculate available colors and sizes from variants
        $availableColors = collect($variants)->pluck('color')->filter()->unique()->values()->toArray();
        $availableSizes = collect($variants)->pluck('size')->filter()->unique()->values()->toArray();
        $validated['available_colors'] = $availableColors;
        $validated['available_sizes'] = $availableSizes;

        $product->update($validated);

        // Update variants
        $totalStock = 0;
        $existingVariantIds = collect($variants)->pluck('id')->filter()->toArray();
        
        // Delete variants that are no longer present
        $product->variants()->whereNotIn('id', $existingVariantIds)->delete();

        foreach ($variants as $variantData) {
            if (isset($variantData['id'])) {
                // Update existing variant
                $variant = $product->variants()->find($variantData['id']);
                if ($variant) {
                    $variant->update([
                        'color' => $variantData['color'],
                        'size' => $variantData['size'],
                        'price' => $variantData['price'] ?? $product->price,
                        'compare_at_price' => $variantData['compare_at_price'] ?? $product->compare_at_price,
                        'stock' => $variantData['stock'],
                        'images' => $variantData['images'] ?? [],
                    ]);
                }
            } else {
                // Create new variant
                $variantSku = $product->sku . '-' . Str::upper(Str::random(4));
                while (ProductVariant::where('sku', $variantSku)->exists()) {
                    $variantSku = $product->sku . '-' . Str::upper(Str::random(4));
                }

                $product->variants()->create([
                    'sku' => $variantSku,
                    'color' => $variantData['color'],
                    'size' => $variantData['size'],
                    'price' => $variantData['price'] ?? $product->price,
                    'compare_at_price' => $variantData['compare_at_price'] ?? $product->compare_at_price,
                    'stock' => $variantData['stock'],
                    'images' => $variantData['images'] ?? [],
                    'is_active' => true,
                ]);
            }
            
            $totalStock += $variantData['stock'];
        }

        // Update total stock
        $product->update(['total_stock' => $totalStock]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product with variants updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }
}
