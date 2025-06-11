import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Fashion hero" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-32 md:py-40 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Your <span className="text-yellow-400">Perfect Style</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Explore curated collections from the world's most innovative brands. 
            We showcase premium fashion pieces to inspire your next style evolution.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Hero;