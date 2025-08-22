<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateFromCartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_order_from_cart(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'cart_items' => [
                [
                    'id' => 1,
                    'name' => 'Test Product',
                    'image' => '/images/chamly/1.jpg',
                    'slug' => 'test-product',
                    'size' => 'M',
                    'color' => 'Black',
                    'price' => 1999,
                    'quantity' => 2,
                ],
            ],
            'customer_info' => [
                'firstName' => 'John',
                'lastName' => 'Doe',
                'email' => 'john@example.com',
                'phone' => '+254700000000',
                'street' => '123 Test Street',
                'city' => 'Nairobi',
                'postalCode' => '00100',
                'notes' => 'Please call on arrival',
            ],
            'totals' => [
                'subtotal' => 3998,
                'shipping' => 0,
                'total' => 3998,
            ],
        ];

        $response = $this->postJson(route('orders.create-from-cart'), $payload);

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'order' => [
                    'id', 'order_number', 'status', 'subtotal', 'shipping', 'total',
                    'customer_name', 'customer_email', 'customer_phone', 'customer_address', 'customer_city',
                    'items' => [
                        [
                            'id', 'product_id', 'product_name', 'product_slug', 'size', 'color', 'price', 'quantity',
                        ],
                    ],
                ],
            ]);
    }

    public function test_create_order_from_cart_requires_fields(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'cart_items' => [], // missing items
            'customer_info' => [
                'firstName' => '', // invalid
                'lastName' => '', // invalid
                'email' => 'not-an-email', // invalid
                'phone' => '',
                'street' => '',
                'city' => '',
            ],
            'totals' => [
                'subtotal' => 0,
                'shipping' => 0,
                'total' => 0,
            ],
        ];

        $response = $this->postJson(route('orders.create-from-cart'), $payload);

        $response->assertStatus(422);
    }
}



