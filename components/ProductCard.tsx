import React from 'react';
import type { Product } from '../types';
import { HeartIcon, StarIcon } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card bg-[#2a1a0e] rounded-2xl overflow-hidden shadow-lg border border-amber-700/40 transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/30 flex flex-col">
      <div className="relative h-48 w-full">
         <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        {product.tag && (
          <div className={`absolute top-3 left-3 px-3 py-1 text-sm font-bold rounded-full shadow-lg ${product.tag.bgColor} text-white`}>
            {product.tag.text}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-stone-100">{product.name}</h3>
          <button aria-label="Like this product" className="text-stone-400 hover:text-red-500 transition-colors">
            <HeartIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-stone-400 text-sm mb-4">{product.description}</p>
        
        <div className="flex items-center mb-auto pb-4" aria-label={`Rating: ${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < product.rating ? 'text-amber-400' : 'text-stone-500'}`} />
          ))}
        </div>

        <button className="mt-4 w-full bg-amber-500 text-stone-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300">
          {product.price}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;