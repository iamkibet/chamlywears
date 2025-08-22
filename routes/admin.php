<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;

// Admin routes - require authentication, verification, and admin privileges
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Admin Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Products management
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::put('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });
    
    // Categories management
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/create', [CategoryController::class, 'create'])->name('create');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('edit');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
    });
    
    // Orders management
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [DashboardController::class, 'orders'])->name('index');
        Route::get('/create', [DashboardController::class, 'createOrderPage'])->name('create');
        Route::post('/', [DashboardController::class, 'createOrder'])->name('store');
        Route::get('/{order}', [DashboardController::class, 'showOrder'])->name('show');
        Route::patch('/{order}/status', [DashboardController::class, 'updateOrderStatus'])->name('update-status');
    });
    
    // Customers management
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [DashboardController::class, 'customers'])->name('index');
        Route::get('/{user}', [DashboardController::class, 'showCustomer'])->name('show');
    });
    
    // Analytics
    Route::get('/analytics', [DashboardController::class, 'analytics'])->name('analytics');
    
    // Activities
    Route::get('/activities', [DashboardController::class, 'activities'])->name('activities');
    
    // Content management
    Route::prefix('content')->name('content.')->group(function () {
        Route::get('/home', [DashboardController::class, 'homeContent'])->name('home');
        Route::post('/home', [DashboardController::class, 'updateHomeContent'])->name('home.update');
        Route::get('/banners', [DashboardController::class, 'banners'])->name('banners');
        Route::post('/banners', [DashboardController::class, 'storeBanner'])->name('banners.store');
        Route::delete('/banners/{banner}', [DashboardController::class, 'destroyBanner'])->name('banners.destroy');
    });
    
    // User management (for admins to manage other users)
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [DashboardController::class, 'users'])->name('index');
        Route::get('/{user}', [DashboardController::class, 'showUser'])->name('show');
        Route::patch('/{user}/role', [DashboardController::class, 'updateUserRole'])->name('update-role');
    });
});
