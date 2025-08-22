<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get categories
        $casualCategory = Category::where('name', 'Casual')->first();
        $gymCategory = Category::where('name', 'Gym')->first();
        $officialCategory = Category::where('name', 'Official')->first();

        if (!$casualCategory || !$gymCategory || !$officialCategory) {
            return;
        }

        // Casual Products
        $casualProducts = [
            [
                'name' => 'Classic Cotton Hoodie',
                'slug' => 'classic-cotton-hoodie',
                'description' => 'Soft, comfortable hoodie perfect for everyday wear',
                'price' => 2500.00,
                'compare_at_price' => 3000.00,
                'sku' => 'CAS-HOOD-001',
                'images' => ['/images/chamly/11.jpeg', '/images/chamly/12.jpeg'],
                'featured' => true,
                'has_variants' => true,
                'available_colors' => ['Black', 'Gray', 'Navy'],
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'total_stock' => 150,
            ],
            [
                'name' => 'Denim Jacket',
                'slug' => 'denim-jacket',
                'description' => 'Timeless denim jacket with modern styling',
                'price' => 4500.00,
                'compare_at_price' => 5200.00,
                'sku' => 'CAS-DEN-002',
                'images' => ['/images/chamly/13.jpeg'],
                'featured' => false,
                'has_variants' => true,
                'available_colors' => ['Blue', 'Black'],
                'available_sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'total_stock' => 80,
            ],
        ];

        // Gym Products
        $gymProducts = [
            [
                'name' => 'Performance T-Shirt',
                'slug' => 'performance-t-shirt',
                'description' => 'Moisture-wicking performance shirt for workouts',
                'price' => 1800.00,
                'compare_at_price' => null,
                'sku' => 'GYM-TSH-001',
                'images' => ['/images/chamly/14.jpeg'],
                'featured' => true,
                'has_variants' => true,
                'available_colors' => ['Black', 'White', 'Red'],
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'total_stock' => 120,
            ],
            [
                'name' => 'Training Shorts',
                'slug' => 'training-shorts',
                'description' => 'Comfortable training shorts for all types of workouts',
                'price' => 2200.00,
                'compare_at_price' => 2500.00,
                'sku' => 'GYM-SHORT-002',
                'images' => ['/images/chamly/15.jpeg'],
                'featured' => false,
                'has_variants' => true,
                'available_colors' => ['Black', 'Gray', 'Navy'],
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'total_stock' => 90,
            ],
        ];

        // Official Products
        $officialProducts = [
            [
                'name' => 'Classic Blazer',
                'slug' => 'classic-blazer',
                'description' => 'Timeless blazer perfect for professional settings',
                'price' => 8500.00,
                'compare_at_price' => 9500.00,
                'sku' => 'OFF-BLAZ-001',
                'images' => ['/images/chamly/18.jpg'],
                'featured' => true,
                'has_variants' => true,
                'available_colors' => ['Black', 'Navy', 'Gray'],
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'total_stock' => 75,
            ],
            [
                'name' => 'Dress Shirt',
                'slug' => 'dress-shirt',
                'description' => 'Crisp, professional dress shirt for the modern professional',
                'price' => 2800.00,
                'compare_at_price' => null,
                'sku' => 'OFF-SHIRT-002',
                'images' => ['/images/chamly/19.jpg'],
                'featured' => false,
                'has_variants' => true,
                'available_colors' => ['White', 'Light Blue', 'Pink'],
                'available_sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                'total_stock' => 165,
            ],
        ];

        // Create products and variants
        $this->createProductsWithVariants($casualProducts, $casualCategory);
        $this->createProductsWithVariants($gymProducts, $gymCategory);
        $this->createProductsWithVariants($officialProducts, $officialCategory);
    }

    private function createProductsWithVariants($products, $category)
    {
        foreach ($products as $productData) {
            $product = Product::create([
                'category_id' => $category->id,
                'name' => $productData['name'],
                'slug' => $productData['slug'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'compare_at_price' => $productData['compare_at_price'],
                'sku' => $productData['sku'],
                'images' => $productData['images'],
                'featured' => $productData['featured'],
                'is_active' => true,
                'has_variants' => $productData['has_variants'],
                'available_colors' => $productData['available_colors'],
                'available_sizes' => $productData['available_sizes'],
                'total_stock' => $productData['total_stock'],
            ]);

            // Create variants
            if ($productData['has_variants']) {
                $stockPerVariant = floor($productData['total_stock'] / (count($productData['available_colors']) * count($productData['available_sizes'])));
                
                foreach ($productData['available_colors'] as $color) {
                    foreach ($productData['available_sizes'] as $size) {
                        $variantSku = $product->sku . '-' . strtoupper(substr($color, 0, 3)) . '-' . $size;
                        
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'sku' => $variantSku,
                            'color' => $color,
                            'size' => $size,
                            'price' => $productData['price'],
                            'compare_at_price' => $productData['compare_at_price'],
                            'stock' => $stockPerVariant,
                            'images' => $productData['images'],
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }
    }
}
