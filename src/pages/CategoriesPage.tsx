import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategoryHero, CategoryToolbar, CategorySidebar, CategoryDirectory } from '../components/categories'
import { CATEGORY_DIRECTORY_ITEMS } from '../data/categoriesDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { adminApi } from '../services/adminApi'
import './CategoriesPage.css'

export const CategoriesPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(18000)
  
  const [dbCategories, setDbCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCats = () => {
      adminApi.getCategories({ status: 'active' })
        .then((data: any) => {
          if (Array.isArray(data)) {
            const mapped = data.filter((c: any) => c.status !== 'inactive').map((c: any) => ({
              id: c._id || c.id || c.slug,
              name: c.name,
              slug: c.slug,
              image: c.image || c.logo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&auto=format&fit=crop&q=80',
              letter: c.letter || (c.name ? c.name.charAt(0).toUpperCase() : 'A')
            }))
            setDbCategories(mapped)
          }
        })
        .catch(() => {
          // Gracefully continue with static directory if API is unreachable
        })
    }

    fetchCats()
    window.addEventListener('wouchify_categories_updated', fetchCats)
    return () => window.removeEventListener('wouchify_categories_updated', fetchCats)
  }, [])

  const filteredItems = useMemo(() => {
    // Merge DB categories and hardcoded ones, preferring DB
    const allItems = [...CATEGORY_DIRECTORY_ITEMS]
    dbCategories.forEach(dbItem => {
      const existingIdx = allItems.findIndex(i => i.slug === dbItem.slug)
      if (existingIdx >= 0) {
        allItems[existingIdx] = { ...allItems[existingIdx], ...dbItem }
      } else {
        allItems.push(dbItem)
      }
    })

    return allItems.filter((item) => {
      // Letter filter
      if (activeLetter && item.letter.toUpperCase() !== activeLetter.toUpperCase()) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return item.name.toLowerCase().includes(q)
      }
      return true
    })
  }, [searchQuery, activeLetter, dbCategories])

  // Update canvas height dynamically based on filtered items
  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight)
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 100)
    return () => clearTimeout(timer)
  }, [filteredItems.length, selectedCategory, activeLetter])

  const handleLetterClick = useCallback((letter: string | null) => {
    setActiveLetter(letter)
    if (letter) {
      const element = document.getElementById(`directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="categories-page"
      style={{ '--categories-scale': scale } as React.CSSProperties}
    >
      {/* 1. Transparent/Default Navbar */}
      <div className="categories-page__navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Category Discovery Hero */}
      <CategoryHero />

      {/* 3. Main Discovery & Directory Canvas with exact scaled height */}
      <main
        className="categories-page__main"
        style={{ height: `${canvasHeight * scale}px` }}
      >
        <div className="categories-page__canvas" ref={canvasRef}>
          <CategoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            activeLetter={activeLetter}
            onLetterClick={handleLetterClick}
          />

          <div className="categories-page__layout">
            <CategorySidebar
              selectedCategorySlug={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <CategoryDirectory items={filteredItems} />
          </div>
        </div>
      </main>

      {/* 4. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default CategoriesPage
