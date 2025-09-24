import { lazy } from "react";
import MainLayout from "./layout/MainLayout";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import NotFoundPage from "./Pages/NotFound";

// Lazy loaded pages
const LazyShop = lazy(() => import("./Pages/Shop"));
const LazyProduct = lazy(() => import("./Pages/ProductDetail"));
const LazyCart = lazy(() => import("./Pages/Cart"));
const LazyTryOn = lazy(() => import("./Pages/TryOn"));
const LazyCheckout = lazy(() => import("./Pages/Checkout"));
const LazyAccount = lazy(() => import("./Pages/Account"));
const LazyAbout = lazy(() => import("./Pages/About"));
const LazyContact = lazy(() => import("./Pages/ContactUs"));
const LazyThankYou = lazy(() => import("./Pages/ThankYou"));
const LazyWishlist = lazy(() => import("./Pages/Wishlist"));

// Loading fallback component
export const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
    </div>
);

export const routes = [
    {
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "shop",
                element: <LazyShop />,
            },
            {
                path: "product/:slug",
                element: <LazyProduct />,
            },
            {
                path: "virtual-try-on",
                element: <LazyTryOn />,
            },
            {
                path: "cart",
                element: <LazyCart />,
            },
            {
                path: "checkout",
                element: <LazyCheckout />,
            },
            {
                path: "account",
                element: <LazyAccount />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "about",
                element: <LazyAbout />,
            },
            {
                path: "contact",
                element: <LazyContact />,
            },
            {
                path: "thank-you",
                element: <LazyThankYou />,
            },
            {
                path: "wishlist",
                element: <LazyWishlist />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
];
