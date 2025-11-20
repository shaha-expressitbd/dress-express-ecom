'use client';

import Image from 'next/image';
import React from 'react';

const ClientGalleryHeader: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Logo and Title Section */}
            <div className="flex justify-center items-center mt-5">
                <Image
                    src="/assets/brandtextlogo.webp"
                    alt="Brand Logo"
                    width={32}
                    height={32}
                    className="mr-2 w-6 md:w-8 h-auto"
                    priority
                />
                <h5 className="text-lg md:text-xl font-semibold">CLIENT GALLERY</h5>
                <Image
                    src="/assets/brandtextlogo.webp"
                    alt="Brand Logo"
                    width={32}
                    height={32}
                    className="ml-2 w-6 md:w-8 h-auto"
                    priority
                />
            </div>

            {/* Description Section */}
            <div className="mt-3 px-2 md:px-0">
                <p className="text-sm text-center leading-relaxed">
                    The vision of our clothing brand is to inspire confidence, authenticity,
                    <br />
                    and individuality in every person who wears our garments.
                </p>
            </div>
        </div>
    );
};

export default ClientGalleryHeader;