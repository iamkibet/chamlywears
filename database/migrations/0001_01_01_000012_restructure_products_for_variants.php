<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create the new product_variants table
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('sku')->unique();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->decimal('price', 10, 2)->nullable(); // Override product price if needed
            $table->decimal('compare_at_price', 10, 2)->nullable(); // Override product compare price if needed
            $table->integer('stock')->default(0);
            $table->json('images')->nullable(); // Variant-specific images
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index(['product_id', 'is_active']);
            $table->index(['sku']);
        });

        // Now modify the products table to remove variant-specific fields
        Schema::table('products', function (Blueprint $table) {
            // Remove old variant fields
            $table->dropColumn(['sizes', 'colors', 'stock']);
            
            // Add new fields for variant management
            $table->json('available_colors')->nullable(); // List of available colors
            $table->json('available_sizes')->nullable(); // List of available sizes
            $table->boolean('has_variants')->default(false); // Flag to indicate if product has variants
            $table->integer('total_stock')->default(0); // Total stock across all variants
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the product_variants table
        Schema::dropIfExists('product_variants');

        // Restore the products table to its original state
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['available_colors', 'available_sizes', 'has_variants', 'total_stock']);
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->integer('stock')->default(0);
        });
    }
};
