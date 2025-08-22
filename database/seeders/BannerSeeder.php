<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Modern Wear for the Whole Family',
                'subtitle' => 'Look Good. Feel Unstoppable.',
                'cta_label' => 'Shop New Arrivals',
                'cta_link' => '/shop',
                'image_url' => '/images/chamly/20.jpg',
                'order' => 1,
            ],
            [
                'title' => 'New Collection Available',
                'subtitle' => 'Discover the latest trends in casual, gym, and official wear',
                'cta_label' => 'Explore Categories',
                'cta_link' => '/shop',
                'image_url' => '/images/chamly/19.jpg',
                'order' => 2,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }
    }
}
