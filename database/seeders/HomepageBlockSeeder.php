<?php

namespace Database\Seeders;

use App\Models\HomepageBlock;
use Illuminate\Database\Seeder;

class HomepageBlockSeeder extends Seeder
{
    public function run(): void
    {
        $blocks = [
            [
                'type' => 'hero',
                'config' => [
                    'title' => 'Modern Wear for the Whole Family',
                    'subtitle' => 'Look Good. Feel Unstoppable.',
                    'cta_primary' => 'Shop New Arrivals',
                    'cta_primary_link' => '/shop',
                    'cta_secondary' => 'Explore Categories',
                    'cta_secondary_link' => '/shop',
                    'background_image' => '/images/chamly/20.jpg',
                ],
                'order' => 1,
            ],
            [
                'type' => 'category_spotlight',
                'config' => [
                    'title' => 'Shop by Category',
                    'subtitle' => 'Find your perfect style',
                    'categories' => ['casual', 'gym', 'official'],
                ],
                'order' => 2,
            ],
            [
                'type' => 'feature_grid',
                'config' => [
                    'title' => 'Why Choose Chamly Wears?',
                    'features' => [
                        [
                            'title' => 'Premium Quality',
                            'description' => 'Carefully selected materials for lasting comfort',
                            'icon' => 'star',
                        ],
                        [
                            'title' => 'Family Focused',
                            'description' => 'Styles for every member of your family',
                            'icon' => 'heart',
                        ],
                        [
                            'title' => 'Local Support',
                            'description' => 'Kenyan brand with local customer service',
                            'icon' => 'map-pin',
                        ],
                    ],
                ],
                'order' => 3,
            ],
            [
                'type' => 'marquee',
                'config' => [
                    'text' => 'Dress like you are already famous 💯',
                    'speed' => 'slow',
                ],
                'order' => 4,
            ],
        ];

        foreach ($blocks as $block) {
            HomepageBlock::create($block);
        }
    }
}
