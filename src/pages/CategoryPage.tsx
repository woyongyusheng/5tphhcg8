import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { supabase } from '../lib/supabase';
import { Product, DisplayCategory, categoryMapping } from '../types';

const ITEMS_PER_PAGE = 20;

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore) return;
      
      setLoading(true);
      try {
        // 获取总数
        const countQuery = supabase
          .from('weidian_products')
          .select('*', { count: 'exact', head: true });

        if (slug) {
          countQuery.eq('category', slug);
        }

        const { count } = await countQuery;
        setTotalCount(count || 0);

        // 获取产品列表
        const query = supabase
          .from('weidian_products')
          .select('*')
          .range(offset, offset + ITEMS_PER_PAGE - 1)
          .order('created_at', { ascending: false });

        if (slug) {
          query.eq('category', slug);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setProducts(prev => [...prev, ...data]);
          setHasMore(data.length === ITEMS_PER_PAGE);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, offset]);

  const categoryName = slug ? categoryMapping[slug as keyof typeof categoryMapping] : 'All Products';

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <span className="text-gray-600">{totalCount} Products</span>
        </div>
        <p className="text-gray-600">Discover our curated selection of {categoryName.toLowerCase()}</p>
      </div>
      
      <ProductGrid 
        products={products} 
        loading={loading && products.length === 0} 
        cols={4}
      />
      
      {hasMore && (
        <div ref={loadingRef} className="text-center py-8">
          {loading && (
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;