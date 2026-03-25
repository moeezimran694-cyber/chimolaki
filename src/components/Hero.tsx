import { motion } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Hero() {
  const settings = useSettings();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000" 
          alt="Pizza Hero" 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
      </div>

      {/* Floating Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#ff3c38]/3 blur-[60px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#ffcc00]/3 blur-[60px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-dark p-10 md:p-16 rounded-3xl max-w-4xl mx-auto relative overflow-hidden border-white/10 shadow-xl"
        >
          {/* Internal Glows */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#ff3c38]/5 blur-[50px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#ffcc00]/3 blur-[50px]" />

          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-5 py-1.5 rounded-full bg-white/5 text-[#ff3c38] text-[9px] font-black uppercase tracking-[0.3em] mb-8 border border-white/10 backdrop-blur-md"
          >
            {settings.address.split(',')[1]?.trim() || "Faisalabad"}'s Premium Pizza
          </motion.span>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block"
            >
              {settings.restaurantName.split(' ')[0]}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#ffcc00] block"
            >
              {settings.restaurantName.split(' ').slice(1).join(' ')}
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/40 text-base md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight"
          >
            Where Italian heritage meets Pakistani soul. <br className="hidden md:block" />
            Crafted with passion, served in paradise.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-10 py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg border border-white/10 uppercase tracking-[0.1em]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-lg backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 uppercase tracking-[0.1em]"
            >
              <Play className="w-5 h-5 fill-white" />
              View Menu
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-20 w-24 h-24 glass rounded-2xl shadow-xl border-white/10 opacity-20 hidden lg:block" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-20 w-32 h-32 glass rounded-3xl shadow-xl border-white/10 opacity-20 hidden lg:block" 
      />

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">Scroll to Explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center p-1.5">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-[#ffcc00] rounded-full" 
          />
        </div>
      </motion.div>
    </section>
  );
}
