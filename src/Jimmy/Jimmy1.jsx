import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import chee from "./images/blue-unscreen.gif";
import chee1 from "./images/blue.mp4";

const ModernCyberTechV2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Side Navigation */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <ul className="space-y-4">
          {["home", "services", "learn", "connect"].map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`w-3 h-3 block rounded-full border-2 transition-all ${
                  activeSection === section
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-zinc-400 hover:border-indigo-600"
                }`}
                aria-label={section}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-indigo-600">Cyber</span>
              <span className="text-zinc-800">Tech</span>
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <nav>
                <ul className="flex space-x-8">
                  {["Home", "Services", "About", "Contact"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-zinc-600 hover:text-indigo-600 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen pt-24 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl lg:text-7xl font-bold text-zinc-900 leading-tight mb-6">
                  Master the Art of
                  <span className="text-indigo-600"> Web Development</span>
                </h2>
                <p className="text-lg text-zinc-600 mb-8 max-w-lg">
                  Join our comprehensive program to learn modern web development
                  from industry experts. Build real-world projects and advance
                  your career.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                    Start Learning
                  </button>
                  <button className="px-8 py-4 border border-zinc-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all">
                    View Courses
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <video autoPlay muted loop playsInline>
                    <source src={chee1} type="video/mp4" />
                    Your browser does not suppoeort the video tag.
                  </video>
                  ;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Learning Paths</h2>
              <p className="text-zinc-600">
                Choose your specialized track and master the skills that matter
                most to you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Frontend Development",
                  description:
                    "Master modern UI frameworks and create responsive, dynamic web applications",
                  icon: "⚡",
                },
                {
                  title: "Backend Systems",
                  description:
                    "Build scalable servers, APIs, and manage databases with modern technologies",
                  icon: "🛠️",
                },
                {
                  title: "Full Stack Development",
                  description:
                    "Become a versatile developer capable of handling entire web applications",
                  icon: "🚀",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative p-8 bg-zinc-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 mb-6">{feature.description}</p>
                  <a
                    href="#"
                    className="inline-flex items-center text-indigo-600 group-hover:text-indigo-700"
                  >
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="connect" className="py-24 bg-zinc-900">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our Community
              </h2>
              <p className="text-zinc-400 mb-8">
                Get weekly updates on new courses, tutorials, and community
                events.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all whitespace-nowrap">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-400">
              &copy; {new Date().getFullYear()} CyberTech Worldwide
            </p>
            <div className="flex space-x-6">
              <Github className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernCyberTechV2;
