import './ViewedProducts.css';

function ViewedProducts({ viewedProducts, products, addToCart, addToViewed, getImageUrl }) {
  const viewedItems = products.filter(p => viewedProducts.includes(p.id));

  if (viewedItems.length === 0) return null;

  return (
    <section className="viewed-section">
      <div className="section-header">
        <h2>📌 Siz ko'rgan mahsulotlar</h2>
      </div>
      <div className="viewed-scroll">
        {viewedItems.map(product => (
          <div 
            key={product.id} 
            className="viewed-card"
            onClick={() => addToViewed(product.id)}
          >
            <div className="viewed-image">
              {getImageUrl && getImageUrl(product) ? (
                <img src={getImageUrl(product)} alt={product.name} className="viewed-img" />
              ) : (
                <span className="viewed-emoji">{product.image || '📦'}</span>
              )}
            </div>
            <div className="viewed-info">
              <p className="viewed-name">{product.name}</p>
              <p className="viewed-price">{Number(product.price).toLocaleString()} so'm</p>
              <button 
                className="viewed-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ViewedProducts;