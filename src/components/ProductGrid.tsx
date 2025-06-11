import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  cols?: 2 | 3 | 4;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  cols = 4,
  loading = false 
}) => {
  // Map cols number to Tailwind classes
  const gridCols = {
    2: 'grid-cols-2', // 移动端和桌面端都是两列
    3: 'grid-cols-2 md:grid-cols-3', // 移动端两列，平板三列
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', // 移动端两列，平板三列，桌面端四列
  };

  if (loading) {
    return (
      <div className="my-8">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className={`grid ${gridCols[cols]} gap-4 md:gap-6`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg pb-[125%] relative"></div>
              <div className="mt-3 bg-gray-200 h-5 rounded w-2/3"></div>
              <div className="mt-2 bg-gray-200 h-4 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-8">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className={`grid ${gridCols[cols]} gap-4 md:gap-6`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;