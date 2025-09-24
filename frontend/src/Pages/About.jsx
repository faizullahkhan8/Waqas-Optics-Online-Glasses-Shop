import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";

export default function AboutPage() {
    return (
        <main>
            <Helmet>
                <title>About Us — GlassesShop</title>
            </Helmet>
            {/* Hero Section */}
            <section className="py-20 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                            Crafting Timeless Vision
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ab, aspernatur? Harum hic sint maiores iusto
                            eveniet ducimus? Iste, voluptate praesentium.
                            Accusantium eius pariatur officiis neque rerum iusto
                            commodi non voluptas.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <Container>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-6 text-gray-600">
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Ab, consequatur numquam
                                    provident qui tenetur hic voluptatem non
                                    minima fuga magni. Ipsam error ipsa tenetur
                                    dolor voluptas alias vitae inventore
                                    consequuntur?
                                </p>
                                <p>
                                    Lorem ipsum dolor sit, amet consectetur
                                    adipisicing elit. Incidunt possimus quam
                                    tempore veritatis obcaecati suscipit fuga
                                    expedita quo! Mollitia explicabo provident
                                    minima possimus vitae dolorem doloremque
                                    maiores quia rerum debitis?
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gray-900/10 rounded-2xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80"
                                alt="Craftsman working on glasses"
                                className="relative rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">
                            Our Values
                        </h2>
                        <p className="mt-4 text-gray-600">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Quality First",
                                description:
                                    "We use only the finest materials and most precise crafting techniques to ensure lasting quality.",
                            },
                            {
                                title: "Sustainable Practices",
                                description:
                                    "Our commitment to sustainability guides every decision, from material sourcing to packaging.",
                            },
                            {
                                title: "Customer Care",
                                description:
                                    "We believe in building lasting relationships through exceptional service and support.",
                            },
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-6">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <Container>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">
                            Meet Our Team
                        </h2>
                        <p className="mt-4 text-gray-600">
                            The passionate people behind our brand
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Mubashir Gull",
                                role: "Owner",
                                image: "",
                            },
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden group">
                                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-900">
                                    {member.name}
                                </h3>
                                <p className="text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}
