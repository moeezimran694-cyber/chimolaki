import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DealsSection from './components/Deals';
import MenuSection from './components/Menu';
import BlogSection from './components/Blog';
import ContactSection from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Checkout from './components/Checkout';
import OrderStatus from './components/OrderStatus';
import BlogDetail from './components/BlogDetail';
import { CartProvider } from './context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black min-h-screen"
    >
      <Navbar />
      <Hero />
      <DealsSection />
      <MenuSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </motion.div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div className="grain-overlay" />
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
            <Route path="/blog/:blogId" element={<BlogDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </CartProvider>
  );
}
