import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Heart, User, Zap, ArrowRight } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginPrompt({ isOpen, onClose, onLogin }: LoginPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Save This Item</CardTitle>
          <CardDescription>
            Login to save items you love and get personalized recommendations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Exclusive Benefits</p>
                <p className="text-sm text-blue-700">10% off first order + early access to sales</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-gray-900 hover:bg-gray-800">
              <Link href="/login" onClick={onLogin}>
                <User className="mr-2 h-4 w-4" />
                Login to Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">
                Create New Account
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't worry, you can continue shopping without an account
            </p>
            <Button
              variant="link"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
