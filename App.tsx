import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import SpecialMenu from './components/SpecialMenu';
import ContactSection from './components/ContactSection';
import type { Product } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products');
        if (!response.ok) {
          throw new Error('خطا در دریافت محصولات');
        }
        const data = await response.json();
        
        // تبدیل داده‌های API به فرمت Product با اضافه کردن فیلدهای پیش‌فرض
        const formattedProducts: Product[] = data.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          rating: 5, // پیش‌فرض
          imageUrl: `https://images.unsplash.com/photo-1572442388796-11668a67d5b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80`, // پیش‌فرض
          tag: index === 0 ? { text: "جدید", bgColor: "bg-blue-500" } : undefined // تگ برای اولین محصول
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        setError('خطا در بارگذاری محصولات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black/50 items-center justify-center">
        <p className="text-white text-xl">در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-black/50 items-center justify-center">
        <p className="text-white text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black/50">
      <Header cafeName="کافه فرنود" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SpecialMenu />
        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;