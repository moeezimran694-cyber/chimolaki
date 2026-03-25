import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Deal } from '../types';
import { Tag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function DealsSection() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    return onSnapshot(collection(db, 'deals'), (s) => {
      setDeals(s.docs.map(d => ({ id: d.id, ...d.data() } as Deal)));
    });
  }, []);

  if (deals.length === 0) return null;

  return (
    <section id="deals" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#ff3c38]/3 blur-[100px] rounded-full" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffcc00]/3 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#ff3c38] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Limited Time</span>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              EXCLUSIVE <br />
              <span className="text-[#ffcc00]">PARADISE DEALS</span>
            </h2>
          </motion.div>
          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#ffcc00] border border-white/10 shadow-xl">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {deals.map((deal, index) => (
              <motion.div 
                key={deal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                whileHover={{ y: -8 }}
                className="relative h-[480px] rounded-[2.5rem] overflow-hidden group cursor-pointer glass-card shadow-2xl border-white/5 hover:border-[#ffcc00]/30"
              >
                <img 
                  src={deal.image || `https://picsum.photos/seed/${deal.title}/800/600`} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-95" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#ff3c38] text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg border border-white/10">
                      Save {deal.discount}%
                    </span>
                    <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                      Limited
                    </span>
                  </div>
                  
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-[0.9] group-hover:text-[#ffcc00] transition-colors">
                    {deal.title}
                  </h3>
                  
                  <p className="text-white/30 text-[11px] mb-6 font-medium leading-relaxed line-clamp-2 tracking-tight">
                    {deal.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="relative">
                      <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Special Price</p>
                      <span className="text-[#ffcc00] font-black text-3xl tracking-tighter">Rs. {deal.price}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: `${deal.id}-${Date.now()}`,
                          name: deal.title,
                          size: 'Deal',
                          crust: 'Standard',
                          extras: [],
                          quantity: 1,
                          price: deal.price
                        });
                      }}
                      className="flex items-center gap-2 bg-[#ffcc00] text-black px-6 py-3.5 rounded-xl font-black uppercase tracking-[0.1em] text-[9px] group/btn hover:scale-105 transition-all shadow-xl"
                    >
                      Order <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
