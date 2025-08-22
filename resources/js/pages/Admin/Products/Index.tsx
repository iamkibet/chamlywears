import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  total_stock: number;
  has_variants: boolean;
  is_active: boolean;
  featured: boolean;
  category: {
    name: string;
  };
  created_at: string;
  variants_count?: number;
}

interface ProductsIndexProps {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ProductsIndex({ products }: ProductsIndexProps) {
  const formatCurrency = (value: number) => {
    return `KES ${Number(value).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <Head title="Products - Chamly Wears" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/products/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Link>
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.data.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {product.category.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      <Badge 
                        variant={product.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        Stock: {product.total_stock}
                      </span>
                      {product.has_variants && (
                        <div className="text-xs text-purple-600 font-medium">
                          {product.variants_count || 0} variants
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created: {formatDate(product.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {products.data.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first product
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin/products/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination Info */}
          {products.data.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Showing {((products.current_page - 1) * products.per_page) + 1} to{' '}
              {Math.min(products.current_page * products.per_page, products.total)} of{' '}
              {products.total} products
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
