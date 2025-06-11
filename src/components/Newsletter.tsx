import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send this to your backend
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    setError('');
    setEmail('');
    
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Mail size={40} className="mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter for style tips, new arrivals, and exclusive content.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
            </div>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-3 px-6 rounded-md transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          {isSubmitted && (
            <div className="mt-4 text-green-400 animate-fade-in">
              Thanks for subscribing! We'll be in touch soon.
            </div>
          )}
          
          <p className="text-gray-400 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;