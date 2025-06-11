import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import FeaturedCategories from '../components/FeaturedCategories';
import Newsletter from '../components/Newsletter';
import { getNewArrivals, getFeaturedProducts } from '../lib/supabase';
import type { Product } from '../types';

const Home: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newArrivalsData, featuredProductsData] = await Promise.all([
          getNewArrivals(8),
          getFeaturedProducts(4)
        ]);
        
        setNewArrivals(newArrivalsData);
        setFeaturedProducts(featuredProductsData);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to StyleGuide</h2>
          <p className="text-gray-600 leading-relaxed">
            Your ultimate destination for fashion discovery and style inspiration. We curate the finest products 
            from around the world, presenting them in a beautiful, easy-to-browse format. 
            Explore our collections to find your perfect style statement.
          </p>
        </div>
        
        <ProductGrid 
          products={featuredProducts} 
          title="Featured Products" 
          cols={4}
          loading={loading}
        />
      </div>
      
      <FeaturedCategories />
      
      <div className="container mx-auto px-4 py-16">
        <ProductGrid 
          products={newArrivals} 
          title="New Arrivals" 
          loading={loading}
        />
      </div>
      
      <Newsletter />
    </div>
  );
};

export default Home;