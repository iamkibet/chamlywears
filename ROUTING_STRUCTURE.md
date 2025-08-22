# ChamlyWears Routing Structure

## Overview
This document outlines the redesigned routing structure that properly separates admin and user routes with appropriate middleware protection.

## Route Organization

### 1. Public Routes (`/`)
- **Home**: `/` → `HomeController@index`
- **Shop**: `/shop` → `ShopController@index`
- **Product Details**: `/product/{slug}` → `ProductController@show`
- **Cart**: `/cart` → `CartController@index`
- **Static Pages**: `/about`, `/contact`, `/faq`, `/policies/{type}`

### 2. User Routes (`/dashboard`, `/orders`, etc.)
**Middleware**: `['auth', 'verified']`
- **User Dashboard**: `/dashboard` → User dashboard page
- **Profile**: `/profile` → Redirects to profile edit
- **Orders**: 
  - `/orders` → `OrderController@index`
  - `/orders/{order}` → `OrderController@show`
  - `/orders/{order}/whatsapp-message` → `OrderController@generateWhatsAppMessage`
- **Checkout**: 
  - `/checkout` → `CheckoutController@index`
  - `/checkout` (POST) → `CheckoutController@store`

### 3. Admin Routes (`/admin/*`)
**Middleware**: `['auth', 'verified', 'admin']`
**Prefix**: `/admin`
**Route Names**: `admin.*`

#### Dashboard
- **Admin Dashboard**: `/admin/dashboard` → `DashboardController@index`

#### Products Management
- **Products List**: `/admin/products` → `DashboardController@products`
- **Create Product**: `/admin/products/create` → `DashboardController@createProduct`
- **Store Product**: `/admin/products` (POST) → `DashboardController@storeProduct`
- **Edit Product**: `/admin/products/{product}/edit` → `DashboardController@editProduct`
- **Update Product**: `/admin/products/{product}` (PUT) → `DashboardController@updateProduct`
- **Delete Product**: `/admin/products/{product}` (DELETE) → `DashboardController@destroyProduct`

#### Categories Management
- **Categories List**: `/admin/categories` → `DashboardController@categories`
- **Create Category**: `/admin/categories/create` → `DashboardController@createCategory`
- **Store Category**: `/admin/categories` (POST) → `DashboardController@storeCategory`
- **Edit Category**: `/admin/categories/{category}/edit` → `DashboardController@editCategory`
- **Update Category**: `/admin/categories/{category}` (PUT) → `DashboardController@updateCategory`
- **Delete Category**: `/admin/categories/{category}` (DELETE) → `DashboardController@destroyCategory`

#### Orders Management
- **Orders List**: `/admin/orders` → `DashboardController@orders`
- **Order Details**: `/admin/orders/{order}` → `DashboardController@showOrder`
- **Update Order Status**: `/admin/orders/{order}/status` (PATCH) → `DashboardController@updateOrderStatus`

#### Customers Management
- **Customers List**: `/admin/customers` → `DashboardController@customers`
- **Customer Details**: `/admin/customers/{user}` → `DashboardController@showCustomer`

#### Analytics
- **Analytics Dashboard**: `/admin/analytics` → `DashboardController@analytics`

#### Content Management
- **Homepage Content**: `/admin/content/home` → `DashboardController@homeContent`
- **Update Homepage**: `/admin/content/home` (POST) → `DashboardController@updateHomeContent`
- **Banners Management**: `/admin/content/banners` → `DashboardController@banners`
- **Store Banner**: `/admin/content/banners` (POST) → `DashboardController@storeBanner`
- **Delete Banner**: `/admin/content/banners/{banner}` (DELETE) → `DashboardController@destroyBanner`

#### User Management
- **Users List**: `/admin/users` → `DashboardController@users`
- **User Details**: `/admin/users/{user}` → `DashboardController@showUser`
- **Update User Role**: `/admin/users/{user}/role` (PATCH) → `DashboardController@updateUserRole`

## Middleware Protection

### AdminMiddleware
- **File**: `app/Http/Middleware/AdminMiddleware.php`
- **Purpose**: Ensures only admin users can access admin routes
- **Logic**: Checks if user is authenticated and has admin privileges (`isAdmin()` method)

### User Model Admin Check
- **Method**: `isAdmin()`
- **Logic**: Returns `true` if `role === 'admin'` OR `is_admin === true`

## Route Files Structure

```
routes/
├── web.php          # Main routes (public + user)
├── admin.php        # Admin routes
├── auth.php         # Authentication routes
└── settings.php     # User settings routes
```

## Benefits of New Structure

1. **Clear Separation**: Admin and user routes are completely separated
2. **Proper Middleware**: Admin routes require authentication, verification, AND admin privileges
3. **Consistent Naming**: All admin routes use `admin.*` naming convention
4. **Organized Controllers**: Single `DashboardController` handles all admin functionality
5. **Security**: Admin routes are protected by multiple middleware layers
6. **Maintainability**: Easy to add new admin routes and functionality
7. **Scalability**: Structure supports future admin features

## Usage Examples

### For Users
```php
// Access user dashboard
Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');
```

### For Admins
```php
// Access admin dashboard
Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
```

### Redirecting Based on User Role
```php
// In controllers or middleware
if ($user->isAdmin()) {
    return redirect()->route('admin.dashboard');
}
return redirect()->route('dashboard');
```

## Next Steps

1. **Create Admin Pages**: Ensure all admin Inertia pages exist in `resources/js/pages/Admin/`
2. **Test Middleware**: Verify admin middleware works correctly
3. **Add Navigation**: Update admin navigation to use new route names
4. **Update Links**: Ensure all admin links use the new route structure
