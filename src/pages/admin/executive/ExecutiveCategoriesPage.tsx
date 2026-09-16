import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import { CATEGORIES_DATA, type Category, type Subcategory } from '../../../data/categories'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Layers,
  FolderTree,
  Tag,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  Palette,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import './ExecutiveShared.css'
import './ExecutiveCategoriesPage.css'

export const ExecutiveCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Notification / Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [formData, setFormData] = useState<{
    name: string
    slug: string
    description: string
    color: string
    bgColor: string
    textColor: string
    count: number
    subcategories: { id: string; name: string; slug: string; itemCount?: number }[]
  }>({
    name: '',
    slug: '',
    description: '',
    color: '#FF6B6B',
    bgColor: '#FFE3E3',
    textColor: '#D92626',
    count: 0,
    subcategories: []
  })

  // Subcategory input inside form
  const [newSubcatName, setNewSubcatName] = useState('')

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getCategories()
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data)
      } else {
        setCategories(CATEGORIES_DATA)
      }
    } catch (err) {
      console.warn('Failed to load categories:', err)
      setCategories(CATEGORIES_DATA)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()

    const handleUpdate = () => {
      loadCategories()
    }
    window.addEventListener('wouchify_categories_updated', handleUpdate)
    return () => window.removeEventListener('wouchify_categories_updated', handleUpdate)
  }, [])

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({ ...prev, name, slug: prev.slug && !selectedCategory ? slug : prev.slug || slug }))
  }

  // Subcategory management
  const handleAddSubcategory = () => {
    if (!newSubcatName.trim()) return
    const subcatSlug = newSubcatName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const newSubcat: Subcategory = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newSubcatName.trim(),
      slug: subcatSlug,
      itemCount: 0
    }
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, newSubcat]
    }))
    setNewSubcatName('')
  }

  const handleRemoveSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }))
  }

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#FF6B6B',
      bgColor: '#FFE3E3',
      textColor: '#D92626',
      count: 0,
      subcategories: []
    })
    setNewSubcatName('')
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (cat: Category) => {
    setSelectedCategory(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#FF6B6B',
      bgColor: cat.bgColor || '#FFE3E3',
      textColor: cat.textColor || '#D92626',
      count: cat.count || 0,
      subcategories: Array.isArray(cat.subcategories) ? [...cat.subcategories] : []
    })
    setNewSubcatName('')
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (cat: Category) => {
    setSelectedCategory(cat)
    setIsDeleteModalOpen(true)
  }

  // Submit create
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) {
      showNotification('Category name and slug are required', 'error')
      return
    }

    try {
      const newCategory: Category = {
        id: formData.slug,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        color: formData.color,
        bgColor: formData.bgColor,
        textColor: formData.textColor,
        count: Number(formData.count) || 0,
        description: formData.description.trim(),
        subcategories: formData.subcategories
      }

      await adminApi.createCategory(newCategory)
      showNotification(`Category "${newCategory.name}" created successfully!`)
      setIsCreateModalOpen(false)
      loadCategories()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to create category', 'error')
    }
  }

  // Submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    if (!formData.name.trim() || !formData.slug.trim()) {
      showNotification('Category name and slug are required', 'error')
      return
    }

    try {
      const updatedCategory: Category = {
        ...selectedCategory,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        color: formData.color,
        bgColor: formData.bgColor,
        textColor: formData.textColor,
        count: Number(formData.count) || 0,
        description: formData.description.trim(),
        subcategories: formData.subcategories
      }

      await adminApi.updateCategory(selectedCategory.id || selectedCategory.slug, updatedCategory)
      showNotification(`Category "${updatedCategory.name}" updated successfully!`)
      setIsEditModalOpen(false)
      loadCategories()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to update category', 'error')
    }
  }

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return
    try {
      await adminApi.deleteCategory(selectedCategory.id || selectedCategory.slug)
      showNotification(`Category "${selectedCategory.name}" deleted successfully!`)
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
      loadCategories()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to delete category', 'error')
    }
  }

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return categories

    return categories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q)
      const matchSlug = cat.slug.toLowerCase().includes(q)
      const matchDesc = (cat.description || '').toLowerCase().includes(q)
      const matchSubcats = (cat.subcategories || []).some((s) => s.name.toLowerCase().includes(q))
      return matchName || matchSlug || matchDesc || matchSubcats
    })
  }, [categories, searchQuery])

  // Stats calculation
  const totalSubcategoriesCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.subcategories ? cat.subcategories.length : 0), 0)
  }, [categories])

  const totalDealsCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.count || 0), 0)
  }, [categories])

  const COLOR_PALETTES = [
    { name: 'Red / Coral', color: '#FF6B6B', bgColor: '#FFE3E3', textColor: '#D92626' },
    { name: 'Blue / Ocean', color: '#4DABF7', bgColor: '#E7F5FF', textColor: '#1971C2' },
    { name: 'Green / Fresh', color: '#51CF66', bgColor: '#EBFBEE', textColor: '#2B8A3E' },
    { name: 'Yellow / Sun', color: '#FCC419', bgColor: '#FFF9DB', textColor: '#E67700' },
    { name: 'Orange / Warm', color: '#FF922B', bgColor: '#FFF4E6', textColor: '#D9480F' },
    { name: 'Purple / Violet', color: '#845EF7', bgColor: '#F3F0FF', textColor: '#5F3DC4' },
    { name: 'Pink / Rose', color: '#F06595', bgColor: '#FFF0F6', textColor: '#C2255C' },
    { name: 'Cyan / Teal', color: '#20C997', bgColor: '#E6FCF5', textColor: '#0CA678' }
  ]

  return (
    <ExecutiveLayout activeMenu="categories">
      <div className="exec-content-page">
        {/* Toast Notification */}
        {notification && (
          <div className={`exec-toast ${notification.type}`}>
            <CheckCircle2 size={16} />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header section */}
        <div className="exec-page-header">
          <div>
            <h1 className="exec-page-title">Categories & Subcategories Management</h1>
            <p className="exec-page-subtitle">
              Configure store categories, tag taxonomies, color themes, and linked subcategories.
            </p>
          </div>
          <button className="exec-btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={16} />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="exec-stats-grid">
          <div className="exec-stat-card">
            <div className="stat-card-icon" style={{ background: '#EEF2FF', color: '#2F368C' }}>
              <Layers size={20} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Total Categories</span>
              <span className="stat-card-value">{categories.length}</span>
            </div>
          </div>

          <div className="exec-stat-card">
            <div className="stat-card-icon" style={{ background: '#EBFBEE', color: '#2B8A3E' }}>
              <FolderTree size={20} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Subcategories</span>
              <span className="stat-card-value">{totalSubcategoriesCount}</span>
            </div>
          </div>

          <div className="exec-stat-card">
            <div className="stat-card-icon" style={{ background: '#FFF4E6', color: '#D9480F' }}>
              <Tag size={20} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Catalogued Deals</span>
              <span className="stat-card-value">{totalDealsCount}+</span>
            </div>
          </div>

          <div className="exec-stat-card">
            <div className="stat-card-icon" style={{ background: '#F3F0FF', color: '#5F3DC4' }}>
              <Sparkles size={20} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Live Sync Status</span>
              <span className="stat-card-value" style={{ fontSize: '15px', color: '#16a34a' }}>Active & Synced</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="exec-toolbar">
          <div className="exec-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by category, slug, description, or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="exec-toolbar-actions">
            <div className="exec-view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Table / Grid */}
        {loading ? (
          <div className="exec-loading-state">
            <div className="spinner"></div>
            <p>Loading categories and taxonomies...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="exec-empty-state">
            <Layers size={48} className="empty-icon" />
            <h3>No Categories Found</h3>
            <p>Try refining your search query or create a new category.</p>
            <button className="exec-btn-primary" onClick={handleOpenCreateModal} style={{ marginTop: '14px' }}>
              <Plus size={16} />
              <span>Create Category</span>
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="exec-table-card">
            <table className="exec-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Theme Color</th>
                  <th>Subcategories</th>
                  <th>Deals Count</th>
                  <th>Public Route</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id || cat.slug}>
                    <td>
                      <div className="category-cell-name">
                        <span
                          className="category-color-dot"
                          style={{ backgroundColor: cat.color || '#2F368C' }}
                        ></span>
                        <div>
                          <strong className="cat-title">{cat.name}</strong>
                          {cat.description && (
                            <p className="cat-desc-line">{cat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="exec-code-badge">/{cat.slug}</span>
                    </td>
                    <td>
                      <div className="cat-palette-preview">
                        <span
                          className="cat-preview-pill"
                          style={{
                            backgroundColor: cat.bgColor || '#F1ECEC',
                            color: cat.textColor || '#2F368C',
                            border: `1px solid ${cat.color || '#CCCCCC'}`
                          }}
                        >
                          Sample Tag
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="subcat-chips-list">
                        {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                          cat.subcategories.slice(0, 3).map((sub) => (
                            <span key={sub.id || sub.slug} className="subcat-chip">
                              {sub.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted" style={{ fontSize: '12px' }}>None</span>
                        )}
                        {cat.subcategories && cat.subcategories.length > 3 && (
                          <span className="subcat-chip more">+{cat.subcategories.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="count-pill">{cat.count || 0}</span>
                    </td>
                    <td>
                      <a
                        href={`/categories/${cat.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="exec-link-preview"
                        title="View category page"
                      >
                        <span>View</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="exec-action-buttons">
                        <button
                          className="exec-icon-btn edit"
                          onClick={() => handleOpenEditModal(cat)}
                          title="Edit category"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="exec-icon-btn delete"
                          onClick={() => handleOpenDeleteModal(cat)}
                          title="Delete category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="exec-categories-grid">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                className="category-card"
                style={{
                  borderTop: `4px solid ${cat.color || '#2F368C'}`
                }}
              >
                <div className="category-card-header">
                  <div className="category-card-title-wrap">
                    <span
                      className="cat-badge"
                      style={{
                        backgroundColor: cat.bgColor || '#F1ECEC',
                        color: cat.textColor || '#2F368C'
                      }}
                    >
                      {cat.name}
                    </span>
                    <span className="cat-slug-sub">/{cat.slug}</span>
                  </div>
                  <div className="category-card-actions">
                    <button
                      className="exec-icon-btn edit"
                      onClick={() => handleOpenEditModal(cat)}
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="exec-icon-btn delete"
                      onClick={() => handleOpenDeleteModal(cat)}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="category-card-desc">
                  {cat.description || 'No description provided for this category.'}
                </p>

                <div className="category-card-subcats">
                  <span className="subcats-label">
                    Subcategories ({cat.subcategories ? cat.subcategories.length : 0}):
                  </span>
                  <div className="subcats-tags-wrap">
                    {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub) => (
                        <span key={sub.id || sub.slug} className="subcat-tag-pill">
                          {sub.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted" style={{ fontSize: '12px' }}>No subcategories</span>
                    )}
                  </div>
                </div>

                <div className="category-card-footer">
                  <span className="footer-deals-count">
                    <strong>{cat.count || 0}</strong> Deals & Brands
                  </span>
                  <a
                    href={`/categories/${cat.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="view-page-btn"
                  >
                    <span>Storefront</span>
                    <ChevronRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            CREATE CATEGORY MODAL
           ============================================================ */}
        {isCreateModalOpen && (
          <div className="exec-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
            <div className="exec-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="exec-modal-header">
                <div className="modal-header-title">
                  <Layers size={20} className="modal-title-icon" />
                  <h3>Add New Category</h3>
                </div>
                <button className="exec-modal-close" onClick={() => setIsCreateModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="exec-modal-form">
                <div className="exec-form-group">
                  <label>Category Name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Health & Wellness"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                <div className="exec-form-row">
                  <div className="exec-form-group">
                    <label>Slug Identifier <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. health-wellness"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                    />
                  </div>

                  <div className="exec-form-group">
                    <label>Deals / Brands Count</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 80"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="exec-form-group">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this category for users and SEO..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Color Palette Theme Presets */}
                <div className="exec-form-group">
                  <label><Palette size={14} style={{ display: 'inline', marginRight: '4px' }} /> Color Palette Presets</label>
                  <div className="color-preset-picker">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        type="button"
                        key={pal.name}
                        className={`color-preset-btn ${formData.color === pal.color ? 'selected' : ''}`}
                        style={{ backgroundColor: pal.color }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            color: pal.color,
                            bgColor: pal.bgColor,
                            textColor: pal.textColor
                          })
                        }
                        title={pal.name}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Subcategories Management */}
                <div className="exec-form-group">
                  <label>Subcategories Taxonomy</label>
                  <div className="subcat-input-row">
                    <input
                      type="text"
                      placeholder="Enter subcategory name (e.g. Fitness Equipment)"
                      value={newSubcatName}
                      onChange={(e) => setNewSubcatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSubcategory()
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="subcat-add-btn"
                      onClick={handleAddSubcategory}
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="subcats-modal-list">
                    {formData.subcategories.map((sub, idx) => (
                      <span key={sub.id || idx} className="subcat-modal-tag">
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          className="tag-del-btn"
                          onClick={() => handleRemoveSubcategory(idx)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {formData.subcategories.length === 0 && (
                      <p className="no-subcats-hint">No subcategories added yet. Type a name and click Add.</p>
                    )}
                  </div>
                </div>

                <div className="exec-modal-actions">
                  <button
                    type="button"
                    className="exec-btn-secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="exec-btn-primary">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            EDIT CATEGORY MODAL
           ============================================================ */}
        {isEditModalOpen && selectedCategory && (
          <div className="exec-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
            <div className="exec-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="exec-modal-header">
                <div className="modal-header-title">
                  <Edit2 size={20} className="modal-title-icon" />
                  <h3>Edit Category: {selectedCategory.name}</h3>
                </div>
                <button className="exec-modal-close" onClick={() => setIsEditModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="exec-modal-form">
                <div className="exec-form-group">
                  <label>Category Name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="exec-form-row">
                  <div className="exec-form-group">
                    <label>Slug Identifier <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                    />
                  </div>

                  <div className="exec-form-group">
                    <label>Deals / Brands Count</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="exec-form-group">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Color Palette Theme Presets */}
                <div className="exec-form-group">
                  <label><Palette size={14} style={{ display: 'inline', marginRight: '4px' }} /> Color Palette Presets</label>
                  <div className="color-preset-picker">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        type="button"
                        key={pal.name}
                        className={`color-preset-btn ${formData.color === pal.color ? 'selected' : ''}`}
                        style={{ backgroundColor: pal.color }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            color: pal.color,
                            bgColor: pal.bgColor,
                            textColor: pal.textColor
                          })
                        }
                        title={pal.name}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Subcategories Management */}
                <div className="exec-form-group">
                  <label>Subcategories Taxonomy</label>
                  <div className="subcat-input-row">
                    <input
                      type="text"
                      placeholder="Enter subcategory name (e.g. Fitness Equipment)"
                      value={newSubcatName}
                      onChange={(e) => setNewSubcatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSubcategory()
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="subcat-add-btn"
                      onClick={handleAddSubcategory}
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="subcats-modal-list">
                    {formData.subcategories.map((sub, idx) => (
                      <span key={sub.id || idx} className="subcat-modal-tag">
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          className="tag-del-btn"
                          onClick={() => handleRemoveSubcategory(idx)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="exec-modal-actions">
                  <button
                    type="button"
                    className="exec-btn-secondary"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="exec-btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            DELETE CONFIRMATION MODAL
           ============================================================ */}
        {isDeleteModalOpen && selectedCategory && (
          <div className="exec-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="exec-modal-content small" onClick={(e) => e.stopPropagation()}>
              <div className="exec-modal-header">
                <div className="modal-header-title">
                  <Trash2 size={20} className="modal-title-icon text-danger" />
                  <h3>Delete Category</h3>
                </div>
                <button className="exec-modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="exec-delete-body">
                <p>
                  Are you sure you want to delete the category <strong>"{selectedCategory.name}"</strong> (/{selectedCategory.slug})?
                </p>
                <p className="text-warning-sub">
                  This will remove its taxonomy and associated subcategories from the store navigation.
                </p>
              </div>

              <div className="exec-modal-actions">
                <button
                  type="button"
                  className="exec-btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="exec-btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
