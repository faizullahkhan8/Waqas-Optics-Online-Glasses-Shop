import { Link, useLocation } from "react-router-dom";
import Container from "../components/UI/Container";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import SearchBox from "../components/SearchBox";
import {
    HeartIcon,
    ShoppingBagIcon,
    UserIcon,
    GlobeAltIcon,
    ChevronDownIcon,
    CameraIcon,
    BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

import { useState, useEffect, useRef } from "react";
import { useLogout } from "../hooks/useAuth";

export default function Navbar() {
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const itemsInCart = Array.isArray(cart)
        ? cart.length
        : cart?.items?.length || 0;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const logout = useLogout();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout.logout();
            dispatch(clearUser());
            setUserMenuOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Helper function to check if route is active
    const isActive = (path) => location.pathname === path;
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

                {/* Mobile: Show search icon or user icon */}
                <div className="lg:hidden flex items-center gap-2">
                    {user ? (
                        <Link to="/account" className="p-2">
                            <UserIcon className="w-6 h-6 text-gray-600" />
                        </Link>
                    ) : (
                        <Link to="/login" className="p-2">
                            <UserIcon className="w-6 h-6 text-gray-600" />
                        </Link>
                    )}
                </div>

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
                        {(wishlist?.items?.length || 0) > 0 ? (
                            <HeartSolidIcon className="w-6 h-6 text-red-500 transition-transform group-hover:scale-110" />
                        ) : (
                            <HeartIcon className="w-6 h-6 text-gray-600 transition-transform group-hover:scale-110" />
                        )}
                        {(wishlist?.items?.length || 0) > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                {wishlist?.items?.length || 0}
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
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <UserIcon className="w-5 h-5" />
                                </span>
                                <span className="text-sm">{user.name}</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>

                            {userMenuOpen && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                                >
                                    <Link
                                        to="/account"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
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

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex justify-around items-center py-2 px-1">
                    {/* Home */}
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                            isActive("/")
                                ? "text-gray-900 bg-gray-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <GlobeAltIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Home</span>
                    </Link>

                    {/* Shop */}
                    <Link
                        to="/shop"
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                            isActive("/shop")
                                ? "text-gray-900 bg-gray-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <BuildingStorefrontIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Shop</span>
                    </Link>

                    {/* virtual try-on */}
                    <Link
                        to="/virtual-try-on"
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                            isActive("/virtual-try-on")
                                ? "text-gray-900 bg-gray-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <CameraIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">
                            Virtual Try-On
                        </span>
                    </Link>

                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors relative ${
                            isActive("/wishlist")
                                ? "text-red-500 bg-red-50"
                                : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                        }`}
                    >
                        <div className="relative">
                            {(wishlist?.items?.length || 0) > 0 ? (
                                <HeartSolidIcon className="w-6 h-6 mb-1" />
                            ) : (
                                <HeartIcon className="w-6 h-6 mb-1" />
                            )}
                            {(wishlist?.items?.length || 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {wishlist?.items?.length || 0}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-medium">Wishlist</span>
                    </Link>

                    <Link
                        to="/cart"
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors relative ${
                            isActive("/cart")
                                ? "text-gray-900 bg-gray-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <div className="relative">
                            <ShoppingBagIcon className="w-6 h-6 mb-1" />
                            {itemsInCart > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {itemsInCart}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-medium">Cart</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
