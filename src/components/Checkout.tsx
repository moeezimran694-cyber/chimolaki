import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, CheckCircle, Package, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Navbar from './Navbar';
import Footer from './Footer';
import StripePaymentForm from './StripePaymentForm';

// Load Stripe outside of component to avoid re-initialization
const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD' as 'COD' | 'Online'
  });

  const placeOrder = async (paymentIntentId?: string) => {
    setIsPlacing(true);
    setPaymentError(null);

    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        items: cart,
        totalPrice,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'Online' ? 'Paid' : 'Pending',
        paymentIntentId: paymentIntentId || null,
        status: 'Processing',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderSuccess(docRef.id);
      clearCart();
    } catch (error: any) {
      console.error("Error placing order:", error);
      setPaymentError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (formData.paymentMethod === 'COD') {
      await placeOrder();
    }
    // For Online, the StripePaymentForm will handle the submission
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3c38]/20 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffcc00]/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="glass-dark border border-white/10 p-16 rounded-[4rem] max-w-xl w-full text-center relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="w-32 h-32 glass bg-[#ffcc00]/10 text-[#ffcc00] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-[#ffcc00]/20 shadow-2xl shadow-[#ffcc00]/10">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Order <span className="text-[#ffcc00]">Placed!</span></h2>
          <p className="text-white/40 mb-12 font-black uppercase tracking-[0.2em] text-xs leading-relaxed">
            Your paradise is being prepared.<br />
            Order ID: <span className="text-white text-glow">#{orderSuccess.slice(-6).toUpperCase()}</span>
          </p>
          <button 
            onClick={() => navigate(`/order/${orderSuccess}`)}
            className="w-full py-6 bg-[#ff3c38] text-white rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,60,56,0.4)] uppercase tracking-widest flex items-center justify-center gap-4"
          >
            Track Your Paradise <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-40 pb-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff3c38]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ffcc00]/5 blur-[150px] rounded-full" />

      <Navbar />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-white/30 hover:text-white transition-all mb-16 font-black uppercase tracking-[0.3em] text-[10px] glass px-6 py-3 rounded-2xl border border-white/5"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Paradise
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-16">
            <div>
              <h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">CHECK<span className="text-[#ffcc00]">OUT</span></h2>
              <p className="text-white/30 font-black uppercase tracking-[0.2em] text-xs">Complete your details to place the order.</p>
            </div>

            {paymentError && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-red-500"
              >
                <AlertCircle className="w-6 h-6" />
                <p className="font-black uppercase tracking-widest text-[10px]">{paymentError}</p>
              </motion.div>
            )}

            <div className="space-y-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] ml-4">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full glass-dark border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-[#ffcc00] transition-all text-lg font-black tracking-tight placeholder:text-white/10"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] ml-4">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full glass-dark border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-[#ffcc00] transition-all text-lg font-black tracking-tight placeholder:text-white/10"
                    placeholder="0300-1234567"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] ml-4">Delivery Address</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full glass-dark border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-[#ffcc00] transition-all text-lg font-black tracking-tight placeholder:text-white/10 resize-none"
                    placeholder="Street 123, Faisalabad"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] ml-4">Payment Method</h4>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                    className={cn(
                      "p-10 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all group relative overflow-hidden",
                      formData.paymentMethod === 'COD' 
                        ? "glass bg-[#ffcc00]/10 border-[#ffcc00] text-[#ffcc00] shadow-2xl shadow-[#ffcc00]/10" 
                        : "glass-dark border-white/10 text-white/30 hover:border-white/20"
                    )}
                  >
                    <Truck className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-tighter text-sm">Cash on Delivery</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'Online'})}
                    className={cn(
                      "p-10 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all group relative overflow-hidden",
                      formData.paymentMethod === 'Online' 
                        ? "glass bg-[#ffcc00]/10 border-[#ffcc00] text-[#ffcc00] shadow-2xl shadow-[#ffcc00]/10" 
                        : "glass-dark border-white/10 text-white/30 hover:border-white/20"
                    )}
                  >
                    <CreditCard className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-tighter text-sm">Online Payment</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'Online' ? (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm 
                    amount={totalPrice + 150} 
                    onSuccess={(id) => placeOrder(id)} 
                    onError={(err) => setPaymentError(err)} 
                  />
                </Elements>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isPlacing || cart.length === 0}
                  className="w-full py-8 bg-[#ff3c38] hover:bg-[#ff3c38]/90 text-white rounded-[2.5rem] font-black text-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_30px_60px_rgba(255,60,56,0.4)] flex items-center justify-center gap-4 uppercase tracking-widest"
                >
                  {isPlacing ? "Placing Order..." : (
                    <>
                      Place Order <Package className="w-8 h-8" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-40 h-fit">
            <div className="glass-dark border border-white/10 rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 leading-none">Order <span className="text-[#ffcc00]">Summary</span></h3>
              <div className="space-y-8 mb-12">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-start group">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 glass rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-tighter">{item.quantity}x {item.name}</h4>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em]">{item.size} • {item.crust}</p>
                      </div>
                    </div>
                    <span className="text-white/60 font-black text-sm tracking-tighter">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-10 border-t border-white/10 space-y-6">
                <div className="flex justify-between text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">
                  <span>Subtotal</span>
                  <span className="text-white text-lg tracking-tighter">Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">
                  <span>Delivery Fee</span>
                  <span className="text-white text-lg tracking-tighter">Rs. 150</span>
                </div>
                <div className="flex justify-between pt-8 border-t border-white/10">
                  <span className="text-white font-black text-xl uppercase tracking-tighter">Total Amount</span>
                  <span className="text-4xl font-black text-[#ffcc00] text-glow-red tracking-tighter">Rs. {totalPrice + 150}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
