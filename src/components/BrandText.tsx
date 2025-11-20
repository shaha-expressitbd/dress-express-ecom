'use client';

import Image from 'next/image';

export default function BrandText() {
    return (
        <div className="mt-7 px-3 container mx-auto max-w-7xl">
            {/* Brand Logo and Text Section */}
            <div className="flex items-center">
                <Image
                    src="/assets/brandtextlogo.webp"
                    alt="Brand Logo"
                    className="mr-2 w-6 sm:w-7 md:w-8 h-auto"
                    width={32}
                    height={32}
                    priority
                />
                <h5 className="mb-0 text-lg sm:text-xl md:text-2xl text-black dark:text-white font-semibold">
                    THE BRAND
                </h5>
            </div>
            <p className="mt-2 text-justify text-sm text-black dark:text-white md:text-xl leading-relaxed">
                The vision of our clothing brand is to inspire confidence,
                authenticity, and individuality in every person who wears our
                garments. We aim to create a diverse range of fashion pieces that
                empower individuals to express their unique personalities and
                embrace their personal style. Our vision is grounded in the belief
                that fashion should be inclusive, sustainable, and ethically
                produced. We strive to cultivate a community where creativity
                thrives, and where every customer feels seen, heard, and
                celebrated.
            </p>

            {/* Video Section */}
            <div className="flex justify-center mt-6 w-full">
                <div className="w-full">
                    <div className="relative overflow-hidden">
                        <video

                            autoPlay
                            muted
                            loop
                            className="w-full h-auto mx-auto lg:w-4/5"
                        >
                            <source src="/assets/Videos/Bridal_video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
}