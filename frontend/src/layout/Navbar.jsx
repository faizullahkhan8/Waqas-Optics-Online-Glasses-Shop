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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist);
    const user = useSelector((state) => state.user);
    const itemsInCart = cart.reduce((s, i) => s + i.qty, 0);
    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
            <Container className="py-4 flex items-center justify-between">
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

                <nav className="flex-1 mx-12">
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

                <div className="flex items-center gap-6">
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
        </header>
    );
}
