import React from 'react';
import { Link } from 'react-router-dom';
import { DisplayCategory, reverseCategoryMapping } from '../types';

interface CategoryCard {
  category: DisplayCategory;
  image: string;
  description: string;
}

const categories: CategoryCard[] = [
  {
    category: 'Shoes',
    image: '/images/categories/Shoes.jpeg',
    description: 'Step out in style with our curated selection of footwear'
  },
  {
    category: 'T-Shirts',
    image: '/images/categories/T-Shirts.jpeg',
    description: 'Essential tees for every day comfort and style'
  },
  {
    category: 'Pants & Shorts',
    image: '/images/categories/Pants.jpeg',
    description: 'Premium outerwear to elevate your wardrobe'
  },
  {
    category: 'Hoodies & Sweaters',
    image: '/images/categories/Hoodies.jpeg',
    description: 'Complete your look with our stylish accessories'
  },
  {
    category: 'Jackets',
    image: '/images/categories/Jackets.jpeg',
    description: 'Complete your look with our stylish accessories'
  },
  {
    category: 'Accessories',
    image: '/images/categories/Accessories.jpeg',
    description: 'Complete your look with our stylish accessories'
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((item) => (
            <Link 
              key={item.category}
              to={`/category/${reverseCategoryMapping[item.category]}`}
              className="group relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative pb-[120%]">
                <img 
                  src={item.image} 
                  alt={item.category} 
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.category}</h3>
                  <p className="text-sm text-gray-200 mb-3">{item.description}</p>
                  <span className="inline-block text-sm font-medium border-b border-white pb-1 transition-colors group-hover:border-yellow-400 group-hover:text-yellow-400">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;