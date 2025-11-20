// components/shop-all-products/category-tree.tsx
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface CategoryTreeProps {
    categories: Category[];
    selectedCats: string[];
    setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
    initialProducts: Product[];
}

function getAllDescendantIds(cat: Category): string[] {
    let ids: string[] = [cat._id];
    if (cat.children && cat.children.length > 0) {
        for (const child of cat.children) {
            ids = ids.concat(getAllDescendantIds(child));
        }
    }
    return ids;
}

function getCategorySelectionState(
    cat: Category,
    selectedCats: string[]
): "none" | "partial" | "all" {
    const allIds = getAllDescendantIds(cat);
    const selectedCount = allIds.filter((id) => selectedCats.includes(id)).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === allIds.length) return "all";
    return "partial";
}

function buildInitiallyExpandedMap(cats: Category[]): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    const walk = (list: Category[]) => {
        list.forEach((c) => {
            map[c._id] = true;
            if (c.children?.length) walk(c.children);
        });
    };
    walk(cats);
    return map;
}

export default function CategoryTree({
    categories,
    selectedCats,
    setSelectedCats,
    initialProducts,
}: CategoryTreeProps) {
    const [expandedCategories, setExpandedCategories] = useState<
        Record<string, boolean>
    >(() => buildInitiallyExpandedMap(categories));

    useEffect(() => {
        setExpandedCategories(buildInitiallyExpandedMap(categories));
    }, [categories]);

    const toggleCategoryWithChildren = useCallback(
        (cat: Category) => {
            const allIds = getAllDescendantIds(cat);
            setSelectedCats((prev) => {
                const allSelected = allIds.every((id) => prev.includes(id));
                return allSelected
                    ? prev.filter((id) => !allIds.includes(id))
                    : [...new Set([...prev, ...allIds])];
            });
        },
        [setSelectedCats]
    );

    const toggleCategoryExpand = useCallback((catId: string) => {
        setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
    }, []);

    const renderCategoryTree = useCallback(
        (cats: Category[], depth = 0) =>
            cats.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedCategories[cat._id];
                const selectionState = getCategorySelectionState(cat, selectedCats);

                return (
                    <div
                        key={cat._id}
                        className="mb-1"
                        style={{ marginLeft: `${depth * 16}px` }}
                    >
                        <div className="flex items-center group">
                            {hasChildren && (
                                <button
                                    onClick={() => toggleCategoryExpand(cat._id)}
                                    className="mr-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cat.name
                                        }`}
                                >
                                    {isExpanded ? (
                                        <FiChevronDown className="w-3 h-3" />
                                    ) : (
                                        <FiChevronRight className="w-3 h-3" />
                                    )}
                                </button>
                            )}
                            <label className="flex items-center flex-grow py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        checked={selectionState === "all"}
                                        ref={(input) => {
                                            if (input)
                                                input.indeterminate = selectionState === "partial";
                                        }}
                                        onChange={() => toggleCategoryWithChildren(cat)}
                                        aria-label={`Filter by ${cat.name}`}
                                    />
                                </div>
                                <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                    {cat.name}
                                </span>
                                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                    (
                                    {
                                        initialProducts.filter((p) =>
                                            p.category_group?.some((sc) =>
                                                getAllDescendantIds(cat).includes(sc._id)
                                            )
                                        ).length
                                    }
                                    )
                                </span>
                            </label>
                        </div>
                        {hasChildren && isExpanded && (
                            <div className="mt-1">
                                {renderCategoryTree(cat.children || [], depth + 1)}
                            </div>
                        )}
                    </div>
                );
            }),
        [
            expandedCategories,
            selectedCats,
            toggleCategoryExpand,
            toggleCategoryWithChildren,
            initialProducts,
        ]
    );

    return <>{renderCategoryTree(categories)}</>;
}