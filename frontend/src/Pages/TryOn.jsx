import { useState, useCallback, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useProducts } from "../hooks/useProducts";
import toast from "react-hot-toast";

export default function VirtualTryOnPage() {
    const [mode, setMode] = useState("webcam"); // "webcam" or "upload"
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(null);
    const [glassesSize, setGlassesSize] = useState(100);
    const [glassesPosition, setGlassesPosition] = useState({ x: 0, y: 0 });
    const webcamRef = useRef(null);
    const [mirror, setMirror] = useState(true);

    // Fetch glasses products for try-on
    const {
        data: glassesData,
        isLoading: loading,
        error,
    } = useProducts({
        category: "glasses,sunglasses",
        limit: 20,
    });

    const glasses = glassesData?.products || [];

    // Handle error state
    useEffect(() => {
        if (error) {
            toast.error("Failed to load glasses");
            console.error("Error fetching glasses:", error);
        }
    }, [error]);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setUploadedImage(imageSrc);
            setMode("review");
        }
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                setMode("review");
            };
            reader.readAsDataURL(file);
        }
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    return (
        <main>
            <Helmet>
                <title>Virtual Try-On — GlassesShop</title>
                <meta
                    name="description"
                    content="Try on our glasses virtually using your webcam or uploaded photo. Experience how our frames look on your face before buying."
                />
            </Helmet>

            <section className="py-12 min-h-screen bg-gray-50">
                <Container>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <span>🔬</span>
                                <span>AI-Powered Virtual Try-On</span>
                            </div>
                            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                                Virtual Try-On Experience
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Experience our eyewear collection in real-time.
                                Use your webcam or upload a photo to see how our
                                frames complement your unique style.
                            </p>
                            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Real-time preview</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Drag to position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span>Adjustable sizing</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid md:grid-cols-3 gap-8">
                            {/* Left sidebar - Glasses selection */}
                            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
                                    <h2 className="text-xl font-serif text-gray-900">
                                        Available Frames
                                    </h2>
                                </div>
                                <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                            <p className="text-gray-500 mt-2">
                                                Loading frames...
                                            </p>
                                        </div>
                                    ) : (Array.isArray(glasses)
                                          ? glasses.length
                                          : 0) === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No frames available
                                        </div>
                                    ) : (
                                        glasses.map((glass) => (
                                            <button
                                                key={glass.id}
                                                onClick={() => {
                                                    setSelectedGlasses(glass);
                                                    setGlassesPosition({
                                                        x: 0,
                                                        y: 0,
                                                    });
                                                }}
                                                className={`block w-full text-left p-3 rounded-lg transition-colors border-2 ${
                                                    selectedGlasses?.id ===
                                                    glass.id
                                                        ? "bg-blue-50 border-blue-500"
                                                        : "hover:bg-gray-50 border-transparent"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            glass.images?.[0] ||
                                                            "/placeholder-product.svg"
                                                        }
                                                        alt={glass.title}
                                                        className="w-12 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/api/placeholder/48/48";
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-sm text-gray-900">
                                                            {glass.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ${glass.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Main content - Camera/Upload view */}
                            <div className="md:col-span-2">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex gap-4 mb-4">
                                        <Button
                                            onClick={() => setMode("webcam")}
                                            className={`flex-1 ${
                                                mode === "webcam"
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            Use Webcam
                                        </Button>
                                        <Button
                                            onClick={() => setMode("upload")}
                                            className={`flex-1 ${
                                                mode === "upload"
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            Upload Photo
                                        </Button>
                                    </div>

                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        {mode === "webcam" &&
                                            !uploadedImage && (
                                                <>
                                                    <Webcam
                                                        audio={false}
                                                        ref={webcamRef}
                                                        screenshotFormat="image/jpeg"
                                                        videoConstraints={
                                                            videoConstraints
                                                        }
                                                        mirrored={mirror}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                                                        <Button
                                                            onClick={capture}
                                                            className="bg-gray-900 text-white px-6"
                                                        >
                                                            Take Photo
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setMirror(
                                                                    !mirror
                                                                )
                                                            }
                                                            className="bg-gray-600 text-white"
                                                        >
                                                            Flip Camera
                                                        </Button>
                                                    </div>
                                                </>
                                            )}

                                        {mode === "upload" &&
                                            !uploadedImage && (
                                                <div className="flex items-center justify-center h-full">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={
                                                                handleFileUpload
                                                            }
                                                        />
                                                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                                            <div className="text-4xl mb-2">
                                                                📸
                                                            </div>
                                                            <div className="font-medium">
                                                                Click to upload
                                                                photo
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                or drag and drop
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}

                                        {uploadedImage && (
                                            <div className="relative">
                                                <img
                                                    src={uploadedImage}
                                                    alt="Your photo"
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedGlasses && (
                                                    <Draggable
                                                        position={
                                                            glassesPosition
                                                        }
                                                        onDrag={(e, data) => {
                                                            setGlassesPosition({
                                                                x: data.x,
                                                                y: data.y,
                                                            });
                                                        }}
                                                        bounds="parent"
                                                    >
                                                        <div className="absolute top-1/2 left-1/2 cursor-move">
                                                            <img
                                                                src={
                                                                    selectedGlasses
                                                                        .images?.[0] ||
                                                                    "/placeholder-product.svg"
                                                                }
                                                                alt={
                                                                    selectedGlasses.title
                                                                }
                                                                style={{
                                                                    width: `${glassesSize}px`,
                                                                    height: "auto",
                                                                    transform:
                                                                        "translate(-50%, -50%)",
                                                                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                                                                }}
                                                                className="pointer-events-none select-none"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src =
                                                                        "/api/placeholder/120/40";
                                                                }}
                                                            />
                                                        </div>
                                                    </Draggable>
                                                )}
                                                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                                                    <Button
                                                        onClick={() => {
                                                            setUploadedImage(
                                                                null
                                                            );
                                                            setMode("webcam");
                                                            setSelectedGlasses(
                                                                null
                                                            );
                                                            setGlassesPosition({
                                                                x: 0,
                                                                y: 0,
                                                            });
                                                        }}
                                                        className="bg-blue-600 text-white"
                                                    >
                                                        Take New Photo
                                                    </Button>
                                                    {selectedGlasses && (
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedGlasses(
                                                                    null
                                                                );
                                                                setGlassesPosition(
                                                                    {
                                                                        x: 0,
                                                                        y: 0,
                                                                    }
                                                                );
                                                            }}
                                                            className="bg-gray-600 text-white"
                                                        >
                                                            Remove Glasses
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedGlasses && uploadedImage && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Adjust Size: {glassesSize}px
                                                </label>
                                                <input
                                                    type="range"
                                                    min="80"
                                                    max="200"
                                                    value={glassesSize}
                                                    onChange={(e) =>
                                                        setGlassesSize(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                                💡 <strong>Tip:</strong> Drag
                                                the glasses to position them on
                                                your face, then adjust the size
                                                using the slider.
                                            </div>
                                        </div>
                                    )}

                                    {selectedGlasses && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-serif text-lg font-medium text-gray-900">
                                                        {selectedGlasses.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {
                                                            selectedGlasses.category
                                                        }
                                                    </p>
                                                    <div className="text-xl font-bold text-gray-900 mt-2">
                                                        ${selectedGlasses.price}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 ml-4">
                                                    <Button
                                                        onClick={() => {
                                                            window.location.href = `/product/${selectedGlasses.slug}`;
                                                        }}
                                                        className="bg-gray-900 text-white px-6 py-2"
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            // Add to cart functionality
                                                            toast.success(
                                                                `${selectedGlasses.title} added to cart!`
                                                            );
                                                        }}
                                                        className="bg-blue-600 text-white px-6 py-2"
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
