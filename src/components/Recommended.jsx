import './Recommended.css';

function Recommended({ products, addToCart, addToViewed, getImageUrl }) {
  // products array emas yoki yo'q bo'lsa
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="no-products">
        <span>📦</span>
        <p>Hozircha mahsulotlar yo'q</p>
        <p>Admin panel orqali mahsulot qo'shing</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        // Mahsulot ID si bo'lishi kerak
        if (!product || !product.id) return null;
        
        const productPrice = Number(product.price) || 0;
        const productRating = Number(product.rating) || 4;
        
        return (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => addToViewed && addToViewed(product.id)}
          >
            <div className="product-image">
              {getImageUrl && getImageUrl(product) ? (
                <img 
                  src={getImageUrl(product)} 
                  alt={product.name} 
                  className="product-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <span className="product-emoji">{product.image || '📦'}</span>
              )}
            </div>
            
            <h3 className="product-title">{product.name || 'Noma\'lum'}</h3>
            
            <div className="product-price">
              <span className="current-price">{productPrice.toLocaleString()} so'm</span>
              {product.old_price && (
                <span className="old-price">{Number(product.old_price).toLocaleString()} so'm</span>
              )}
            </div>
            
            <div className="product-rating">
              {'⭐'.repeat(Math.floor(productRating))}
              <span className="rating-num">{productRating}</span>
            </div>
            
            <button 
              className="add-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (addToCart) {
                  addToCart(product);
                }
              }}
            >
              🛒 Savatga
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Recommended;