import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Save, AlertCircle } from 'lucide-react';

export default function Profile({ auth, mustVerifyEmail, status }: any) {
  const { data, setData, patch, errors, processing } = useForm({
    name: auth.user.name || '',
    email: auth.user.email || '',
    phone: auth.user.phone || '',
    address: auth.user.address || '',
    city: auth.user.city || '',
    postal_code: auth.user.postal_code || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <MainLayout>
      <Head title="Profile Settings" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-lg text-gray-600 mt-2">Update your personal information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your profile details. These will be used for order processing and delivery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={data.name?.split(' ')[0] || ''}
                      onChange={(e) => {
                        const lastName = data.name?.split(' ').slice(1).join(' ') || '';
                        setData('name', `${e.target.value} ${lastName}`.trim());
                      }}
                      className="mt-1"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={data.name?.split(' ').slice(1).join(' ') || ''}
                      onChange={(e) => {
                        const firstName = data.name?.split(' ')[0] || '';
                        setData('name', `${firstName} ${e.target.value}`.trim());
                      }}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="mt-1"
                    placeholder="+254700000000"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="mt-1"
                    rows={2}
                    placeholder="Enter your full street address"
                    required
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., Nairobi"
                      required
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={data.postal_code}
                      onChange={(e) => setData('postal_code', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., 00100"
                    />
                    {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      <>
                        <Save className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {status && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <Save className="h-5 w-5 mr-2" />
                <span className="font-medium">{status}</span>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Profile Completion Required</h3>
                <p className="text-sm text-blue-700 mt-1">
                  All fields marked with * are required to complete checkout. 
                  Please ensure your profile is complete before placing orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

