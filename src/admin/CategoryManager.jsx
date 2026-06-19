import './CategoryList.css';

function CategoryList({ categories, activeCategory, setActiveCategory, currentLang }) {
  const allCategory = { id: 'all', name: currentLang === 'uz' ? 'Barchasi' : 'Все', icon: '🏠' };
  const allCategories = [allCategory, ...(categories || [])];

  return (
    <div className="category-wrapper">
      <div className="category-scroll">
        {allCategories.map(category => (
          <button
            key={category.id}
            className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="cat-icon">{category.icon || '📦'}</span>
            <span className="cat-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;