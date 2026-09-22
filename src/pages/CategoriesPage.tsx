import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategoryHero, CategoryToolbar, CategorySidebar, CategoryDirectory } from '../components/categories'
import { CATEGORY_DIRECTORY_ITEMS } from '../data/categoriesDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
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
    fetch('http://localhost:3001/api/data/categories')
      .then(res => res.json())
      .then(data => {
        const mapped = data.filter((c: any) => c.status !== 'inactive').map((c: any) => ({
          id: c._id || c.id || c.slug,
          name: c.name,
          slug: c.slug,
          image: c.image || 'https://via.placeholder.com/80?text=Cat',
          letter: c.letter || c.name.charAt(0).toUpperCase()
        }))
        setDbCategories(mapped)
      })
      .catch(console.error)
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
