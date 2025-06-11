import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts, getPlatforms } from '../lib/supabase';
import ProductGrid from '../components/ProductGrid';
import PlatformModal from '../components/PlatformModal';
import SkuSelector from '../components/SkuSelector';
import { ChevronRight, Star, Package, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon, X, Share2 } from 'lucide-react';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/price';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [skuData, setSkuData] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth <= 768;

  // Get all images including the main image and QC images
  const allImages = React.useMemo(() => {
    if (!product) return [];
    
    const images: string[] = [];
    
    // Add main image
    if (product.main_image) {
      const mainImage = product.main_image.startsWith('product_image')
        ? `https://d1mxsdfi62lbg7.cloudfront.net/${product.main_image}`
        : product.main_image;
      images.push(mainImage);
    }
    
    // Add QC images if they exist
    if (product.qc_image_group_map) {
      Object.values(product.qc_image_group_map).forEach((imageUrl: any) => {
        images.push(imageUrl);
      });
    }
    
    return images;
  }, [product]);

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    const newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    handleImageSelect(allImages[newIndex], newIndex);
  };

  const handleNextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    handleImageSelect(allImages[newIndex], newIndex);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [productData, platformsData] = await Promise.all([
          getProductById(id),
          getPlatforms()
        ]);

        if (productData) {
          setProduct(productData);
          const mainImage = productData.main_image?.startsWith('product_image')
            ? `https://d1mxsdfi62lbg7.cloudfront.net/${productData.main_image}`
            : productData.main_image;
          setSelectedImage(mainImage || '');
          
          if (productData.category) {
            const related = await getRelatedProducts(productData.category, id, 4);
            setRelatedProducts(related);
          }

          // Fetch SKU data using supabase client directly
          const skuResponse = await fetch(
            `${supabase.supabaseUrl}/functions/v1/get-sku-info?itemId=${productData.item_id}`,
            {
              headers: {
                Authorization: `Bearer ${supabase.supabaseKey}`,
              },
            }
          );
          const skuJson = await skuResponse.json();
          if (skuJson.result?.attrList) {
            setSkuData(skuJson.result.attrList);
          }
        }

        setPlatforms(platformsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-24">   
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b z-40 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="p-2 -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  text: product.title,
                  url: window.location.href,
                });
              }
            }}
            className="p-2"
          >
            <Share2 size={20} />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-24">
        {/* 面包屑导航 - 在移动端隐藏 */}
        <nav className="hidden md:flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          {product.category && (
            <>
              <Link 
                to={`/category/${product.category}`} 
                className="text-gray-500 hover:text-gray-900"
              >
                {product.category}
              </Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 mb-16">
          {/* 商品图片区域 */}
          <div className="lg:w-1/2">
            <div 
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square cursor-zoom-in"
              onClick={toggleFullscreen}
            >
              <img 
                src={selectedImage} 
                alt={product.title} 
                className="w-full h-full object-contain object-center"
              />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
            
            {/* 缩略图列表 - 移动端优化 */}
            {allImages.length > 0 && (
              <div className="relative">
                <div 
                  ref={scrollContainerRef}
                  className="overflow-x-auto scrollbar-hide -mx-4 px-4"
                >
                  <div className="flex gap-2 pb-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(image, index)}
                        className={`flex-none w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded overflow-hidden ${
                          selectedImage === image ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.title} view ${index + 1}`} 
                          className="w-full h-full object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 商品信息区域 */}
          <div className="lg:w-1/2">
            {product.shop_name && (
              <h3 className="text-gray-500 uppercase text-sm mb-1">{product.shop_name}</h3>
            )}
            
            <h1 className="text-xl md:text-3xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
              {!isMobile && (
                <button 
                  onClick={() => setIsPlatformModalOpen(true)}
                  className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
                >
                  Buy Link
                </button>
              )}
            </div>

            {skuData && (
              <div className="mb-6">
                <SkuSelector 
                  attrList={skuData} 
                  onImageSelect={(imageUrl) => handleImageSelect(imageUrl, allImages.length)}
                />
              </div>
            )}

            {/* 商品描述 - 移动端优化 */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw size={16} />
                <span>30 Days Return</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 相关商品推荐 */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            <ProductGrid 
              products={relatedProducts} 
              title="" 
              cols={isMobile ? 2 : 4} 
            />
          </div>
        )}
      </div>

      {/* 移动端底部购买栏 - 优化 */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-40">
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-xl font-bold">{formatPrice(product.price)}</div>
          </div>
          <button 
            onClick={() => setIsPlatformModalOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-md font-medium flex-1 ml-4"
          >
            Buy Now
          </button>
        </div>
      )}

      {/* Modals */}
      <PlatformModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        platforms={platforms}
        itemId={product.item_id}
      />
      
      {/* 全屏图片查看 */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <button 
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <ChevronLeft size={32} />
            </button>
            
            <img 
              src={selectedImage} 
              alt={product.title} 
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <ChevronRightIcon size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;