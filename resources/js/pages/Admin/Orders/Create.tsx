import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  DollarSign,
  Save
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

interface CreateOrderProps {
  products: Product[];
}

export default function CreateOrder({ products }: CreateOrderProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: ''
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shipping, setShipping] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + shipping;

  const addProduct = () => {
    if (products.length === 0) return;
    
    const newItem: OrderItem = {
      product_id: products[0].id,
      quantity: 1,
      price: products[0].price,
      total: products[0].price,
      product: products[0]
    };
    
    setOrderItems([...orderItems, newItem]);
  };

  const removeProduct = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...orderItems];
    const item = updatedItems[index];
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.product_id = product.id;
        item.price = product.price;
        item.total = product.price * item.quantity;
        item.product = product;
      }
    } else if (field === 'quantity') {
      item.quantity = parseInt(value) || 1;
      item.total = item.price * item.quantity;
    }
    
    setOrderItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          ...customerInfo,
          items: orderItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          })),
          subtotal,
          shipping,
          total
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Order created successfully!');
        router.visit('/admin/orders');
      } else {
        const error = await response.json();
        alert(`Failed to create order: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred while creating the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Head title="Create Order - Admin" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" size="sm" onClick={() => router.visit('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
            <p className="text-gray-600">Manually create an order for a customer</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Customer Information</span>
                    </CardTitle>
                    <CardDescription>Enter customer details for the order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="+254 700 000 000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input
                          id="postal_code"
                          value={customerInfo.postal_code}
                          onChange={(e) => setCustomerInfo({...customerInfo, postal_code: e.target.value})}
                          placeholder="00100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                          placeholder="Nairobi"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping">Shipping Cost</Label>
                        <Input
                          id="shipping"
                          type="number"
                          value={shipping}
                          onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Order Notes</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        placeholder="Any special instructions or notes for this order..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Order Items</span>
                    </CardTitle>
                    <CardDescription>Add products to the order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orderItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No products added yet</p>
                        <Button onClick={addProduct} className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Product
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orderItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-5">
                                <Select
                                  value={item.product_id.toString()}
                                  onValueChange={(value) => updateProduct(index, 'product_id', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.map((product) => (
                                      <SelectItem key={product.id} value={product.id.toString()}>
                                        <div className="flex items-center space-x-2">
                                          <span>{product.name}</span>
                                          <Badge variant="outline" className="text-xs">
                                            {product.category.name}
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="col-span-2">
                                <Label className="text-xs text-gray-600">Price</Label>
                                <div className="text-sm font-medium">
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <Label className="text-xs text-gray-600">Quantity</Label>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateProduct(index, 'quantity', Math.max(1, item.quantity - 1))}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                                    className="w-16 text-center"
                                    min="1"
                                    max={item.product.stock}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateProduct(index, 'quantity', item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <Label className="text-xs text-gray-600">Total</Label>
                                <div className="text-sm font-medium text-green-600">
                                  {formatCurrency(item.total)}
                                </div>
                              </div>
                              
                              <div className="col-span-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeProduct(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button type="button" onClick={addProduct} variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Product
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                {/* Order Summary */}
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Order Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span className="font-medium">{formatCurrency(shipping)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-green-600">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || orderItems.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Creating Order...' : 'Create Order'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Available Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                    <CardDescription>Products you can add to the order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 border rounded text-sm">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-gray-500">{product.category.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(product.price)}</div>
                            <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

// Helper function for currency formatting
function formatCurrency(value: number): string {
  return `KES ${value.toLocaleString()}`;
}
