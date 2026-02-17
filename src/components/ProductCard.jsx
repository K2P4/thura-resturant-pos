import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

export default function ProductCard({ product, handleOpenModal, handleDelete, isProduct = false, addToCart }) {
  const handleCardClick = () => {
    if (!isProduct && addToCart) {
      addToCart(product);
    }
  };

  return (
    <Card
      onClick={!isProduct ? handleCardClick : undefined}
      key={product.id}
      className="overflow-hidden bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-primary/80 transition-all duration-300"
    >
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center">
        {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <ImageIcon className="h-10 w-10 text-gray-300" />}
      </div>
      <CardContent className="p-2 mt-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.categories?.name || 'အမျိုးအစားမရှိသေးပါ'}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary/90">{product.price.toLocaleString()} ကျပ်</span>

          {isProduct && (
            <div className="flex gap-1">
              <Button size="icon" variant="icon" onClick={() => handleOpenModal(product)} className="text-blue-600 hover:bg-blue-50 rounded-full">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="icon" onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50 rounded-full">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
