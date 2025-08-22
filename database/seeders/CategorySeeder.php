<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Casual',
                'slug' => 'casual',
                'description' => 'Comfortable everyday wear for the whole family',
                'order' => 1,
            ],
            [
                'name' => 'Gym',
                'slug' => 'gym',
                'description' => 'Performance-ready activewear for workouts and sports',
                'order' => 2,
            ],
            [
                'name' => 'Official',
                'slug' => 'official',
                'description' => 'Professional attire for work and formal occasions',
                'order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            $category['is_active'] = true;
            Category::create($category);
        }
    }
}
