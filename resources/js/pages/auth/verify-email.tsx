import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { post, processing } = useForm();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/email/verification-notification');
  };

  return (
    <>
      <Head title="Email Verification" />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    If you didn't receive the email, we will gladly send you another.
                  </p>
                  
                  <form onSubmit={submit}>
                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full"
                    >
                      {processing ? 'Sending...' : 'Resend Verification Email'}
                    </Button>
                  </form>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already verified?{' '}
                    <Button variant="link" className="p-0 h-auto">
                      Continue to dashboard
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
