'use client'

import { useMemo, useState } from 'react'
import { Product } from '@/types/product'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/ui/organisms/product-card'
import { Button } from '@/components/ui/atoms/button'
import { Pagination } from '@/components/ui/molecules/pagination'
import Link from 'next/link'
import { FiArrowRight, FiPackage, FiGrid, FiFilter, FiSearch, FiStar } from 'react-icons/fi'
import Image from 'next/image'

interface Props {
    initialProducts: Product[]
}

export default function CategoryProductsPage({ initialProducts }: Props) {
    const params = useParams()
    const category = decodeURIComponent(params.id as string)
    const [sortBy, setSortBy] = useState('featured')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    // Reset to page 1 when filters change
    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy)
        setCurrentPage(1)
    }

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm)
        setCurrentPage(1)
    }

    const { filtered, paginatedProducts, totalPages } = useMemo(() => {
        const match = (p: Product, name: string) =>
            p.category_group?.some(
                c => typeof (c as any).name === 'string' && (c as any).name.toLowerCase() === name.toLowerCase()
            )

        let filteredProducts = initialProducts.filter(p => match(p, category))

        // Apply search filter
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.long_description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filteredProducts = filteredProducts.sort((a, b) => (Number(a.variantsId[0]?.selling_price) || 0) - (Number(b.variantsId[0]?.selling_price) || 0))
                break
            case 'price-high':
                filteredProducts = filteredProducts.sort((a, b) => (Number(b.variantsId[0]?.selling_price) || 0) - (Number(a.variantsId[0]?.selling_price) || 0))
                break
            case 'newest':
                // Keep original order
                break
            default:
                // Keep original order
                break
        }

        // Calculate pagination
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

        return {
            filtered: filteredProducts,
            paginatedProducts,
            totalPages
        }
    }, [initialProducts, category, sortBy, searchTerm, currentPage, itemsPerPage])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10"></div>
                    <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        >
                            <div className="w-2 h-2 bg-white rounded-full blur-[0.5px] animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto w-full h-[15vh] md:h-[20vh] md:mt-0 mt-12">
                    <div className="text-center max-w-4xl mx-auto md:mt-10 mt-4">
                        {/* Badge */}
                        <div className="md:inline-flex hidden items-center gap-2 md:px-4 px-2 py-2 mb-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-black text-sm font-medium shadow-lg">
                            <FiGrid className="w-4 h-4" />
                            <span>  {category}</span>
                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        </div>
                        {/* Subtitle */}
                        <p className="text-xs md:text-xl text-black mb-1 max-w-2xl mx-auto leading-relaxed">
                            Discover our handpicked collection of premium quality products
                        </p>
                    </div>
                </div>

                {/* Wave Separator */}
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

            {/* Main Content */}
            <div className="relative -mt-1">
                <div className="lg:container lg:mx-auto lg:px-4 px-1 py-2 md:py-4">
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
                                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
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

                    {filtered.length === 0 ? (
                        /* Empty State */
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
                            <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md mx-auto text-sm md:text-base">
                                {searchTerm
                                    ? `No products match your search for "${searchTerm}". Try different keywords.`
                                    : "We couldn't find any products in this category right now."
                                }
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
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 lg:gap-6 mb-8 md:mb-12">
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
                                <div className="mb-8 md:mb-12">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => {
                                            setCurrentPage(page)
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filtered.length}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Call-to-Action Section */}
                    <div className="relative overflow-hidden">
                        <div className="bg-gradient-to-br from-[var(--color-tertiary)]/20 via-white to-[var(--color-secondary)]/10 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl md:rounded-3xl border border-[var(--color-tertiary)]/30 dark:border-gray-600 p-2 md:p-4  text-center backdrop-blur-sm">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'radial-gradient(circle at 25px 25px, var(--color-primary) 2px, transparent 0), radial-gradient(circle at 75px 75px, var(--color-secondary) 1px, transparent 0)',
                                    backgroundSize: '100px 100px'
                                }}></div>
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mb-4 md:mb-6 shadow-lg">
                                    <FiGrid className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                                    Explore More Collections
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed text-sm ">
                                    Discover thousands of premium products across all categories in our complete marketplace
                                </p>
                                <Button
                                    title="Continue Shopping"
                                    variant="gradient"
                                    className="group relative overflow-hidden px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg md:rounded-xl"
                                >
                                    <Link
                                        href="/products"
                                        className="flex items-center justify-center gap-2 md:gap-3 w-full text-white font-semibold text-sm md:text-base"
                                    >
                                        <span className="relative z-10">Browse All Products</span>
                                        <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Branding - Mobile */}
            <div className="md:hidden">
                <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 py-2 px-4 z-50">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-xs">Powered by</span>
                        <a
                            href="https://calquick.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity duration-200"
                        >
                            <Image
                                height={80}
                                width={80}
                                src="https://calquick.app/images/logo/logo-white.png"
                                className="h-4 w-auto object-contain"
                                alt="CalQuick Logo"
                                priority
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Branding - Desktop */}
            <div className="hidden md:block">
                <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 py-2 md:py-3 px-4 md:px-6 z-50">
                    <div className="container mx-auto flex items-center justify-center gap-2 md:gap-3">
                        <span className="text-gray-400 text-xs md:text-sm">Powered by</span>
                        <a
                            href="https://calquick.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity duration-200"
                        >
                            <Image
                                height={100}
                                width={100}
                                src="https://calquick.app/images/logo/logo-white.png"
                                className="h-5 md:h-6 w-auto object-contain"
                                alt="CalQuick Logo"
                                priority
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}