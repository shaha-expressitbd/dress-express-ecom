import {
    FiMessageSquare,
    FiFileText,
    FiShield,
    FiTruck,
    FiInfo,
    FiHome
} from "react-icons/fi";

interface ProductTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    shortDescription?: string;
    longDescription?: string;
    stock: number;
    variantsCount: number;
}

export default function ProductTabs({
    activeTab,
    setActiveTab,
    shortDescription,
    longDescription,
    stock,
    variantsCount
}: ProductTabsProps) {
    const allTabs = [
        {
            id: 'Short-Description',
            label: 'Short Desc',
            fullLabel: 'Short Description',
            icon: FiInfo,
            mobileIcon: FiMessageSquare
        },
        {
            id: 'Long-Description',
            label: 'Long Desc',
            fullLabel: 'Long Description',
            icon: FiFileText,
            mobileIcon: FiFileText
        },
        {
            id: 'specs',
            label: 'Specs',
            fullLabel: 'Specifications',
            icon: FiShield,
            mobileIcon: FiShield
        },
        {
            id: 'shipping',
            label: 'Shipping',
            fullLabel: 'Shipping Info',
            icon: FiTruck,
            mobileIcon: FiTruck
        }
    ];

    // Mobile view will show 2 tabs at a time with horizontal scroll
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-xl overflow-hidden">
            {/* Tabs Navigation - Mobile (2 tabs visible) */}
            <div className="md:hidden flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ">
                {allTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[45vw] flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-gray-900 text-black dark:text-white dark:text-primary-400 border-b-2 border-primary-500'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <tab.mobileIcon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tabs Navigation - Desktop (all tabs visible) */}
            <div className="hidden md:flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ">
                {allTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-gray-900 text-black dark:text-white border-b-2 border-primary-500'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.fullLabel}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6 bg-white dark:bg-gray-900">
                {/* Short Description Tab */}
                {activeTab === 'Short-Description' && shortDescription && (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
                    </div>
                )}

                {/* Long Description Tab */}
                {activeTab === 'Long-Description' && longDescription && (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: longDescription }} />
                    </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Stock:</span>
                            <span className="text-sm dark:text-gray-300">{stock} units</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Variants:</span>
                            <span className="text-sm dark:text-gray-300">{variantsCount} options</span>
                        </div>
                    </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <FiHome className="flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Inside Dhaka</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">৳80 (1-2 business days)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <FiTruck className="flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Outside Dhaka</h4>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">৳150 (3-5 business days)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}