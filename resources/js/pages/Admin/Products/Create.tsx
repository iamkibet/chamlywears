import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CreativeImageUpload from '@/components/CreativeImageUpload';
import CategoryModal from '@/components/CategoryModal';
import {
  Package,
  Tag,
  DollarSign,
  Hash,
  Box,
  Palette,
  Ruler,
  Image,
  Save,
  ArrowLeft,
  Plus,
  X,
  Upload,
  Layers,
  Copy,
  Trash2
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductVariant {
  id?: number;
  color: string;
  size: string;
  price: string;
  compare_at_price: string;
  stock: string;
  images: string[];
}

interface CreateProductProps {
  categories: Category[];
}

export default function CreateProduct({ categories }: CreateProductProps) {
  const [localCategories, setLocalCategories] = useState(categories);
  
  const { data, setData, post, processing, errors } = useForm({
    category_id: '',
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    images: [] as string[],
    is_active: true,
    featured: false,
    variants: [
      {
        color: '',
        size: '',
        price: '',
        compare_at_price: '',
        stock: '',
        images: []
      }
    ] as ProductVariant[],
  });

  const [newVariantImage, setNewVariantImage] = useState<{ variantIndex: number; image: string }>({ variantIndex: 0, image: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/products');
  };

  const addVariant = () => {
    setData('variants', [
      ...data.variants,
      {
        color: '',
        size: '',
        price: '',
        compare_at_price: '',
        stock: '',
        images: []
      }
    ]);
  };

  const removeVariant = (index: number) => {
    if (data.variants.length > 1) {
      const newVariants = data.variants.filter((_, i) => i !== index);
      setData('variants', newVariants);
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...data.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setData('variants', newVariants);
  };

  const addVariantImage = (variantIndex: number) => {
    if (newVariantImage.image.trim() && !data.variants[variantIndex].images.includes(newVariantImage.image.trim())) {
      const newVariants = [...data.variants];
      newVariants[variantIndex].images.push(newVariantImage.image.trim());
      setData('variants', newVariants);
      setNewVariantImage({ variantIndex: 0, image: '' });
    }
  };

  const removeVariantImage = (variantIndex: number, image: string) => {
    const newVariants = [...data.variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter(img => img !== image);
    setData('variants', newVariants);
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setData('sku', `CHM-${timestamp}-${random}`);
  };

  const copyVariant = (index: number) => {
    const variantToCopy = data.variants[index];
    const newVariant = {
      ...variantToCopy,
      color: variantToCopy.color,
      size: variantToCopy.size,
      price: variantToCopy.price,
      compare_at_price: variantToCopy.compare_at_price,
      stock: '',
      images: []
    };
    setData('variants', [...data.variants, newVariant]);
  };

  const getTotalStock = () => {
    return data.variants.reduce((total, variant) => total + (parseInt(variant.stock) || 0), 0);
  };

  const getAvailableColors = () => {
    return [...new Set(data.variants.map(v => v.color).filter(Boolean))];
  };

  const getAvailableSizes = () => {
    return [...new Set(data.variants.map(v => v.size).filter(Boolean))];
  };

  const handleCategoryCreated = (newCategory: any) => {
    setLocalCategories([...localCategories, newCategory]);
    setData('category_id', newCategory.id.toString());
  };

  return (
    <MainLayout>
      <Head title="Create Product - Chamly Wears" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </a>
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
              <p className="text-gray-600">Add a new product with variants to your store inventory</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Basic Product Information
                </CardTitle>
                <CardDescription>
                  Enter the core details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Selection with Create Category Modal */}
                  <div className="space-y-2">
                    <Label htmlFor="category_id" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={data.category_id}
                        onValueChange={(value) => setData('category_id', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {localCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CategoryModal
                        onCategoryCreated={handleCategoryCreated}
                        parentCategories={localCategories}
                        trigger={
                          <Button type="button" variant="outline" size="sm" className="whitespace-nowrap">
                            <Plus className="h-4 w-4 mr-2" />
                            New
                          </Button>
                        }
                      />
                    </div>
                    {errors.category_id && (
                      <p className="text-sm text-red-600">{errors.category_id}</p>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Enter product name"
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe your product..."
                    rows={3}
                    className="w-full"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Base Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Selling Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        KES
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="0.00"
                        className="pl-12"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price" className="text-sm font-medium">
                      Compare at Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        KES
                      </span>
                      <Input
                        id="compare_at_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.compare_at_price}
                        onChange={(e) => setData('compare_at_price', e.target.value)}
                        placeholder="0.00"
                        className="pl-12"
                      />
                    </div>
                    {errors.compare_at_price && (
                      <p className="text-sm text-red-600">{errors.compare_at_price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium">
                      Base SKU <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        placeholder="Enter SKU"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSKU}
                        className="whitespace-nowrap"
                      >
                        <Hash className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                    {errors.sku && (
                      <p className="text-sm text-red-600">{errors.sku}</p>
                    )}
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                    />
                    <Label htmlFor="is_active" className="text-sm font-medium">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={data.featured}
                      onCheckedChange={(checked) => setData('featured', checked as boolean)}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium">
                      Featured
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-purple-600" />
                      Product Variants
                    </CardTitle>
                    <CardDescription>
                      Define different variations of your product (colors, sizes, stock levels)
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={addVariant}
                    variant="outline"
                    size="sm"
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variants Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700">Total Variants</p>
                    <p className="text-2xl font-bold text-purple-900">{data.variants.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700">Total Stock</p>
                    <p className="text-2xl font-bold text-purple-900">{getTotalStock()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700">Colors</p>
                    <p className="text-2xl font-bold text-purple-900">{getAvailableColors().length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700">Sizes</p>
                    <p className="text-2xl font-bold text-purple-900">{getAvailableSizes().length}</p>
                  </div>
                </div>

                {/* Variants List */}
                <div className="space-y-4">
                  {data.variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Variant {index + 1}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyVariant(index)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          {data.variants.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeVariant(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Color */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Palette className="h-4 w-4 text-pink-500" />
                            Color
                          </Label>
                          <Input
                            value={variant.color}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                            placeholder="e.g., Blue, Red"
                            className="w-full"
                          />
                        </div>

                        {/* Size */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-indigo-500" />
                            Size
                          </Label>
                          <Input
                            value={variant.size}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                            placeholder="e.g., S, M, L, XL"
                            className="w-full"
                          />
                        </div>

                        {/* Price Override */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            Price Override
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                              KES
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', e.target.value)}
                              placeholder="Leave empty for base price"
                              className="pl-12"
                            />
                          </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Box className="h-4 w-4 text-amber-500" />
                            Stock <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                            placeholder="0"
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Variant Images */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Image className="h-4 w-4 text-purple-500" />
                          Variant Images
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={newVariantImage.variantIndex === index ? newVariantImage.image : ''}
                            onChange={(e) => setNewVariantImage({ variantIndex: index, image: e.target.value })}
                            placeholder="Add image URL for this variant"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addVariantImage(index)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Variant Images Preview */}
                        {variant.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {variant.images.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative group">
                                <img
                                  src={image}
                                  alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                                  className="w-16 h-16 object-cover rounded border"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEN0Q5RUIiLz4KPHBhdGggZD0iTTQwIDQwSDEwVjYwSDEwVjQwSDBWNDBIMFY2MEgxMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantImage(index, image)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Variants Validation */}
                {errors.variants && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.variants}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-indigo-600" />
                  Main Product Images
                </CardTitle>
                <CardDescription>
                  Add general product images that apply to all variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreativeImageUpload
                  images={data.images}
                  onImagesChange={(images) => setData('images', images)}
                  title="Main Product Images"
                  description="Upload images that showcase your product. The first image will be the main product image."
                  maxImages={10}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <a href="/admin/dashboard">Cancel</a>
              </Button>
              <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Creating...' : 'Create Product with Variants'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
