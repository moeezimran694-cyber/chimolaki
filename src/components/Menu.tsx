import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem, OrderItem } from '../types';
import { Plus, X, ShoppingCart, Check, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'menu_items'), orderBy('name'));
    return onSnapshot(q, (s) => {
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
    });
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff3c38]/3 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#ffcc00]/3 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#ff3c38] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Selection</span>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              EXPLORE OUR <br />
              <span className="text-[#ffcc00]">PARADISE MENU</span>
            </h2>
          </motion.div>
          <div className="flex flex-wrap gap-3 glass p-2 rounded-2xl border-white/5">
            {['All', 'Pizza', 'Pasta', 'Sides', 'Drinks'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.1em] relative overflow-hidden group",
                  activeCategory === cat 
                    ? "bg-[#ffcc00] text-black shadow-lg" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <span className="relative z-10">{cat}</span>
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCat"
                    className="absolute inset-0 bg-[#ffcc00]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.02,
                  layout: { duration: 0.3 }
                }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-[2rem] overflow-hidden group relative shadow-2xl border-white/5 hover:border-[#ff3c38]/30"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image || `https://picsum.photos/seed/${item.name}/600/600`} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                      {item.category || 'Pizza'}
                    </span>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(item)}
                    className="absolute top-5 right-5 p-3 bg-white/5 backdrop-blur-md rounded-xl text-white hover:bg-[#ffcc00] hover:text-black transition-all border border-white/10"
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-7 relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-[#ffcc00] transition-colors">{item.name}</h3>
                    <span className="text-[#ffcc00] font-black text-xl tracking-tighter">Rs. {item.price}</span>
                  </div>
                  <p className="text-white/30 text-[11px] mb-6 line-clamp-2 font-medium leading-relaxed tracking-tight">
                    {item.description}
                  </p>
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-4 bg-white/5 hover:bg-[#ff3c38] text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 group/btn border border-white/5 hover:border-[#ff3c38] shadow-lg hover:shadow-[#ff3c38]/20 uppercase tracking-[0.1em] text-[9px]"
                  >
                    <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" /> 
                    Customize & Add
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <PizzaModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onAdd={(orderItem) => {
              addToCart(orderItem);
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function PizzaModal({ item, onClose, onAdd }: { item: MenuItem, onClose: () => void, onAdd: (i: OrderItem) => void }) {
  const [size, setSize] = useState('Medium');
  const [crust, setCrust] = useState('Hand Tossed');
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const sizePrices: Record<string, number> = { 'Small': -100, 'Medium': 0, 'Large': 200 };
  const currentPrice = (item.price + sizePrices[size] + (extras.length * 50)) * quantity;

  const toggleExtra = (extra: string) => {
    setExtras(prev => prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img src={item.image || `https://picsum.photos/seed/${item.name}/800/800`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
        
        <div className="md:w-1/2 p-10 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{item.name}</h2>
              <p className="text-white/40 text-sm">{item.description}</p>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white"><X /></button>
          </div>

          <div className="space-y-8 flex-grow">
            {/* Size Selection */}
            <div>
              <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Select Size</h4>
              <div className="grid grid-cols-3 gap-3">
                {['Small', 'Medium', 'Large'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "py-3 rounded-2xl border font-bold text-sm transition-all",
                      size === s ? "bg-[#ff3c38] border-[#ff3c38] text-white" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Crust Selection */}
            <div>
              <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Crust Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {['Hand Tossed', 'Thin Crust', 'Pan Pizza', 'Stuffed Crust'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setCrust(c)}
                    className={cn(
                      "py-3 px-4 rounded-2xl border font-bold text-sm transition-all text-left flex justify-between items-center",
                      crust === c ? "bg-white/10 border-[#ffcc00] text-[#ffcc00]" : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {c}
                    {crust === c && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Add Extras (+Rs. 50 each)</h4>
              <div className="flex flex-wrap gap-3">
                {['Extra Cheese', 'Mushrooms', 'Olives', 'Jalapenos', 'Chicken Chunk', 'Pepperoni'].map(e => (
                  <button 
                    key={e}
                    onClick={() => toggleExtra(e)}
                    className={cn(
                      "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                      extras.includes(e) ? "bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]" : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Price</p>
              <p className="text-3xl font-black text-[#ffcc00]">Rs. {currentPrice}</p>
            </div>
            <button 
              onClick={() => onAdd({
                id: `${item.id}-${Date.now()}`,
                name: item.name,
                size,
                crust,
                extras,
                quantity,
                price: item.price + sizePrices[size] + (extras.length * 50)
              })}
              className="px-10 py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#ff3c38]/20 flex items-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" /> Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
