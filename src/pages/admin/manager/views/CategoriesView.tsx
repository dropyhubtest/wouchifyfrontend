import React from 'react'
import type { Category } from '../../../../data/categories'

interface CategoriesViewProps {
  filteredCategories: Category[]
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ filteredCategories }) => {
  return (
    <div className="view-categories-admin">
      <div className="categories-admin-grid">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="category-admin-card" style={{ borderTop: `4px solid ${cat.color}` }}>
            <div className="cat-card-header">
              <h3>{cat.name}</h3>
              <span className="cat-deals-pill">{cat.count} Deals</span>
            </div>
            <p className="cat-admin-desc">{cat.description}</p>
            <div className="subcat-chips-wrap">
              {cat.subcategories.map((sub: any) => (
                <span key={sub.id || sub.name} className="subcat-admin-chip">{sub.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
