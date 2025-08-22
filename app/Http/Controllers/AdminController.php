<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function dashboard(): Response
    {
        // Get analytics data
        $totalUsers = User::count();
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        
        // Recent orders
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(10)
            ->get();
        
        // Orders by status
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();
        
        // Monthly revenue
        $monthlyRevenue = Order::where('status', 'completed')
            ->whereYear('created_at', date('Y'))
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Top customers
        $topCustomers = User::withCount('orders')
            ->withSum('orders', 'total')
            ->orderByDesc('orders_sum_total')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalRevenue' => $totalRevenue,
            ],
            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'monthlyRevenue' => $monthlyRevenue,
            'topCustomers' => $topCustomers,
        ]);
    }

    public function orders(): Response
    {
        $orders = Order::with(['user', 'items'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders
        ]);
    }

    public function users(): Response
    {
        $users = User::withCount('orders')
            ->withSum('orders', 'total')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    public function products(): Response
    {
        $products = Product::with('category')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Products', [
            'products' => $products
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        if ($request->status === 'completed') {
            $order->update(['completed_at' => now()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully'
        ]);
    }

    public function analytics(): Response
    {
        // Sales analytics
        $salesData = Order::where('status', 'completed')
            ->whereYear('created_at', date('Y'))
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // User growth
        $userGrowth = User::selectRaw('DATE(created_at) as date, COUNT(*) as users')
            ->whereYear('created_at', date('Y'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Product performance
        $productPerformance = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->selectRaw('order_items.product_name, SUM(order_items.quantity) as total_sold, SUM(order_items.price * order_items.quantity) as revenue')
            ->groupBy('order_items.product_name')
            ->orderByDesc('total_sold')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Analytics', [
            'salesData' => $salesData,
            'userGrowth' => $userGrowth,
            'productPerformance' => $productPerformance,
        ]);
    }

    // Product Management Methods
    public function createProduct(): Response
    {
        $categories = Category::all();
        
        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    public function storeProduct(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|max:255|unique:products',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'sizes' => 'required|array|min:1',
            'colors' => 'required|array|min:1',
            'images' => 'required|array|min:1',
            'featured' => 'boolean',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'sku' => $request->sku,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
            'sizes' => $request->sizes,
            'colors' => $request->colors,
            'images' => $request->images,
            'featured' => $request->featured ?? false,
        ]);

        return redirect()->route('admin.products')->with('success', 'Product created successfully!');
    }

    public function editProduct(Product $product): Response
    {
        $categories = Category::all();
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function updateProduct(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'sizes' => 'required|array|min:1',
            'colors' => 'required|array|min:1',
            'images' => 'required|array|min:1',
            'featured' => 'boolean',
        ]);

        $product->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'sku' => $request->sku,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
            'sizes' => $request->sizes,
            'colors' => $request->colors,
            'images' => $request->images,
            'featured' => $request->featured ?? false,
        ]);

        return redirect()->route('admin.products')->with('success', 'Product updated successfully!');
    }

    public function destroyProduct(Product $product): \Illuminate\Http\JsonResponse
    {
        $product->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully!'
        ]);
    }
}
