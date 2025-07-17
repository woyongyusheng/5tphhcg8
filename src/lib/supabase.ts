import { createClient } from '@supabase/supabase-js';
import type { Product, DisplayCategory } from '../types';
import { reverseCategoryMapping } from '../types';

const supabaseUrl = "https://xyxuzaocdkhdxrzahgux.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eHV6YW9jZGtoZHhyemFoZ3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjY5MjcsImV4cCI6MjA2NTIwMjkyN30.rtEfL8ZLY4l1a5T7d8xP96134gutEd-B3XxeqAB2Phs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts(category?: DisplayCategory, limit?: number): Promise<Product[]> {
  let query = supabase
    .from('weidian_products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category && category !== 'All') {
    const dbCategory = reverseCategoryMapping[category];
    if (dbCategory) {
      query = query.eq('category', dbCategory);
    }
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('weidian_products')
    .select('*')
    .eq('item_id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data as Product;
}

export async function getRelatedProducts(category: string, currentProductId: string, limit: number = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('weidian_products')
    .select('*')
    .eq('category', category)
    .neq('item_id', currentProductId)
    .limit(limit);
  
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
  
  return data as Product[];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('weidian_products')
    .select('*')
    .or(`title.ilike.%${query}%, shop_name.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching products:', error);
    return [];
  }
  
  return data as Product[];
}

export async function getFeaturedProducts(limit: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from('weidian_products')
    .select('*')
    //.order('price', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return data as Product[];
}

export async function getNewArrivals(limit: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from('weidian_products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
  
  return data as Product[];
}

export async function getPlatforms() {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching platforms:', error);
    return [];
  }

  return data;
}
