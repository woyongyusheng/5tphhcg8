import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { Search } from 'lucide-react';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // This is a simple search - in a real app, you'd likely use a more
        // sophisticated search mechanism like full-text search
        const { data, error } = await supabase
          .from('weidian_products')
          .select('*')
          .or(`title.ilike.%${query}%`);
          
        if (error) {
          throw error;
        }
        
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex items-center gap-3 mb-8">
        <Search size={24} className="text-gray-400" />
        <h1 className="text-3xl font-bold">Search Results for "{query}"</h1>
      </div>
      
      <ProductGrid 
        products={products} 
        loading={loading} 
        cols={4}
      />
      
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found matching "{query}"</p>
          <p className="text-gray-600">Try a different search term or browse our categories.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;