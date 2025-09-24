import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_PRODUCTS } from "../Utils/MockData";

const SearchBox = () => {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const boxRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!q) {
            setSuggestions([]);
            setOpen(false);
            return;
        }
        const s = SAMPLE_PRODUCTS.filter((p) =>
            p.title.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 5);
        setSuggestions(s);
        setOpen(s.length > 0);
    }, [q]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Close on Escape
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    const handleSelect = (to) => {
        setOpen(false);
        setQ("");
        if (inputRef.current) inputRef.current.blur();
        navigate(to);
    };

    return (
        <div className="relative" role="search" ref={boxRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    aria-label="Search products"
                    placeholder="Search glasses..."
                    className="w-64 pl-10 pr-4 py-2.5 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => q && setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setOpen(false);
                            navigate(`/shop?q=${encodeURIComponent(q)}`);
                        }
                    }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-20">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                        <ul className="py-2 max-h-[300px] overflow-y-auto">
                            {suggestions.map((s) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelect(`/product/${s.slug}`)
                                        }
                                        className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={s.images[0]}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {s.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ${s.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                            {q && (
                                <li className="px-4 py-2 border-t border-gray-100">
                                    <button
                                        onClick={() =>
                                            handleSelect(
                                                `/shop?q=${encodeURIComponent(
                                                    q
                                                )}`
                                            )
                                        }
                                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        View all results for "{q}"...
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBox;
