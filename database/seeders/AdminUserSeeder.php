<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@chamlywears.com',
            'phone' => '+254755449012',
            'city' => 'Nairobi',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);
    }
}
