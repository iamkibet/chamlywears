<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = auth()->user()->orders()
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order): Response
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order->load('items')
        ]);
    }

    public function createOrderFromCart(Request $request)
    {
        // Debug authentication
        \Log::info('Order creation request received', [
            'user_id' => auth()->id(),
            'user_authenticated' => auth()->check(),
            'session_id' => session()->getId(),
            'request_data' => $request->all()
        ]);

        // Check if user is authenticated
        if (!auth()->check()) {
            \Log::warning('User not authenticated for order creation');
            return response()->json([
                'success' => false,
                'message' => 'Authentication required. Please log in again.'
            ], 401);
        }

        $request->validate([
            'cart_items' => 'required|array|min:1',
            'customer_info' => 'required|array',
            'totals' => 'required|array',
        ]);

        // Validate customer info fields
        $request->validate([
            'customer_info.firstName' => 'required|string|max:255',
            'customer_info.lastName' => 'required|string|max:255',
            'customer_info.email' => 'required|email|max:255',
            'customer_info.phone' => 'required|string|max:255',
            'customer_info.street' => 'required|string|max:500',
            'customer_info.city' => 'required|string|max:255',
            'customer_info.postalCode' => 'nullable|string|max:20',
            'customer_info.notes' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $cartItems = $request->cart_items;
        $customerInfo = $request->customer_info;
        $totals = $request->totals;

        try {
            // Generate unique order number
            $orderNumber = 'CHM-' . date('Y') . '-' . strtoupper(Str::random(8));

        // Ensure all required fields are present and not empty
        $customerName = trim($customerInfo['firstName'] . ' ' . $customerInfo['lastName']);
        $customerEmail = trim($customerInfo['email']);
        $customerPhone = trim($customerInfo['phone']);
        $customerAddress = trim($customerInfo['street']);
        $customerCity = trim($customerInfo['city']);

        // Validate that required fields are not empty after trimming
        if (empty($customerName) || empty($customerEmail) || empty($customerPhone) || empty($customerAddress) || empty($customerCity)) {
            return response()->json([
                'success' => false,
                'message' => 'All required customer information fields must be filled out.'
            ], 422);
        }

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => $orderNumber,
            'status' => 'pending',
            'subtotal' => $totals['subtotal'],
            'shipping' => $totals['shipping'] ?? 0,
            'total' => $totals['total'],
            'customer_name' => $customerName,
            'customer_email' => $customerEmail,
            'customer_phone' => $customerPhone,
            'customer_address' => $customerAddress,
            'customer_city' => $customerCity,
            'customer_postal_code' => !empty($customerInfo['postalCode']) ? trim($customerInfo['postalCode']) : null,
            'notes' => !empty($customerInfo['notes']) ? trim($customerInfo['notes']) : null,
        ]);

        // Create order items
        foreach ($cartItems as $item) {
            // Validate required item fields
            if (empty($item['name']) || !isset($item['price'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid cart item data. Product name and price are required.'
                ], 422);
            }

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'] ?? null,
                'product_name' => trim($item['name']),
                'product_image' => $item['image'] ?? '/images/chamly/1.jpg',
                'product_slug' => $item['slug'] ?? 'product-' . ($item['id'] ?? 'unknown'),
                'size' => !empty($item['size']) ? trim($item['size']) : null,
                'color' => !empty($item['color']) ? trim($item['color']) : null,
                'price' => $item['price'],
                'quantity' => $item['quantity'] ?? 1,
            ]);
        }

        return response()->json([
            'success' => true,
            'order' => $order->load('items'),
            'message' => 'Order created successfully!'
        ]);
        
        } catch (\Exception $e) {
            \Log::error('Order creation failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'customer_info' => $customerInfo,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order. Please try again.'
            ], 500);
        }
    }

    public function generateWhatsAppMessage(Order $order)
    {
        // Ensure user can only access their own orders
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $orderItems = $order->items->map(function ($item) {
            $productUrl = url("/product/{$item->product_slug}");
            return "• {$item->product_name} ({$item->size}, {$item->color}) - KES {$item->price} x{$item->quantity}\n  🔗 {$productUrl}";
        })->join("\n");

        $message = "🛍️ *NEW ORDER - Chamly Wears*\n\n" .
            "*Order Details:*\n" .
            "📋 Order #: {$order->order_number}\n" .
            "📅 Date: " . $order->created_at->format('M d, Y H:i') . "\n\n" .
            "*Customer Information:*\n" .
            "👤 Name: {$order->customer_name}\n" .
            "📧 Email: {$order->customer_email}\n" .
            "📱 Phone: {$order->customer_phone}\n" .
            "📍 Address: {$order->customer_address}, {$order->customer_city} {$order->customer_postal_code}\n\n" .
            "*Order Items:*\n{$orderItems}\n\n" .
            "*Order Summary:*\n" .
            "💰 Subtotal: KES " . number_format($order->subtotal, 2) . "\n" .
            "🚚 Shipping: KES " . number_format($order->shipping, 2) . "\n" .
            "💳 *Total: KES " . number_format($order->total, 2) . "*\n\n" .
            "📝 Notes: " . ($order->notes ?: 'None') . "\n\n" .
            "*Next Steps:*\n" .
            "Please confirm this order and provide payment details. I'm ready to complete the purchase.\n\n" .
            "Thank you! 🙏";

        return response()->json([
            'message' => $message,
            'whatsapp_url' => "https://wa.me/" . config('business.whatsapp_number', '254755449012') . "?text=" . urlencode($message)
        ]);
    }
}
