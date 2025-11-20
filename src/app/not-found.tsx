"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center py-12 px-4'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Product Not Found</h2>
      <p className='text-gray-600 mb-8 max-w-md'>
        The product you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link href='/products' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
        Browse Products
      </Link>
    </div>
  );
};

export default NotFound;
