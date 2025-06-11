import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../utils/price';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { item_id, title, price, main_image, shop_name } = product;
  
  const imageUrl = main_image?.startsWith('product_image') 
    ? `https://d1mxsdfi62lbg7.cloudfront.net/${main_image}`
    : main_image;
  
  return (
    <Link 
      to={`/product/${item_id}`}
      className={`group relative flex flex-col rounded-lg overflow-hidden transition-shadow duration-300 ${
        featured ? 'shadow-md hover:shadow-xl' : 'hover:shadow-md'
      }`}
    >
      <div className="relative pb-[125%] overflow-hidden bg-gray-100">
        <img
          src={imageUrl || 'https://via.placeholder.com/300x400'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4 bg-white flex-1 flex flex-col">
        {shop_name && (
          <span className="text-gray-500 text-sm uppercase mb-1">{shop_name}</span>
        )}
        
        <h3 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-auto">
          <span className="text-gray-900 font-semibold">{formatPrice(price)}</span>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 pointer-events-none transition-all duration-300"></div>
    </Link>
  );
};

export default ProductCard;