import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { routes } from "./routes";

// Create router instance
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster
                    position="top-right"
                    toastOptions={{ duration: 1000 }}
                />
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    </StrictMode>
);
