import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🛒",
    title: "Easy Ordering",
    desc: "Place and manage your orders seamlessly with real-time updates.",
  },
  {
    icon: "📦",
    title: "Order Tracking",
    desc: "Track your orders from processing to delivery with clear status updates.",
  },
  {
    icon: "📊",
    title: "Inventory Management",
    desc: "Vendors can manage products, stock levels, and availability with ease.",
  },
  {
    icon: "🚀",
    title: "Vendor Dashboard",
    desc: "Stay in control of orders and customers with a powerful dashboard.",
  },
];


const testimonials = [
  {
    name: "Ayesha R.",
    quote: "BuyMart made my online shopping feel like a breeze. Super fast delivery!",
  },
  {
    name: "Ravi M.",
    quote: "As a seller, I love how easy it is to list and manage my products.",
  },
  {
    name: "Simran K.",
    quote: "The UI is gorgeous, and the cart system is smoother than any site I’ve used.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-center px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to BuyMart
        </motion.h1>
        <p className="text-lg md:text-xl mt-4 max-w-2xl text-gray-700">
          Buy, Sell, and Explore thousands of products in one seamless experience.
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-100 transition"
          >
            Create Account
          </button>
        </div>
        
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-12">
          🚀 Why BuyMart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 p-8 rounded-2xl shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-purple-100 to-blue-100 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-10">💬 What Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-5xl mx-auto px-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 italic mb-3">"{t.quote}"</p>
              <p className="font-bold text-blue-700">- {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="backdrop-blur-xl bg-white/10 p-10 rounded-xl max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Shop or Sell?
          </h2>
          <p className="mb-6">
            Join BuyMart today and step into the future of online marketplaces.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-lg hover:scale-105 transition"
          >
            Get Started Now
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800 to-purple-800 opacity-10 z-[-1]"></div>
      </section>

      <footer className="py-6 text-center bg-blue-950 text-blue-100 text-sm">
        &copy; {new Date().getFullYear()} BuyMart — Built for creators, shoppers, and sellers.
      </footer>
    </div>
  );
};

export default LandingPage;
