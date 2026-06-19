import './Recommended.css';

function Recommended({ products, addToCart, addToViewed, currentLang, getImageUrl }) {
  return (
    <div className="products-grid">
      {products.map(product => (
        <div 
          key={product.id} 
          className="product-card"
          onClick={() => addToViewed(product.id)}
        >
          <div className="product-image">
            {getImageUrl && getImageUrl(product) ? (
              <img src={getImageUrl(product)} alt={product.name} className="product-img" />
            ) : (
              <span className="product-emoji">{product.image || '📦'}</span>
            )}
          </div>
          <h3 className="product-title">{product.name}</h3>
          <div className="product-price">
            <span className="current-price">{Number(product.price).toLocaleString()} so'm</span>
            {product.old_price && <span className="old-price">{Number(product.old_price).toLocaleString()} so'm</span>}
          </div>
          <div className="product-rating">
            {'⭐'.repeat(Math.floor(product.rating || 4))}
            <span className="rating-num">{product.rating || 4}</span>
          </div>
          <button 
            className="add-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            🛒 {currentLang === 'uz' ? 'Savatga' : 'В корзину'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Recommended;