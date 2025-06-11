import React from 'react';
import { X } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  logo_url: string;
  url_pattern: string;
}

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: Platform[];
  itemId: string;
}

const PlatformModal: React.FC<PlatformModalProps> = ({ isOpen, onClose, platforms, itemId }) => {
  if (!isOpen) return null;

  const handlePlatformClick = (urlPattern: string) => {
    const url = urlPattern.replace('${itemNo}', itemId);
    window.open(url, '_blank');
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className={`bg-white w-full md:w-auto md:max-w-4xl md:rounded-lg relative ${
          isMobile ? 'rounded-t-2xl max-h-[80vh] overflow-y-auto' : 'p-6'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header for mobile */}
        <div className={`sticky top-0 bg-white z-10 flex items-center justify-between p-4 md:p-0 md:mb-4 ${
          isMobile ? 'border-b' : ''
        }`}>
          <h2 className="text-xl font-bold">Choose Platform</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 md:p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform.url_pattern)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <img 
                  src={platform.logo_url} 
                  alt={platform.name} 
                  className="w-12 h-12 object-contain"
                />
                <span className="font-medium text-sm text-center">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom safe area for mobile */}
        {isMobile && <div className="h-6" />}
      </div>
    </div>
  );
};

export default PlatformModal;