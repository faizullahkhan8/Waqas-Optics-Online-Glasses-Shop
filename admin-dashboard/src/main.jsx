import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store/store";
import "./index.css";
import App from "./App.jsx";

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: "#1f2937",
                                    color: "#fff",
                                },
                            }}
                        />
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
