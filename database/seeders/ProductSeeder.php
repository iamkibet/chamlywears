<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $casualCategory = Category::where('slug', 'casual')->first();
        $gymCategory = Category::where('slug', 'gym')->first();
        $officialCategory = Category::where('slug', 'official')->first();

        // Casual Products
        $casualProducts = [
            [
                'name' => 'Classic Cotton Hoodie',
                'slug' => 'classic-cotton-hoodie',
                'description' => 'Soft, comfortable hoodie perfect for everyday wear',
                'price' => 2500.00,
                'compare_at_price' => 3000.00,
                'sku' => 'CAS-HOOD-001',
                'stock' => 50,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Gray', 'Navy'],
                'images' => [
                    '/images/chamly/11.jpeg',
                    '/images/chamly/12.jpeg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Relaxed Fit T-Shirt',
                'slug' => 'relaxed-fit-tshirt',
                'description' => 'Breathable cotton t-shirt with a modern relaxed fit',
                'price' => 1200.00,
                'compare_at_price' => null,
                'sku' => 'CAS-TEE-002',
                'stock' => 75,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                'colors' => ['White', 'Black', 'Blue', 'Red'],
                'images' => [
                    '/images/chamly/13.jpeg'
                ],
                'featured' => false,
            ],
            [
                'name' => 'Comfortable Joggers',
                'slug' => 'comfortable-joggers',
                'description' => 'Soft, stretchy joggers perfect for lounging and casual outings',
                'price' => 1800.00,
                'compare_at_price' => 2200.00,
                'sku' => 'CAS-JOG-003',
                'stock' => 40,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Gray', 'Navy'],
                'images' => [
                    '/images/chamly/14.jpeg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Premium Denim Collection',
                'slug' => 'premium-denim-collection',
                'description' => 'Quality craftsmanship meets contemporary style',
                'price' => 3200.00,
                'compare_at_price' => 3800.00,
                'sku' => 'CAS-DEN-004',
                'stock' => 35,
                'sizes' => ['28', '30', '32', '34', '36'],
                'colors' => ['Indigo', 'Black', 'Light Wash'],
                'images' => [
                    '/images/chamly/2.jpg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Heritage Plaid Shirts',
                'slug' => 'heritage-plaid-shirts',
                'description' => 'Rich patterns and premium textures',
                'price' => 1800.00,
                'compare_at_price' => 2200.00,
                'sku' => 'CAS-PLA-005',
                'stock' => 45,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colors' => ['Multi', 'Red', 'Green', 'Blue'],
                'images' => [
                    '/images/chamly/4.jpg'
                ],
                'featured' => false,
            ],
        ];

        // Gym Products
        $gymProducts = [
            [
                'name' => 'Performance Leggings',
                'slug' => 'performance-leggings',
                'description' => 'High-performance leggings with moisture-wicking technology',
                'price' => 3200.00,
                'compare_at_price' => 3800.00,
                'sku' => 'GYM-LEG-001',
                'stock' => 35,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Navy', 'Purple'],
                'images' => [
                    '/images/chamly/15.jpeg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Athletic Tank Top',
                'slug' => 'athletic-tank-top',
                'description' => 'Lightweight, breathable tank top for intense workouts',
                'price' => 1500.00,
                'compare_at_price' => null,
                'sku' => 'GYM-TANK-002',
                'stock' => 60,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['White', 'Black', 'Gray'],
                'images' => [
                    '/images/chamly/16.jpeg'
                ],
                'featured' => false,
            ],
            [
                'name' => 'Classic Plaid Blazer',
                'slug' => 'classic-plaid-blazer',
                'description' => 'Timeless university-inspired blazer with modern fit',
                'price' => 4500.00,
                'compare_at_price' => 5200.00,
                'sku' => 'GYM-BLA-003',
                'stock' => 25,
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => ['Brown', 'Navy', 'Black'],
                'images' => [
                    '/images/chamly/1.jpg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Outdoor Elegance Vest',
                'slug' => 'outdoor-elegance-vest',
                'description' => 'Sophisticated casual wear for the modern gentleman',
                'price' => 2800.00,
                'compare_at_price' => 3200.00,
                'sku' => 'GYM-VES-004',
                'stock' => 30,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Cream', 'Beige', 'Grey'],
                'images' => [
                    '/images/chamly/3.jpg'
                ],
                'featured' => false,
            ],
            [
                'name' => 'Urban Street Style',
                'slug' => 'urban-street-style',
                'description' => 'Modern city living essentials',
                'price' => 2200.00,
                'compare_at_price' => 2600.00,
                'sku' => 'GYM-URB-005',
                'stock' => 40,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Navy', 'Grey', 'Black'],
                'images' => [
                    '/images/chamly/5.jpg'
                ],
                'featured' => true,
            ],
        ];

        // Add more gym products
        $gymProducts[] = [
            'name' => 'Sports Bra',
            'slug' => 'sports-bra',
            'description' => 'High-support sports bra for all types of physical activities',
            'price' => 2800.00,
            'compare_at_price' => 3200.00,
            'sku' => 'GYM-BRA-003',
            'stock' => 45,
            'sizes' => ['S', 'M', 'L', 'XL'],
            'colors' => ['Black', 'Navy', 'Pink'],
            'images' => [
                                    '/images/chamly/17.jpg'
            ],
            'featured' => true,
        ];

        // Add more casual products
        $casualProducts[] = [
            'name' => 'Premium Streetwear',
            'slug' => 'premium-streetwear',
            'description' => 'High-end street fashion with premium materials',
            'price' => 4200.00,
            'compare_at_price' => 4800.00,
            'sku' => 'CAS-STR-006',
            'stock' => 25,
            'sizes' => ['S', 'M', 'L', 'XL'],
            'colors' => ['Black', 'White', 'Gray'],
            'images' => [
                '/images/chamly/8.jpg'
            ],
            'featured' => true,
        ];

        $casualProducts[] = [
            'name' => 'Luxury Casual Wear',
            'slug' => 'luxury-casual-wear',
            'description' => 'Premium casual clothing for the modern lifestyle',
            'price' => 3800.00,
            'compare_at_price' => 4200.00,
            'sku' => 'CAS-LUX-007',
            'stock' => 30,
            'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
            'colors' => ['Navy', 'Beige', 'Black'],
            'images' => [
                '/images/chamly/9.jpg'
            ],
            'featured' => false,
        ];

        $casualProducts[] = [
            'name' => 'Contemporary Fashion',
            'slug' => 'contemporary-fashion',
            'description' => 'Modern fashion pieces for the style-conscious',
            'price' => 3500.00,
            'compare_at_price' => 3900.00,
            'sku' => 'CAS-CON-008',
            'stock' => 35,
            'sizes' => ['S', 'M', 'L', 'XL'],
            'colors' => ['Black', 'Gray', 'White'],
            'images' => [
                '/images/chamly/10.jpg'
            ],
            'featured' => true,
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
                'stock' => 25,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Navy', 'Gray'],
                'images' => [
                    '/images/chamly/18.jpg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Dress Shirt',
                'slug' => 'dress-shirt',
                'description' => 'Crisp, professional dress shirt for the modern professional',
                'price' => 2800.00,
                'compare_at_price' => null,
                'sku' => 'OFF-SHIRT-002',
                'stock' => 55,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                'colors' => ['White', 'Light Blue', 'Pink'],
                'images' => [
                    '/images/chamly/19.jpg'
                ],
                'featured' => false,
            ],
            [
                'name' => 'Formal Trousers',
                'slug' => 'formal-trousers',
                'description' => 'Elegant formal trousers with perfect fit and comfort',
                'price' => 3200.00,
                'compare_at_price' => 3800.00,
                'sku' => 'OFF-TROU-003',
                'stock' => 40,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Navy', 'Gray'],
                'images' => [
                    '/images/chamly/20.jpg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Contemporary Women Collection',
                'slug' => 'contemporary-women-collection',
                'description' => 'Effortless sophistication for today\'s woman',
                'price' => 3800.00,
                'compare_at_price' => 4200.00,
                'sku' => 'OFF-WOM-004',
                'stock' => 30,
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => ['Blue', 'Beige', 'Black'],
                'images' => [
                    '/images/chamly/6.jpg'
                ],
                'featured' => true,
            ],
            [
                'name' => 'Youthful Classics',
                'slug' => 'youthful-classics',
                'description' => 'Timeless style for all ages',
                'price' => 1500.00,
                'compare_at_price' => 1800.00,
                'sku' => 'OFF-YOU-005',
                'stock' => 50,
                'sizes' => ['XS', 'S', 'M'],
                'colors' => ['Brown', 'Navy', 'Burgundy'],
                'images' => [
                    '/images/chamly/7.jpg'
                ],
                'featured' => false,
            ],
        ];

        // Create products for each category
        foreach ($casualProducts as $product) {
            $product['category_id'] = $casualCategory->id;
            $product['is_active'] = true;
            Product::create($product);
        }

        foreach ($gymProducts as $product) {
            $product['category_id'] = $gymCategory->id;
            $product['is_active'] = true;
            Product::create($product);
        }

        foreach ($officialProducts as $product) {
            $product['category_id'] = $officialCategory->id;
            $product['is_active'] = true;
            Product::create($product);
        }
    }
}
