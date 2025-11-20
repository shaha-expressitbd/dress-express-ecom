'use client'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { FiGrid, FiPackage, FiSearch, FiFilter } from 'react-icons/fi'
import ProductCard from '@/components/ui/organisms/product-card'
import { Pagination } from '@/components/ui/molecules/pagination'

interface BusinessCategory {
    _id: string
    name: string
    children: {
        _id: string
        name: string
        image?: {
            secure_url: string
        }
    }[]
}

interface Props {
    business: any
    initialProducts: Product[]
    mainCategory: BusinessCategory | null
    mainCategoryId: string | null
    page: number
    limit: number
}

export default function MainCategoryPage({ business, initialProducts, mainCategory, mainCategoryId, page, limit }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [sortBy, setSortBy] = useState('featured')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(page)

    console.log('Client mainCategory:', mainCategory)
    console.log('Client mainCategoryId:', mainCategoryId)
    console.log('Client products count:', initialProducts.length)
    console.log('Client searchTerm:', searchTerm)

    if (!mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Category not found. Please check the URL or try another category.</p>
            </div>
        )
    }

    // Collect all sub-category IDs under this main category
    const subCategoryIds = useMemo(() => {
        const ids = mainCategory.children.map(child => child._id.toLowerCase())
        console.log('Client subCategoryIds:', ids)
        return ids
    }, [mainCategory])

    // Filter and sort products
    const { filteredProducts, paginatedProducts, totalPages } = useMemo(() => {
        // Filter products by sub-categories
        let filtered = initialProducts.filter(product => {
            const hasMatchingSubCategory = product.sub_category?.some(subCat =>
                subCategoryIds.includes(subCat._id.toLowerCase())
            )
            console.log(`Product ${product.name || product._id}: sub_category match = ${hasMatchingSubCategory}`)
            return hasMatchingSubCategory
        })

        // Apply search filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.trim().toLowerCase()
            filtered = filtered.filter(p => {
                const nameMatch = p.name?.toLowerCase().includes(lowerSearchTerm)
                const shortDescMatch = p.short_description?.toLowerCase().includes(lowerSearchTerm)
                const longDescMatch = p.long_description?.toLowerCase().includes(lowerSearchTerm)
                console.log(`Product ${p.name || p._id}: nameMatch=${nameMatch}, shortDescMatch=${shortDescMatch}, longDescMatch=${longDescMatch}`)
                return nameMatch || shortDescMatch || longDescMatch
            })
        }

        console.log('Filtered products count:', filtered.length)

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered = filtered.sort((a, b) => {
                    const priceA = Number(a.variantsId[0]?.selling_price) || 0
                    const priceB = Number(b.variantsId[0]?.selling_price) || 0
                    return priceA - priceB
                })
                break
            case 'price-high':
                filtered = filtered.sort((a, b) => {
                    const priceA = Number(a.variantsId[0]?.selling_price) || 0
                    const priceB = Number(b.variantsId[0]?.selling_price) || 0
                    return priceB - priceA
                })
                break
            case 'newest':
                // Add date-based sorting if available, e.g., createdAt
                break
            default:
                // Keep original order for 'featured'
                break
        }

        // Calculate pagination
        const totalPages = Math.ceil(filtered.length / limit)
        const startIndex = (currentPage - 1) * limit
        const endIndex = startIndex + limit
        const paginatedProducts = filtered.slice(startIndex, endIndex)

        console.log('Paginated products count:', paginatedProducts.length)
        console.log('Total pages:', totalPages)

        return {
            filteredProducts: filtered,
            paginatedProducts,
            totalPages

        }
    }, [initialProducts, subCategoryIds, searchTerm, sortBy, currentPage, limit])

    // Handle sort change and reset to page 1
    const handleSortChange = (newSortBy: string) => {
        console.log('Sort changed to:', newSortBy)
        setSortBy(newSortBy)
        setCurrentPage(1)
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', '1')
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    // Handle search change and reset to page 1
    const handleSearchChange = (newSearchTerm: string) => {
        console.log('Search term changed to:', newSearchTerm)
        setSearchTerm(newSearchTerm)
        setCurrentPage(1)
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', '1')
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    // Handle page change
    const handlePageChange = (newPage: number) => {
        console.log('Page changed to:', newPage)
        setCurrentPage(newPage)
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10"></div>
                    <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 container mx-auto w-full h-[15vh] md:h-[20vh] md:mt-0 mt-12">
                    <div className="text-center max-w-4xl mx-auto md:mt- mt-4">
                        <div className="inline-flex items-center gap-2 md:px-4 px-2 py-2 mb-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-black text-xs md:text-sm font-medium shadow-lg">
                            <FiGrid className="w-4 h-4" />
                            <span>{mainCategory.name}</span>
                        </div>
                        <p className="text-xs md:text-xl text-black mb-1">
                            Explore all products in {mainCategory.name} category
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
                        <path
                            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32V120H1392C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120H0V64Z"
                            fill="currentColor"
                            className="text-gray-50 dark:text-gray-900"
                        />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="relative -mt-1">
                <div className="lg:container lg:mx-auto lg:px-4 px-1 py-4">
                    {/* Search and Filter Bar */}
                    <div className="mb-6 md:mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 md:p-4 backdrop-blur-sm">
                            <div className="flex flex-row gap-3 md:gap-4 items-stretch lg:items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                    />
                                </div>

                                {/* Filter and Sort */}
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <FiFilter className="w-4 h-4 md:w-5 md:h-5 hidden md:block" />
                                        <span className="hidden md:inline text-sm font-medium">Sort:</span>
                                    </div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-2 md:px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 dark:text-white text-sm font-medium min-w-[120px] md:min-w-[140px] transition-all duration-200"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 md:py-20">
                            <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full opacity-10"></div>
                                <div className="absolute inset-3 md:inset-4 bg-white dark:bg-gray-800 rounded-full shadow-inner flex items-center justify-center">
                                    <FiPackage className="w-8 h-8 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                                {searchTerm ? 'No Results Found' : 'No Products Available'}
                            </h3>
                            <p className="text-black dark:text-gray-400 mb-2 max-w-md mx-auto text-sm ">
                                {searchTerm
                                    ? `No products match your search for "${searchTerm}". Try different keywords.`
                                    : `No products found in ${mainCategory.name} category.`}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="mt-3 md:mt-4 px-4 md:px-6 py-1.5 md:py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-colors duration-200 text-sm md:text-base"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <FiPackage className="w-6 h-6 text-pink-600" />
                                    <h2 className="text-sm md:text-2xl font-bold capitalize dark:text-white text-black">
                                        All Products in {mainCategory.name}
                                    </h2>
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''})
                                </span>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                {paginatedProducts.map((product, idx) => (
                                    <div
                                        key={product._id}
                                        className="group animate-fade-in-up"
                                        style={{
                                            animationDelay: `${idx * 0.05}s`,
                                            animationFillMode: 'both',
                                        }}
                                    >
                                        <div className="transform transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                                            <ProductCard product={product} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        itemsPerPage={limit}
                                        totalItems={filteredProducts.length}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}