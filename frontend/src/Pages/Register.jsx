import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useRegister } from "../hooks/useAuth";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const navigate = useNavigate();
    const { register, loading } = useRegister();

    async function submit(e) {
        e.preventDefault();
        try {
            const data = await register(form);
            dispatch(setUser(data.user));
            navigate("/account");
        } catch (error) {
            // Error handling is already done in the hook
            console.error("Registration failed:", error);
        }
    }
    return (
        <main>
            <Helmet>
                <title>Register — GlassesShop</title>
            </Helmet>
            <section className="py-12">
                <Container>
                    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                Create Account
                            </h1>
                            <p className="mt-2 text-center text-gray-600">
                                Register to start shopping
                            </p>
                            <form className="mt-8 space-y-6" onSubmit={submit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        id="name"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((s) => ({
                                                ...s,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
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
                                        Phone number
                                    </label>
                                    <div className="mt-1">
                                        <PhoneInput
                                            country={"pk"}
                                            value={form.phone}
                                            placeholder="300 1234567"
                                            onChange={(phone) =>
                                                setForm((s) => ({
                                                    ...s,
                                                    phone: phone,
                                                }))
                                            }
                                            inputClass="!w-full !h-12 !border-gray-300 !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                                            containerClass="!w-full"
                                            buttonClass="!border-gray-300 !rounded-l-md !bg-gray-50 hover:!bg-gray-100"
                                            dropdownClass="!border-gray-300 !rounded-md !shadow-lg"
                                        />
                                    </div>
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
                                    {loading ? "Registering..." : "Register"}
                                </Button>
                            </form>
                            <p className="mt-4 text-center text-gray-600">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
