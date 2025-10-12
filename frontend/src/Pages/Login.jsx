import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useLogin } from "../hooks/useAuth";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";

export default function LoginPage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const { login, loading } = useLogin();

    async function submit(e) {
        e.preventDefault();
        try {
            const data = await login(form);
            dispatch(setUser(data.user));
            navigate("/account");
        } catch (error) {
            // Error handling is already done in the hook
            console.error("Login failed:", error);
        }
    }
    return (
        <main>
            <Helmet>
                <title>Login — GlassesShop</title>
            </Helmet>
            <section className="py-12">
                <Container>
                    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                Welcome Back
                            </h1>
                            <p className="mt-2 text-center text-gray-600">
                                Sign in to your account
                            </p>

                            <form className="mt-8 space-y-6" onSubmit={submit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm((s) => ({
                                                ...s,
                                                email: e.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm((s) => ({
                                                ...s,
                                                password: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-md p-2"
                                    />
                                </div>
                                <Button
                                    className="bg-black text-white"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                            <p className="mt-4 text-center text-gray-600">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-600 hover:underline"
                                >
                                    Register
                                </a>
                            </p>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
