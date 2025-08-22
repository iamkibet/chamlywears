<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Checkout/Index');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string',
            'note' => 'nullable|string',
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.size' => 'nullable|string',
            'cart.*.color' => 'nullable|string',
        ]);

        $cart = $request->input('cart');
        $subtotal = collect($cart)->sum(function ($item) {
            $product = \App\Models\Product::find($item['product_id']);
            return $product->price * $item['quantity'];
        });
        $total = $subtotal; // No tax/shipping for now

        // Create order
        $order = Order::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'city' => $request->city,
            'address' => $request->address,
            'note' => $request->note,
            'status' => 'pending',
            'subtotal' => $subtotal,
            'total' => $total,
        ]);

        // Create order items
        foreach ($cart as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'name_snapshot' => $product->name,
                'price_snapshot' => $product->price,
                'quantity' => $item['quantity'],
                'size' => $item['size'] ?? null,
                'color' => $item['color'] ?? null,
            ]);
        }

        // Build WhatsApp link
        $whatsappLink = $this->buildWhatsAppLink($order);

        // Mark order as sent to WhatsApp
        $order->markAsSentToWhatsApp();

        return redirect($whatsappLink);
    }

    private function buildWhatsAppLink(Order $order): string
    {
        $message = "Hello Chamly Wears! I'd like to order:\n\n";
        
        foreach ($order->items as $item) {
            $message .= "• {$item->quantity} x {$item->name_snapshot}";
            if ($item->size) $message .= " (Size: {$item->size})";
            if ($item->color) $message .= " (Color: {$item->color})";
            $message .= " - KES " . number_format($item->price_snapshot, 2) . "\n";
        }
        
        $message .= "\nTotal: KES " . number_format($order->total, 2);
        $message .= "\n\nCustomer Details:";
        $message .= "\nName: {$order->name}";
        $message .= "\nPhone: {$order->phone}";
        $message .= "\nCity: {$order->city}";
        $message .= "\nAddress: {$order->address}";
        
        if ($order->note) {
            $message .= "\nNote: {$order->note}";
        }

        $whatsappNumber = config('services.whatsapp.number', '254705659518');
        return "https://wa.me/{$whatsappNumber}?text=" . urlencode($message);
    }
}
