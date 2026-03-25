import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Pizza, Download, Instagram, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useSettings } from '../hooks/useSettings';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  const settings = useSettings();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled ? "py-4" : "py-6"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto px-8 py-4 rounded-3xl flex items-center justify-between transition-all duration-500 border relative overflow-hidden",
          isScrolled 
            ? "glass-dark border-white/10 shadow-xl" 
            : "bg-transparent border-transparent"
        )}>
          <Link to="/" className="flex items-center gap-3 group/logo relative z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-12 h-12 bg-[#ff3c38] rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
            >
              <span className="text-white font-black text-2xl">P</span>
            </motion.div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              {settings.restaurantName.split(' ')[0]}
              <span className="text-[#ffcc00]">{settings.restaurantName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 relative z-10">
            {['Menu', 'Deals', 'Blog', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={`/#${item.toLowerCase()}`}
                className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group/item"
              >
                {item}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#ff3c38] rounded-full transition-all group-hover/item:w-6" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-4 bg-white/5 hover:bg-[#ff3c38] rounded-2xl text-white transition-all border border-white/10 group/cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#ffcc00] text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#050505]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-4 bg-white/5 rounded-2xl text-white border border-white/10 hover:bg-white/10 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-6 right-6 mt-2 glass-dark border border-white/10 p-8 rounded-3xl flex flex-col gap-6 md:hidden shadow-2xl z-40"
            >
              {['Menu', 'Deals', 'Blog', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  to={`/#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black text-white/50 hover:text-[#ffcc00] uppercase tracking-tighter transition-all"
                >
                  {item}
                </Link>
              ))}
              <div className="h-px bg-white/10 w-full" />
              <button 
                onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                className="flex items-center justify-between w-full text-xl font-black text-white uppercase tracking-tighter"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-[#ff3c38]" /> 
                  <span>Cart</span>
                </div>
                <span className="bg-[#ffcc00] text-black px-4 py-1 rounded-full text-xs">{cartCount} Items</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
