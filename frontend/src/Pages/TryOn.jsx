import { useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
import { useSelector } from "react-redux";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function VirtualTryOnPage() {
    const [mode, setMode] = useState("webcam"); // "webcam" or "upload"
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(null);
    const [glassesSize, setGlassesSize] = useState(100);
    const webcamRef = useRef(null);
    const [mirror, setMirror] = useState(true);

    // Get all products that are glasses from the mock data
    const products = useSelector((state) => state.products) || [];
    let glasses = products.filter(
        (p) => p.category === "Glasses" || p.category === "Sunglasses"
    );
    // Inject example glasses if none exist (for testing/demo)
    if (!glasses || glasses.length === 0) {
        glasses = [
            {
                id: "demo1",
                title: "Demo Classic Glasses",
                price: 99,
                slug: "demo-classic-glasses",
                category: "Glasses",
                images: [
                    "https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/glasses.svg"
                ],
            },
            {
                id: "demo2",
                title: "Demo Sunglasses",
                price: 129,
                slug: "demo-sunglasses",
                category: "Sunglasses",
                images: [
                    "https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/sunglasses.svg"
                ],
            },
        ];
    }

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

            <section className="py-12">
                <Container>
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-serif font-semibold text-gray-900">
                                Virtual Try-On Experience
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                Experience our eyewear collection in real-time.
                                Use your webcam or upload a photo to see how our
                                frames complement your style.
                            </p>
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
                                    {glasses.map((glass) => (
                                        <button
                                            key={glass.id}
                                            onClick={() =>
                                                setSelectedGlasses(glass)
                                            }
                                            className={`block w-full text-left p-2 rounded-md transition-colors ${
                                                selectedGlasses?.id === glass.id
                                                    ? "bg-gray-100 border-gray-900"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={glass.images[0]}
                                                    alt={glass.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {glass.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ${glass.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
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
                                                    <Draggable>
                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move">
                                                            <img
                                                                src={
                                                                    selectedGlasses
                                                                        .images[0]
                                                                }
                                                                alt={
                                                                    selectedGlasses.title
                                                                }
                                                                style={{
                                                                    width: `${glassesSize}%`,
                                                                    maxWidth:
                                                                        "none",
                                                                }}
                                                                className="pointer-events-none"
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
                                                        }}
                                                        className="bg-blue-600 text-white"
                                                    >
                                                        Take New Photo
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedGlasses && uploadedImage && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Adjust Size
                                            </label>
                                            <input
                                                type="range"
                                                min="50"
                                                max="150"
                                                value={glassesSize}
                                                onChange={(e) =>
                                                    setGlassesSize(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full mt-2"
                                            />
                                        </div>
                                    )}

                                    {selectedGlasses && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">
                                                    {selectedGlasses.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ${selectedGlasses.price}
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    window.location.href = `/product/${selectedGlasses.slug}`;
                                                }}
                                                className="bg-gray-900 text-white"
                                            >
                                                Buy Now
                                            </Button>
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
