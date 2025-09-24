import { Link } from "react-router-dom";
import Container from "../components/UI/Container";
import { useSelector } from "react-redux";
import SearchBox from "../components/SearchBox";
import {
    HeartIcon,
    ShoppingBagIcon,
    UserIcon,
    ShoppingCartIcon,
    GlobeAltIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

import { useState } from "react";

export default function Navbar() {
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist);
    const user = useSelector((state) => state.user);
    const itemsInCart = cart.reduce((s, i) => s + i.qty, 0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
            <Container className="py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <GlobeAltIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xl font-serif font-semibold tracking-wide">
                            GlassesShop
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-500">
                            Classic Eyewear
                        </div>
                    </div>
                </Link>

                {/* Hamburger for mobile */}
                <button
                    type="button"
                    className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuOpen ? (
                        <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                        />
                    ) : (
                        <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                        />
                    )}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex flex-1 mx-12">
                    <ul className="flex gap-8 items-center justify-center">
                        <li>
                            <Link
                                to="/shop"
                                className="text-gray-700 hover:text-gray-900 font-medium tracking-wide transition-colors py-2"
                            >
                                Shop
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/virtual-try-on"
                                className="text-gray-700 hover:text-gray-900 font-medium tracking-wide transition-colors py-2"
                            >
                                Virtual Try-On
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-gray-900 font-medium tracking-wide transition-colors py-2"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-gray-900 font-medium tracking-wide transition-colors py-2"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Desktop Icons */}
                <div className="hidden lg:flex items-center gap-6">
                    <SearchBox />
                    <Link
                        to="/wishlist"
                        className="relative group"
                        aria-label="Wishlist"
                    >
                        {wishlist.length > 0 ? (
                            <HeartSolidIcon className="w-6 h-6 text-red-500 transition-transform group-hover:scale-110" />
                        ) : (
                            <HeartIcon className="w-6 h-6 text-gray-600 transition-transform group-hover:scale-110" />
                        )}
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/cart"
                        className="relative group"
                        aria-label="Shopping Cart"
                    >
                        <ShoppingBagIcon className="w-6 h-6 text-gray-600 transition-transform group-hover:scale-110" />
                        {itemsInCart > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                                {itemsInCart}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <Link
                            to="/account"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="w-5 h-5" />
                            </span>
                            <span className="text-sm">{user.name}</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="w-5 h-5" />
                            </span>
                            <span className="text-sm">Login</span>
                        </Link>
                    )}
                </div>
            </Container>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-25"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <nav className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl">
                        <div className="px-4 pt-6 pb-4 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="font-serif font-semibold">
                                    Menu
                                </div>
                                <button
                                    type="button"
                                    className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link
                                        to="/shop"
                                        className="block text-gray-700 hover:text-gray-900 font-medium tracking-wide py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/virtual-try-on"
                                        className="block text-gray-700 hover:text-gray-900 font-medium tracking-wide py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Virtual Try-On
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="block text-gray-700 hover:text-gray-900 font-medium tracking-wide py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="block text-gray-700 hover:text-gray-900 font-medium tracking-wide py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                            <div className="mt-auto pt-6 border-t">
                                <div className="flex items-center justify-around">
                                    <Link
                                        to="/wishlist"
                                        className="relative group"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {wishlist.length > 0 ? (
                                            <HeartSolidIcon className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <HeartIcon className="w-6 h-6 text-gray-600" />
                                        )}
                                        {wishlist.length > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                                {wishlist.length}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="relative group"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
                                        {itemsInCart > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                                                {itemsInCart}
                                            </span>
                                        )}
                                    </Link>
                                    {user ? (
                                        <Link
                                            to="/account"
                                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserIcon className="w-5 h-5" />
                                            </span>
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserIcon className="w-5 h-5" />
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
