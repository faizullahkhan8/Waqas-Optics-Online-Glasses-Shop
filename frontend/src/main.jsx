import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store, persistor } from "./store/store";
import { queryClient } from "./lib/queryClient";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { routes } from "./routes";

// Create router instance
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Toaster
                        position="top-right"
                        toastOptions={{ duration: 1000 }}
                    />
                    <RouterProvider router={router} />
                    <ReactQueryDevtools initialIsOpen={false} />
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
