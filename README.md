# Chamly Wears - Modern Wear for the Whole Family

A premium ecommerce platform built with Laravel, React, Inertia.js, and Tailwind CSS.

## 🚀 Features

- **Modern Ecommerce**: Beautiful, responsive design with premium aesthetics
- **WhatsApp Checkout**: Seamless checkout flow via WhatsApp integration
- **Admin Panel**: Comprehensive admin dashboard with analytics
- **Mobile-First**: Responsive design optimized for all devices
- **Performance**: Fast loading with optimized assets and lazy loading
- **SEO Ready**: Meta tags, structured data, and clean URLs

## 🛠 Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + Local Storage
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Breeze + Inertia
- **Icons**: Lucide React
- **UI Components**: Radix UI + Custom Components

## 📁 Project Structure

```
chamlywears/
├── app/
│   ├── Http/Controllers/          # Application controllers
│   ├── Models/                    # Eloquent models
│   └── Http/Middleware/           # Custom middleware
├── database/
│   ├── migrations/                # Database migrations
│   └── seeders/                   # Database seeders
├── resources/
│   └── js/
│       ├── Components/            # React components
│       │   ├── ui/               # Reusable UI components
│       │   ├── layout/           # Layout components
│       │   └── common/           # Common components
│       ├── Pages/                 # Inertia page components
│       └── hooks/                 # Custom React hooks
└── routes/                        # Application routes
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL/PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chamlywears
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=chamlywears
   DB_USERNAME=root
   DB_PASSWORD=
   
   WHATSAPP_NUMBER=254705659518
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

8. **Start development server**
   ```bash
   php artisan serve
   ```

9. **Visit the application**
   - Frontend: http://localhost:8000
   - Admin: http://localhost:8000/admin (admin@chamlywears.com / password)

## 🔐 Default Users

- **Admin User**: admin@chamlywears.com / password
- **Regular User**: test@example.com / password

## 📱 Key Features

### Homepage
- Cinematic hero section with call-to-action
- Category spotlight (Casual, Gym, Official)
- Featured products showcase
- Trust indicators and location badges
- Newsletter subscription

### Shop
- Product grid with filtering
- Category-based navigation
- Size and color selection
- Price range filtering
- Sorting options

### Product Detail
- Image gallery with zoom
- Size and color selectors
- Add to cart functionality
- Related products
- WhatsApp checkout integration

### Cart & Checkout
- Persistent cart storage
- Quantity management
- WhatsApp checkout flow
- Order confirmation

### Admin Panel
- Dashboard with analytics
- Product management (CRUD)
- Category management
- Order management
- Customer management
- Content management

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Accent**: Green (#10B981)
- **Background**: White (#FFFFFF)
- **Text**: Gray (#1F2937)

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold, tight tracking
- **Body**: Regular weight, comfortable line height

### Components
- **Cards**: Rounded corners (rounded-2xl)
- **Buttons**: Multiple variants with hover states
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile menu

## 🔌 WhatsApp Integration

The application integrates with WhatsApp for checkout:

```php
// WhatsApp link format
https://wa.me/254705659518?text=Order%20details%20here

// Order message includes:
// - Product details (name, size, color, quantity, price)
// - Customer information (name, phone, address)
// - Total amount
```

## 📊 Analytics

Track user interactions with:
- Product views
- Add to cart events
- Checkout starts
- Order completions
- WhatsApp redirects

## 🚀 Deployment

### Production Build
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
WHATSAPP_NUMBER=254705659518
```

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run frontend tests
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- **Phone**: +254 705 659 518
- **Email**: info@chamlywears.com
- **Website**: https://chamlywears.com

---

Built with ❤️ by the Chamly Wears team
