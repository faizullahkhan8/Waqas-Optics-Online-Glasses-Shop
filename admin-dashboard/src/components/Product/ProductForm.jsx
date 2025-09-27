import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// A reusable add/edit product form component
// Props:
// - initial (object) initial values for edit, or undefined for add
// - onCancel() handler
// - onSubmit(FormData) handler that receives a FormData instance

const ProductForm = ({
    initial = {},
    onCancel,
    onSubmit,
    submitLabel = "Save",
}) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (initial && Object.keys(initial).length) {
            setForm({
                name: initial.name || "",
                description: initial.description || "",
                price: initial.price ? String(initial.price) : "",
                category: initial.category || "",
                brand: initial.brand || "",
                stock: initial.stock ? String(initial.stock) : "",
            });

            // If initial has images array of objects with url fields, show them as previews
            if (initial.images && Array.isArray(initial.images)) {
                setPreviews(initial.images.map((i) => i.url || i));
            }
        }
    }, [initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImages(files);

        // create previews
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
    };

    const validate = () => {
        if (!form.name.trim()) return "Name is required";
        if (!form.price || Number.isNaN(Number(form.price)))
            return "Valid price is required";
        if (!form.category.trim()) return "Category is required";
        if (!form.brand.trim()) return "Brand is required";
        if (!form.stock || !Number.isInteger(Number(form.stock)))
            return "Stock must be an integer";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return toast.error(err);

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("category", form.category);
        fd.append("brand", form.brand);
        fd.append("stock", form.stock);

        images.forEach((f) => fd.append("images", f));

        onSubmit(fd);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    className="px-3 py-2 border rounded"
                />
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="px-3 py-2 border rounded"
                />
                <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                    className="px-3 py-2 border rounded"
                />
                <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="px-3 py-2 border rounded"
                />
                <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="px-3 py-2 border rounded"
                />
            </div>

            <div>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Images</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="block mt-2"
                />
                <div className="mt-2 flex space-x-2 overflow-auto">
                    {previews.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            className="h-20 w-20 object-cover rounded"
                            alt={`preview-${idx}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
