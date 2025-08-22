import React from 'react';
import { Head } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface ShopProps {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  categories: Category[];
  filters: {
    search?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
  };
}

export default function Shop({ products, categories, filters }: ShopProps) {
  return (
    <MainLayout>
      <Head title="Shop - Chamly Wears" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
            <p className="text-lg text-gray-600">Discover our premium collection</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    placeholder="Search products..."
                    defaultValue={filters.search}
                    className="w-full"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select defaultValue={filters.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      defaultValue={filters.min_price}
                      className="w-full"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      defaultValue={filters.max_price}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <Button className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing {products.data.length} of {products.total} products
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {products.last_page > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled={products.current_page === 1}>
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {products.current_page} of {products.last_page}
                    </span>
                    <Button variant="outline" size="sm" disabled={products.current_page === products.last_page}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
