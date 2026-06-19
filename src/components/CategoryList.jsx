import './CategoryList.css';

function CategoryList({ categories, activeCategory, setActiveCategory }) {
  const allCategory = { id: 'all', name: 'Barchasi', icon: '🏠' };
  const safeCategories = categories && Array.isArray(categories) ? categories : [];
  const categoryList = [allCategory, ...safeCategories];

  // Rasm linkini to'g'ri formatlash funksiyasi
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  return (
    <div className="category-wrapper">
      <div className="category-scroll">
        {categoryList.map((cat) => {
          const hasImage = cat.image && !cat.icon; // Agar icon bo'lmasa va rasm bo'lsa
          
          return (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">
                {cat.icon ? (
                  // "Barchasi" uchun emoji (🏠) chiqadi
                  cat.icon 
                ) : cat.image ? (
                  // Backenddan kelgan rasm matn shaklida emas, <img> tegi ichida chiqadi!
                  <img 
                    src={getImageUrl(cat.image)} 
                    alt="" 
                    style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                ) : (
                  // Agar hech narsa bo'lmasa standart emoji chiqadi
                  '📦'
                )}
              </span>
              <span className="cat-name">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryList;