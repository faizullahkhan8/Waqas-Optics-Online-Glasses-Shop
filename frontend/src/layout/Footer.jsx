import { Link } from "react-router-dom";
import Container from "../components/UI/Container";
import {
    GlobeAltIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    TruckIcon,
    ArrowPathIcon,
    MapPinIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-20">
            <Container>
                <div className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <Link
                                to="/"
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-transform group-hover:scale-105">
                                    <GlobeAltIcon className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-xl font-serif font-semibold tracking-wide text-white">
                                        GlassesShop
                                    </div>
                                    <div className="text-xs uppercase tracking-wider text-gray-400">
                                        Classic Eyewear
                                    </div>
                                </div>
                            </Link>
                            <p className="text-gray-400 leading-relaxed">
                                Classic and elegant eyewear for every face.
                                Discover your perfect style with our curated
                                collection.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <MapPinIcon className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <PhoneIcon className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <EnvelopeIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h5 className="text-white font-serif text-lg mb-6">
                                Company
                            </h5>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        to="/about"
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <BuildingOfficeIcon className="w-5 h-5" />
                                        <span>About Us</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        <span>Contact</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <BuildingOfficeIcon className="w-5 h-5" />
                                        <span>lorem ipsum</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h5 className="text-white font-serif text-lg mb-6">
                                Support
                            </h5>
                            <ul className="space-y-4">
                                <li>
                                    <Link className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <TruckIcon className="w-5 h-5" />
                                        <span>lorem ipsum</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <ArrowPathIcon className="w-5 h-5" />
                                        <span>lorem ipsum</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <BuildingOfficeIcon className="w-5 h-5" />
                                        <span>lorem ipsum</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h5 className="text-white font-serif text-lg mb-6">
                                Stay Updated
                            </h5>
                            <p className="text-gray-400 mb-4">
                                Subscribe to our newsletter for exclusive offers
                                and eyewear tips.
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 py-8 text-center text-sm text-gray-400">
                    <p>
                        © {new Date().getFullYear()} GlassesShop. All rights
                        reserved.
                    </p>
                    <div className="mt-2 flex justify-center gap-6">
                        <Link
                            to="/privacy"
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
