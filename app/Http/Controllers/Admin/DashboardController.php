<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\AnalyticsEvent;
use App\Models\User;
use App\Models\Banner;
use App\Models\HomepageBlock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB; // Added missing import

class DashboardController extends Controller
{
    private function formatCurrency($amount): string
    {
        if ($amount === null || $amount === 0) {
            return 'KES 0.00';
        }
        return 'KES ' . number_format($amount, 2);
    }

    public function index(): Response
    {
        // Today's stats
        $todayOrders = Order::whereDate('created_at', today())->count();
        $todaySales = Order::whereDate('created_at', today())->sum('total');
        $todayRevenue = Order::whereDate('created_at', today())->where('status', 'completed')->sum('total');

        // This week's stats
        $weekOrders = Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $weekSales = Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->sum('total');

        // This month's stats
        $monthOrders = Order::whereMonth('created_at', now()->month)->count();
        $monthSales = Order::whereMonth('created_at', now()->month)->sum('total');

        // Get total counts for dashboard with safe defaults
        $totalUsers = User::where('is_admin', false)->count();
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalProducts = Product::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total') ?? 0;
        
        // Calculate total inventory value
        $totalInventoryValue = Product::sum(\DB::raw('price * stock')) ?? 0;
        
        // Calculate growth percentages (simplified for now)
        $userGrowth = 12; // Placeholder - can be calculated from actual data
        $revenueGrowth = 15; // Placeholder - can be calculated from actual data

        // Get orders by status
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status ?? 'unknown',
                    'count' => $item->count
                ];
            });

        // Get monthly revenue for the last 6 months
        $monthlyRevenue = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = Order::where('status', 'completed')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total') ?? 0;
            
            $monthlyRevenue->push([
                'month' => $date->format('M Y'),
                'revenue' => $revenue
            ]);
        }

        // Get top customers
        $topCustomers = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->orderByDesc('orders_sum_total')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'orders_count' => $user->orders_count,
                    'orders_sum_total' => $user->orders_sum_total ?? 0
                ];
            });

        // Traffic sources (placeholder data for now)
        $trafficSources = [
            ['name' => 'Direct', 'percentage' => 45, 'icon' => 'Globe'],
            ['name' => 'Organic Search', 'percentage' => 30, 'icon' => 'Search'],
            ['name' => 'Social Media', 'percentage' => 15, 'icon' => 'Share2'],
            ['name' => 'Referral', 'percentage' => 10, 'icon' => 'Link']
        ];

        // Top categories by product count (simplified)
        $topCategories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->take(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->products_count,
                    'percentage' => 0 // Will be calculated below
                ];
            });

        // Calculate percentages for categories
        if ($topCategories->isNotEmpty() && $totalProducts > 0) {
            $topCategories->transform(function ($category) use ($totalProducts) {
                $category['percentage'] = round(($category['count'] / $totalProducts) * 100);
                return $category;
            });
        }

        // Get recent orders for dashboard
        $recentOrders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->name ?? 'Unknown Customer',
                    'total' => $order->total ?? 0,
                    'status' => $order->status ?? 'pending',
                    'created_at' => $order->created_at,
                    'items_count' => $order->items->count()
                ];
            });

        // Get recent activities (last 24 hours)
        $recentActivities = collect();
        
        // Recent orders
        $recentOrderActivities = Order::with('user')
            ->where('created_at', '>=', now()->subDay())
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'type' => 'order_created',
                    'title' => 'New order received',
                    'description' => "Order #{$order->order_number} for " . $this->formatCurrency($order->total),
                    'customer' => $order->user->name ?? 'Unknown Customer',
                    'timestamp' => $order->created_at,
                    'icon' => 'ShoppingBag',
                    'color' => 'blue'
                ];
            });
        $recentActivities = $recentActivities->merge($recentOrderActivities);
        
        // Recent order status changes
        $recentStatusChanges = Order::with('user')
            ->where('updated_at', '>=', now()->subDay())
            ->where('updated_at', '!=', DB::raw('created_at'))
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                $statusText = ucfirst($order->status);
                return [
                    'type' => 'order_status',
                    'title' => "Order #{$order->order_number} {$statusText}",
                    'description' => "Customer: {$order->user->name}",
                    'customer' => $order->user->name ?? 'Unknown Customer',
                    'timestamp' => $order->updated_at,
                    'icon' => 'Package',
                    'color' => $order->status === 'completed' ? 'green' : ($order->status === 'cancelled' ? 'red' : 'yellow')
                ];
            });
        $recentActivities = $recentActivities->merge($recentStatusChanges);
        
        // Recent customer registrations
        $recentRegistrations = User::where('is_admin', false)
            ->where('created_at', '>=', now()->subDay())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'customer_registration',
                    'title' => 'New customer registration',
                    'description' => "{$user->name} signed up",
                    'customer' => $user->name,
                    'timestamp' => $user->created_at,
                    'icon' => 'User',
                    'color' => 'purple'
                ];
            });
        $recentActivities = $recentActivities->merge($recentRegistrations);
        
        // Recent product updates
        $recentProductUpdates = Product::where('updated_at', '>=', now()->subDay())
            ->where('updated_at', '!=', DB::raw('created_at'))
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                $stockStatus = $product->stock <= 10 ? 'low stock' : 'updated';
                return [
                    'type' => 'product_update',
                    'title' => "Product {$stockStatus}",
                    'description' => "{$product->name} - Stock: {$product->stock}",
                    'customer' => null,
                    'timestamp' => $product->updated_at,
                    'icon' => 'Package',
                    'color' => $product->stock <= 10 ? 'red' : 'blue'
                ];
            });
        $recentActivities = $recentActivities->merge($recentProductUpdates);
        
        // Sort all activities by timestamp and take the most recent 10
        $recentActivities = $recentActivities
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'todayOrders' => $todayOrders,
                'todaySales' => $todaySales,
                'todayRevenue' => $todayRevenue,
                'weekOrders' => $weekOrders,
                'weekSales' => $weekSales,
                'monthOrders' => $monthOrders,
                'monthSales' => $monthSales,
                'totalUsers' => $totalUsers,
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'totalProducts' => $totalProducts,
                'totalRevenue' => $totalRevenue,
                'totalInventoryValue' => $totalInventoryValue,
                'userGrowth' => $userGrowth,
                'revenueGrowth' => $revenueGrowth,
            ],
            'ordersByStatus' => $ordersByStatus,
            'monthlyRevenue' => $monthlyRevenue,
            'topCustomers' => $topCustomers,
            'trafficSources' => $trafficSources,
            'topCategories' => $topCategories,
            'recentOrders' => $recentOrders,
            'recentActivities' => $recentActivities,
        ]);
    }

    // Products management
    public function products(): Response
    {
        $products = Product::with('category')->paginate(20);
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function createProduct(): Response
    {
        $categories = Category::all();
        
        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'slug' => 'required|string|unique:products,slug',
            'image' => 'nullable|string',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function editProduct(Product $product): Response
    {
        $categories = Category::all();
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('category'),
            'categories' => $categories,
        ]);
    }

    public function updateProduct(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'image' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroyProduct(Product $product): \Illuminate\Http\RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    // Categories management
    public function categories(): Response
    {
        $categories = Category::withCount('products')->paginate(20);
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function createCategory(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function storeCategory(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'required|string|unique:categories,slug',
        ]);

        Category::create($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function editCategory(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function updateCategory(Request $request, Category $category): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(Category $category): \Illuminate\Http\RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }

    // Orders management
    public function orders(): Response
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        // Calculate comprehensive stats
        $totalRevenue = Order::where('status', 'completed')->sum('total') ?? 0;
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        
        // Ensure all orders have proper data structure
        $orders->getCollection()->transform(function ($order) {
            // Ensure total is always a number
            $order->total = $order->total ?? 0;
            
            // Ensure status is always a string
            $order->status = $order->status ?? 'pending';
            
            // Ensure order_number exists
            if (!$order->order_number) {
                $order->order_number = 'ORD-' . $order->id;
            }
            
            return $order;
        });
        
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'cancelledOrders' => $cancelledOrders,
                'pendingOrders' => $pendingOrders,
            ],
        ]);
    }

    public function showOrder(Order $order): Response
    {
        // Load the order with all necessary relationships
        $order->load([
            'items.product',
            'user',
        ]);
        
        // Ensure order has proper data structure
        $order->total = $order->total ?? 0;
        $order->subtotal = $order->subtotal ?? 0;
        $order->shipping = $order->shipping ?? 0;
        $order->status = $order->status ?? 'pending';
        
        // Ensure order_number exists
        if (!$order->order_number) {
            $order->order_number = 'ORD-' . $order->id;
        }
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order): Response
    {
        $request->validate([
            'status' => 'required|in:pending,completed,cancelled',
        ]);
        
        try {
            $oldStatus = $order->status;
            $order->status = $request->status;
            
            // Set completed_at timestamp if order is completed
            if ($request->status === 'completed') {
                $order->completed_at = now();
            }
            
            $order->save();
            
            return response()->json([
                'success' => true,
                'message' => "Order #{$order->order_number} status updated from {$oldStatus} to {$request->status} successfully.",
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'updated_at' => $order->updated_at
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createOrder(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:500',
            'customer_city' => 'required|string|max:100',
            'customer_postal_code' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            \DB::beginTransaction();

            // Create the order
            $order = Order::create([
                'user_id' => null, // Manual order, no user
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'status' => 'pending', // Only pending, completed, or cancelled allowed
                'subtotal' => $validated['subtotal'],
                'shipping' => $validated['shipping'],
                'total' => $validated['total'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'customer_city' => $validated['customer_city'],
                'customer_postal_code' => $validated['customer_postal_code'],
                'notes' => $validated['notes'],
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                
                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total' => $product->price * $item['quantity'],
                ]);

                // Update product stock
                $product->decrement('stock', $item['quantity']);
            }

            \DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product')
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createOrderPage(): Response
    {
        $products = Product::with('category')
            ->where('stock', '>', 0)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Orders/Create', [
            'products' => $products,
        ]);
    }

    // Customers management
    public function customers(): Response
    {
        $customers = User::where('is_admin', false)->withCount('orders')->paginate(20);
        
        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function showCustomer(User $user): Response
    {
        $user->load(['orders.items.product']);
        
        return Inertia::render('Admin/Customers/Show', [
            'customer' => $user,
        ]);
    }

    // Analytics
    public function analytics(): Response
    {
        $analytics = AnalyticsEvent::selectRaw('event_type, COUNT(*) as count, DATE(created_at) as date')
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->groupBy('event_type', 'date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Analytics', [
            'analytics' => $analytics,
        ]);
    }

    // Content management
    public function homeContent(): Response
    {
        $homepageBlocks = HomepageBlock::all();
        $banners = Banner::all();
        
        return Inertia::render('Admin/Content/Home', [
            'homepageBlocks' => $homepageBlocks,
            'banners' => $banners,
        ]);
    }

    public function updateHomeContent(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'blocks' => 'required|array',
            'blocks.*.id' => 'required|exists:homepage_blocks,id',
            'blocks.*.content' => 'required|string',
            'blocks.*.is_active' => 'boolean',
        ]);

        foreach ($validated['blocks'] as $block) {
            HomepageBlock::find($block['id'])->update([
                'content' => $block['content'],
                'is_active' => $block['is_active'] ?? false,
            ]);
        }

        return redirect()->back()->with('success', 'Homepage content updated successfully.');
    }

    public function banners(): Response
    {
        $banners = Banner::all();
        
        return Inertia::render('Admin/Content/Banners', [
            'banners' => $banners,
        ]);
    }

    public function storeBanner(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|string',
            'link' => 'nullable|url',
            'is_active' => 'boolean',
        ]);

        Banner::create($validated);

        return redirect()->back()->with('success', 'Banner created successfully.');
    }

    public function destroyBanner(Banner $banner): \Illuminate\Http\RedirectResponse
    {
        $banner->delete();

        return redirect()->back()->with('success', 'Banner deleted successfully.');
    }

    // User management
    public function users(): Response
    {
        $users = User::withCount('orders')->paginate(20);
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function showUser(User $user): Response
    {
        $user->load(['orders.items.product']);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function updateUserRole(Request $request, User $user): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user->update(['is_admin' => $validated['is_admin']]);

        return response()->json(['message' => 'User role updated successfully']);
    }

    // Activities
    public function activities(): Response
    {
        // Get all activities (not just recent ones)
        $activities = collect();
        
        // Get order activities
        $orderActivities = Order::with('user')
            ->where('created_at', '>=', now()->subDays(30))
            ->get()
            ->map(function ($order) {
                return [
                    'type' => 'order',
                    'title' => 'New Order Placed',
                    'description' => "Order #{$order->id} was placed",
                    'customer' => $order->user->name ?? 'Guest',
                    'timestamp' => $order->created_at,
                    'icon' => 'ShoppingBag',
                    'color' => 'blue'
                ];
            });
        
        // Get status change activities
        $statusChangeActivities = Order::with('user')
            ->where('updated_at', '>=', now()->subDays(30))
            ->where('updated_at', '>', DB::raw('created_at'))
            ->get()
            ->map(function ($order) {
                return [
                    'type' => 'status_change',
                    'title' => 'Order Status Updated',
                    'description' => "Order #{$order->id} status changed to {$order->status}",
                    'customer' => $order->user->name ?? 'Guest',
                    'timestamp' => $order->updated_at,
                    'icon' => 'Package',
                    'color' => 'green'
                ];
            });
        
        // Get user registration activities
        $registrationActivities = User::where('created_at', '>=', now()->subDays(30))
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'registration',
                    'title' => 'New User Registration',
                    'description' => "User {$user->name} registered",
                    'customer' => $user->name,
                    'timestamp' => $user->created_at,
                    'icon' => 'User',
                    'color' => 'purple'
                ];
            });
        
        // Get product update activities
        $productUpdateActivities = Product::where('updated_at', '>=', now()->subDays(30))
            ->where('updated_at', '>', DB::raw('created_at'))
            ->get()
            ->map(function ($product) {
                return [
                    'type' => 'product_update',
                    'title' => 'Product Updated',
                    'description' => "Product {$product->name} was updated",
                    'customer' => null,
                    'timestamp' => $product->updated_at,
                    'icon' => 'Package',
                    'color' => 'yellow'
                ];
            });
        
        // Merge all activities and sort by timestamp
        $activities = $activities->merge($orderActivities)
            ->merge($statusChangeActivities)
            ->merge($registrationActivities)
            ->merge($productUpdateActivities)
            ->sortByDesc('timestamp')
            ->values();
        
        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
        ]);
    }
}
