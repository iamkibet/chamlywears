import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Plus, 
  X,
  Package
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AdminProductCreateProps {
  categories: Category[];
}

export default function AdminProductCreate({ categories }: AdminProductCreateProps) {
  const [sizes, setSizes] = useState(['M']);
  const [colors, setColors] = useState(['Black']);
  const [images, setImages] = useState(['/images/chamly/1.jpg']);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    stock: '',
    category_id: '',
    sizes: sizes,
    colors: colors,
    images: images,
    featured: false,
  });

  const addSize = () => {
    setSizes([...sizes, '']);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
    setData('sizes', newSizes);
  };

  const addColor = () => {
    setColors([...colors, '']);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
    setData('colors', newColors);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    setData('images', newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('sizes', sizes);
    setData('colors', colors);
    setData('images', images);
    post('/admin/products');
  };

  return (
    <MainLayout>
      <Head title="Create Product - Admin Dashboard" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                <p className="text-gray-600">Add a new product to your catalog</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Product name, description, and basic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slug">Product Slug *</Label>
                    <Input
                      id="slug"
                      value={data.slug}
                      onChange={(e) => setData('slug', e.target.value)}
                      placeholder="product-name-slug"
                      required
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe your product..."
                      rows={4}
                      required
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category_id">Category *</Label>
                    <select
                      id="category_id"
                      value={data.category_id}
                      onChange={(e) => setData('category_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>
                    Set pricing, stock levels, and SKU
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price (KES) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="compare_at_price">Compare at Price (KES)</Label>
                    <Input
                      id="compare_at_price"
                      type="number"
                      step="0.01"
                      value={data.compare_at_price}
                      onChange={(e) => setData('compare_at_price', e.target.value)}
                      placeholder="0.00"
                    />
                    {errors.compare_at_price && (
                      <p className="text-sm text-red-600 mt-1">{errors.compare_at_price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={data.sku}
                      onChange={(e) => setData('sku', e.target.value)}
                      placeholder="PRODUCT-001"
                      required
                    />
                    {errors.sku && (
                      <p className="text-sm text-red-600 mt-1">{errors.sku}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={data.stock}
                      onChange={(e) => setData('stock', e.target.value)}
                      placeholder="0"
                      required
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={data.featured}
                      onCheckedChange={(checked) => setData('featured', checked as boolean)}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sizes */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Available Sizes
                  <Button type="button" variant="outline" size="sm" onClick={addSize}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add the sizes available for this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={size}
                        onChange={(e) => updateSize(index, e.target.value)}
                        placeholder="M"
                        className="text-center"
                      />
                      {sizes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSize(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Available Colors
                  <Button type="button" variant="outline" size="sm" onClick={addColor}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add the colors available for this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        placeholder="Black"
                        className="text-center"
                      />
                      {colors.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeColor(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Images
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add image URLs for this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="/images/chamly/image.jpg"
                        className="flex-1"
                      />
                      {images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button asChild variant="outline">
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
