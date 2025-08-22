<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/cart', [CartController::class, 'index'])->name('cart');

// Static pages
Route::get('/about', function () {
    return Inertia::render('Static/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Static/Contact');
})->name('contact');

Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

Route::get('/policies/{type}', function ($type) {
    return Inertia::render('Static/Policies', ['type' => $type]);
})->name('policies');

// User routes (require authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    // User dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User profile and orders
    Route::get('/profile', function () {
        return redirect()->route('profile.edit');
    })->name('profile');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/whatsapp-message', [OrderController::class, 'generateWhatsAppMessage'])->name('orders.whatsapp-message');
    
    // Orders
    Route::post('/orders/create-from-cart', [OrderController::class, 'createOrderFromCart'])->name('orders.create-from-cart');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

// Include other route files
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
