import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import { useVerifyCheckoutSession } from "../hooks/usePayment";

export default function CheckoutSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState(null);
    const hasVerified = useRef(false);

    const sessionId = searchParams.get("session_id");
    const verifySessionMutation = useVerifyCheckoutSession();

    useEffect(() => {
        if (!sessionId) {
            navigate("/checkout?error=no_session_id");
            return;
        }

        // Prevent multiple API calls
        if (hasVerified.current) {
            return;
        }
        hasVerified.current = true;

        (async () => {
            try {
                const data = await verifySessionMutation.mutateAsync(sessionId);
                dispatch(clearCart());
                navigate(`/thank-you?order=${data.orderId}`);
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                        "Payment verification failed"
                );
            } finally {
                setIsVerifying(false);
            }
        })();
    }, [sessionId, navigate, dispatch, verifySessionMutation]);

    if (isVerifying) {
        return (
            <main>
                <Helmet>
                    <title>Processing Payment — GlassesShop</title>
                </Helmet>
                <Container>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h2 className="text-xl font-serif text-gray-900 mb-2">
                                Verifying Payment
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we confirm your payment...
                            </p>
                        </div>
                    </div>
                </Container>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <Helmet>
                    <title>Payment Error — GlassesShop</title>
                </Helmet>
                <Container>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <div className="rounded-full bg-red-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-serif text-gray-900 mb-2">
                                Payment Verification Failed
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => navigate("/checkout")}
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </Container>
            </main>
        );
    }

    return null;
}
