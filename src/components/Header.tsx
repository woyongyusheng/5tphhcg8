import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { DisplayCategory, reverseCategoryMapping } from '../types';

const categories: DisplayCategory[] = [
  'Shoes',
  'T-Shirts',
  'Pants & Shorts',
  'Hoodies & Sweaters',
  'Jackets',
  'Accessories',
  'Others'
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            StyleGuide
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${reverseCategoryMapping[category]}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-3 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search size={18} className="text-gray-500" />
              </button>
            </form>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t mt-2 py-4 px-4 shadow-lg">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-3 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search size={18} className="text-gray-500" />
            </button>
          </form>
          <nav className="flex flex-col space-y-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${reverseCategoryMapping[category]}`}
                className="text-gray-600 hover:text-gray-900 transition-colors py-2 border-b border-gray-100"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;