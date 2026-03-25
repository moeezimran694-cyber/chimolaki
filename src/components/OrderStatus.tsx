import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Package, ChefHat, Truck, CheckCircle, ArrowLeft, Phone, MapPin } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../lib/utils';

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    const unsub = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() } as Order);
      }
    });
    return () => unsub();
  }, [orderId]);

  if (!order) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/40 font-bold uppercase tracking-widest text-xs">
      Loading your paradise...
    </div>
  );

  const steps = [
    { id: 'Processing', icon: Package, label: 'Processing' },
    { id: 'Preparing', icon: ChefHat, label: 'Preparing' },
    { id: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
    { id: 'Delivered', icon: CheckCircle, label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="min-h-screen bg-[#050505] pt-40 pb-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff3c38]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ffcc00]/5 blur-[150px] rounded-full" />

      <Navbar />
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-white/30 hover:text-white transition-all mb-16 font-black uppercase tracking-[0.3em] text-[10px] glass px-6 py-3 rounded-2xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="glass-dark border border-white/10 rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
            <div>
              <span className="text-[#ffcc00] font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Order Status</span>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">TRACKING YOUR <span className="text-[#ff3c38]">PARADISE</span></h2>
              <p className="text-white/30 text-xs font-black mt-4 uppercase tracking-[0.2em]">Order ID: <span className="text-white text-glow">#{order.id?.slice(-6).toUpperCase()}</span></p>
            </div>
            <div className="glass bg-white/5 border border-white/10 px-8 py-6 rounded-[2rem] shadow-2xl">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Estimated Delivery</span>
              <span className="text-white font-black text-3xl tracking-tighter">30-45 MINS</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-32 px-4">
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-white/5 -translate-y-1/2 rounded-full" />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="absolute top-1/2 left-0 h-1.5 bg-[#ffcc00] -translate-y-1/2 rounded-full shadow-[0_0_30px_rgba(255,204,0,0.6)]"
            />
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <motion.div 
                      animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 rgba(255,204,0,0)", "0 0 40px rgba(255,204,0,0.4)", "0 0 0 rgba(255,204,0,0)"] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={cn(
                        "w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 relative z-10",
                        isActive 
                          ? "bg-[#ffcc00] border-[#ffcc00] text-black shadow-[0_20px_40px_rgba(255,204,0,0.3)]" 
                          : "glass-dark border-white/10 text-white/10"
                      )}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <span className={cn(
                      "absolute -bottom-12 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-700",
                      isActive ? "text-white opacity-100 translate-y-0" : "text-white/10 opacity-50 translate-y-2"
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-white/10">
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-tighter text-2xl leading-none">Order <span className="text-[#ffcc00]">Details</span></h4>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center glass-dark p-6 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 glass rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-white font-black text-sm uppercase tracking-tighter">{item.quantity}x {item.name}</p>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em]">{item.size} • {item.crust}</p>
                      </div>
                    </div>
                    <span className="text-[#ffcc00] font-black text-lg tracking-tighter">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-tighter text-2xl leading-none">Customer <span className="text-[#ffcc00]">Info</span></h4>
              <div className="space-y-4">
                <div className="flex items-center gap-6 glass-dark p-6 rounded-[1.5rem] border border-white/5">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/20 border border-white/10"><Phone className="w-6 h-6" /></div>
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Phone</p>
                    <p className="text-white font-black text-lg tracking-tight">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 glass-dark p-6 rounded-[1.5rem] border border-white/5">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/20 border border-white/10"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Address</p>
                    <p className="text-white font-black text-lg tracking-tight leading-tight">{order.address}</p>
                  </div>
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
