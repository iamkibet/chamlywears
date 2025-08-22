<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\HomepageBlock;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::active()->ordered()->get();
        $homepageBlocks = HomepageBlock::active()->ordered()->get();
        $featuredProducts = Product::active()->featured()->with('category')->take(8)->get();
        $allProducts = Product::active()->with('category')->inRandomOrder()->take(20)->get();

        return Inertia::render('Home/Index', [
            'banners' => $banners,
            'homepageBlocks' => $homepageBlocks,
            'featuredProducts' => $featuredProducts,
            'allProducts' => $allProducts,
        ]);
    }
}
