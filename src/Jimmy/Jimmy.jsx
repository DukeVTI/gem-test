import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
} from "lucide-react";

const ModernCyberTech = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`fixed w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-orange-600">CYBERTECH</span>
                <span className={isScrolled ? "text-gray-800" : "text-white"}>
                  {" "}
                  WORLDWIDE
                </span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {["Home", "About", "Services"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                        isScrolled ? "text-gray-800" : "text-white"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4">
              <ul className="space-y-4">
                {["Home", "About", "Services"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block text-white hover:text-orange-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 opacity-90" />
        <div className="relative container mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Build Your Digital Future
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300">
            Join the next generation of web developers. Master modern
            technologies and create stunning digital experiences.
          </p>
          <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-semibold transition-all hover:scale-105 hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Modern HTML5",
                description:
                  "Build semantic, accessible, and SEO-optimized websites using latest HTML5 features",
                icon: "🌐",
              },
              {
                title: "Advanced CSS3",
                description:
                  "Create responsive layouts and stunning animations with modern CSS techniques",
                icon: "🎨",
              },
              {
                title: "AI Integration",
                description:
                  "Implement cutting-edge AI and chatbot solutions in web applications",
                icon: "🤖",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700"
                >
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Stay Updated with Latest Tech Trends
            </h2>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-semibold transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} CyberTech Worldwide. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

{
  /* <video autoPlay muted loop playsInline>
  <source src={chee1} type="video/mp4" />
  Your browser does not suppoeort the video tag.
</video>; */
}
{/* <img src={chee} alt="Web Development" className="w-full h-full object-cover" />; */}
export default ModernCyberTech;
