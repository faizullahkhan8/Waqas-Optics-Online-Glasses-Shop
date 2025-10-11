import Container from "../UI/Container";

export default function ShopHero({ category, q, filteredProducts }) {
    return (
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="absolute top-32 right-16 w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-6">
                        {/* Elegant divider */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                            <div className="mx-4 w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
                            {category === "all" ? (
                                <>
                                    Our Curated
                                    <span className="block font-normal italic text-gray-700">
                                        Collection
                                    </span>
                                </>
                            ) : (
                                <span className="capitalize">{category}</span>
                            )}
                        </h1>
                    </div>
                    <div className="flex items-center justify-center space-x-6 text-gray-600">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-px bg-gray-300"></div>
                            <span className="font-medium tracking-wide">
                                {filteredProducts?.length}
                                <span className="ml-1 font-light">
                                    elegant pieces
                                </span>
                            </span>
                            <div className="w-8 h-px bg-gray-300"></div>
                        </div>
                    </div>
                    {q && (
                        <p className="mt-4 text-lg text-gray-500 font-light italic">
                            Featuring results for "{q}"
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
}
