// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import { FaFacebookF, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import { IoLogoTiktok } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { toast } from 'sonner';
import Logo from './ui/atoms/logo';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const socialHover = {
  whileHover: { scale: 1.1, y: -2 },
  whileTap: { scale: 0.95 }
};

// Footer data
const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/ourstory' },
      { label: 'Careers', href: '/career' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Support', href: '/support' },
    ]
  },
  {
    title: 'Products',
    links: [
      { label: 'New Arrivals', href: '/products/new' },
      { label: 'Flash-Deal', href: '/flashdeal' },
      { label: 'Trending', href: '/products/trending' },
      { label: 'Collections', href: '/products' },
    ]
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Shipping Info', href: '/shipping-info' },
    ]
  }
];

const socialLinks = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/dressexpressgrl4u', color: '#1877F2' },
  { icon: FaInstagram, href: '#', color: '#E4405F' },
  { icon: IoLogoTiktok, href: '#', color: '#000' }
];

const Footer = memo(() => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent_50%)]" />
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Content Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-12 mb-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <Link href="/" className="inline-block">
              <motion.div whileHover={{ scale: 1.05 }}>
                {/* <Logo /> */}
                Dress Express
              </motion.div>
            </Link>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md">
              Beyond trends, we create timeless beauty. Your style, your story, our passion.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                  {...socialHover}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: color }}
                    initial={false}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                  <Icon className="text-gray-600 dark:text-gray-300 group-hover:text-white relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-3 gap-8">
            {footerLinks.map(({ title, links }, index) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <motion.a
                href="tel:01886088529"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                whileHover={{ x: 4 }}
              >
                <FaPhone className="text-blue-500" />
                <span className="font-medium">01886088529</span>
              </motion.a>
              <motion.div
                className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                whileHover={{ x: 4 }}
              >
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Dress Express, green shoronika shopping mall, Dhaka, Bangladesh

                </span>
              </motion.div>
            </div>
          </div>

        </motion.div>
        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <p className="flex items-center gap-2">
            © {new Date().getFullYear()} Dress Express. All rights reserved.
            <motion.span
              className="text-red-500"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ❤️
            </motion.span>
          </p>

          <motion.a
            href="https://calquick.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xs text-gray-400">Powered by</span>
            <img
              src="https://calquick.app/images/logo/logo.png"
              alt="CalQuick"
              className="h-4 w-auto dark:hidden"
            />
            <img
              src="https://calquick.app/images/logo/logo-white.png"
              alt="CalQuick"
              className="h-4 w-auto hidden dark:block"
            />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;