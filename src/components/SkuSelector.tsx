import React, { useState } from 'react';

interface AttrValue {
  attrId: number;
  attrValue: string;
  img?: string;
  isShowHotTag: boolean;
}

interface AttrList {
  attrTitle: string;
  attrValues: AttrValue[];
}

interface SkuSelectorProps {
  attrList: AttrList[];
  onImageSelect: (imageUrl: string) => void;
}

const SkuSelector: React.FC<SkuSelectorProps> = ({ attrList, onImageSelect }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    if (window.innerWidth <= 768) {
      if (fullscreenImage) {
        setFullscreenImage(null);
      } else {
        setFullscreenImage(imageUrl);
        onImageSelect(imageUrl);
      }
    } else {
      onImageSelect(imageUrl);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {attrList.map((attr, index) => (
          <div key={index} className="space-y-3">
            <h3 className="font-medium text-gray-700">{attr.attrTitle}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap scrollbar-hide">
              {attr.attrValues.map((value) => (
                <button
                  key={value.attrId}
                  onClick={() => value.img && handleImageClick(value.img)}
                  className={`flex-shrink-0 flex flex-col items-center border rounded-lg p-2 hover:border-gray-400 transition-colors ${
                    value.img ? 'w-20' : 'px-4 py-2'
                  }`}
                >
                  {value.img && (
                    <div className="w-16 h-16 mb-2 overflow-hidden rounded">
                      <img
                        src={value.img}
                        alt={value.attrValue}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span className="text-sm whitespace-nowrap">{value.attrValue}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <img 
            src={fullscreenImage} 
            alt="Full size preview" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}

export default SkuSelector;