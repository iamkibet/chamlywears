import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  products_count: number;
  created_at: string;
}

interface AdminCategoriesProps {
  categories: {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminCategories({ categories }: AdminCategoriesProps) {
  return (
    <MainLayout>
      <Head title="Categories Management - Admin" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600">Manage product categories and organization</p>
            </div>
            <Button asChild>
              <Link href="/admin/categories/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.total}</div>
                <p className="text-xs text-muted-foreground">
                  Active categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>
                Manage your product categories and their organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Products</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Slug</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.data.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {category.description || 'No description'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">
                            {category.products_count} products
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-sm">
                          {category.slug}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/categories/${category.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {categories.last_page > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing {((categories.current_page - 1) * categories.per_page) + 1} to{' '}
                    {Math.min(categories.current_page * categories.per_page, categories.total)} of{' '}
                    {categories.total} results
                  </div>
                  <div className="flex space-x-2">
                    {categories.current_page > 1 && (
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                    )}
                    {categories.current_page < categories.last_page && (
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
