import { ScrollRestoration } from "react-router-dom";
import { Suspense } from "react";
import { PageLoader } from "./routes";

export default function App({ children }) {
    return (
        <Suspense fallback={<PageLoader />}>
            {children}
            <ScrollRestoration />
        </Suspense>
    );
}
