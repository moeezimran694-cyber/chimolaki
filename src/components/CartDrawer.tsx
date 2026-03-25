import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-dark border-l border-white/10 z-[70] flex flex-col shadow-xl"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#ffcc00] border border-white/10 shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Your <span className="text-[#ffcc00]">Cart</span></h2>
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all border border-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center border border-white/10 shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white/10" />
                  </div>
                  <p className="text-white/30 font-black uppercase tracking-[0.1em] text-[10px]">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-[#ff3c38] text-white rounded-xl font-black text-base hover:scale-105 transition-all shadow-lg shadow-[#ff3c38]/10 uppercase tracking-widest"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.crust}-${item.extras.join(',')}`} className="flex gap-4 group relative">
                    <div className="w-20 h-20 glass rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
                      <img src={`https://picsum.photos/seed/${item.name}/200/200`} alt={item.name} className="w-full h-full object-cover transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-white text-base uppercase tracking-tighter leading-none">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-white/10 hover:text-[#ff3c38] transition-all hover:bg-[#ff3c38]/10 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-white/30 text-[9px] mb-3 uppercase tracking-[0.1em] font-black">
                        {item.size} • {item.crust}
                        {item.extras.length > 0 && ` • +${item.extras.length} extras`}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 glass bg-white/5 rounded-xl px-3 py-1.5 border border-white/10">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/40 hover:text-white transition-colors"><Minus className="w-2.5 h-2.5" /></button>
                          <span className="text-white font-black text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/40 hover:text-white transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                        </div>
                        <span className="text-[#ffcc00] font-black text-base">Rs. {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-white/10 space-y-6 glass bg-black/40 backdrop-blur-xl">
                <div className="flex justify-between items-center text-white/30 uppercase tracking-[0.2em] font-black text-[9px]">
                  <span>Subtotal</span>
                  <span className="text-white text-2xl tracking-tighter">Rs. {totalPrice}</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="w-full py-5 bg-[#ff3c38] hover:bg-[#ff3c38]/90 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#ff3c38]/20 uppercase tracking-widest"
                >
                  Checkout <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
