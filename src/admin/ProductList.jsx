import './ProductList.css';

function ProductList({ products, categories, onEdit, onDelete }) {
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  if (products.length === 0) {
    return <div className="admin-empty"><span>📭</span><h3>Mahsulotlar topilmadi</h3><p>Yangi mahsulot qo'shish uchun "Yangi mahsulot" tugmasini bosing</p></div>;
  }

  return (
    <div className="admin-product-table">
      <table>
        <thead><tr><th>Rasm</th><th>Nomi</th><th>Kategoriya</th><th>Narxi</th><th>Stok</th><th>Reyting</th><th>Amallar</th></tr></thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="product-emoji-cell">{product.image}</td>
              <td className="product-name-cell">{product.name}</td>
              <td>{getCategoryName(product.category)}</td>
              <td className="price-cell">{product.price.toLocaleString()} so‘m</td>
              <td><span className={`stock-badge ${product.stock !== false ? 'in-stock' : 'out-stock'}`}>{product.stock !== false ? `📦 ${product.stockCount || 'Bor'}` : '❌ Tugagan'}</span></td>
              <td className="rating-cell">⭐ {product.rating || 4.5}</td>
              <td className="actions-cell"><button className="edit-btn" onClick={() => onEdit(product)}>✏️</button><button className="delete-btn" onClick={() => onDelete(product.id)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;