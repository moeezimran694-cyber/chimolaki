import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, addDoc, serverTimestamp, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Message } from '../types';
import { Send, Mail, Phone, MapPin, Instagram, CheckCircle2, MessageCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInstaPopup, setShowInstaPopup] = useState(false);
  const [recentReplies, setRecentReplies] = useState<Message[]>([]);
  const settings = useSettings();

  useEffect(() => {
    // Listen for recent replies to the user's email if they've sent one
    const savedEmail = localStorage.getItem('last_contact_email');
    if (savedEmail) {
      const q = query(
        collection(db, 'messages'), 
        where('email', '==', savedEmail),
        where('status', '==', 'read'),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (s) => {
        setRecentReplies(s.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      localStorage.setItem('last_contact_email', formData.email);
      setIsSuccess(true);
      setFormData({ ...formData, message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#ff3c38]/5 blur-[200px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffcc00]/5 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#ff3c38] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Get in Touch</span>
            <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-12 uppercase leading-[0.85]">
              LET'S <br />
              <span className="text-[#ffcc00] text-glow-red">CONNECT</span>
            </h2>
            <p className="text-white/40 text-xl md:text-2xl mb-20 max-w-lg font-medium leading-relaxed tracking-tight">
              Have a question or want to place a bulk order? We'd love to hear from you. 
              Our team is ready to serve you the best pizza in town.
            </p>

            <div className="space-y-12">
              <div className="flex items-center gap-10 group">
                <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center group-hover:bg-[#ff3c38]/20 transition-all duration-500 border border-white/10 shadow-2xl">
                  <Mail className="w-10 h-10 text-[#ff3c38]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Email Us</p>
                  <a href={`mailto:${settings.contactEmail}`} className="text-3xl font-black text-white hover:text-[#ffcc00] transition-colors tracking-tighter uppercase">{settings.contactEmail}</a>
                </div>
              </div>

              <div className="flex items-center gap-10 group">
                <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center group-hover:bg-[#ffcc00]/20 transition-all duration-500 border border-white/10 shadow-2xl">
                  <Phone className="w-10 h-10 text-[#ffcc00]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Call Us</p>
                  <a href={`tel:${settings.contactPhone}`} className="text-3xl font-black text-white hover:text-[#ffcc00] transition-colors tracking-tighter uppercase">{settings.contactPhone}</a>
                </div>
              </div>

              <div className="flex items-center gap-10 group">
                <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center group-hover:bg-[#ff3c38]/20 transition-all duration-500 border border-white/10 shadow-2xl">
                  <MapPin className="w-10 h-10 text-[#ff3c38]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Visit Us</p>
                  <p className="text-3xl font-black text-white tracking-tighter uppercase leading-tight max-w-xs">{settings.address}</p>
                </div>
              </div>

              {settings.instagramUrl && (
                <button 
                  onClick={() => setShowInstaPopup(true)}
                  className="flex items-center gap-10 group w-full text-left"
                >
                  <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center group-hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-500 border border-white/10 shadow-2xl">
                    <Instagram className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Follow Us</p>
                    <p className="text-3xl font-black text-white group-hover:text-[#dc2743] transition-colors tracking-tighter uppercase">Instagram</p>
                  </div>
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-dark p-16 md:p-24 rounded-[5rem] border border-white/10 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
          >
            {/* Inner Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffcc00]/10 blur-[120px] animate-pulse-glow" />

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              {recentReplies.length > 0 && (
                <div className="space-y-6 mb-16">
                  <h4 className="text-[#ffcc00] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
                    <MessageCircle className="w-5 h-5" /> Recent Admin Replies
                  </h4>
                  {recentReplies.map(reply => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={reply.id} 
                      className="glass bg-[#ffcc00]/5 border-[#ffcc00]/20 p-10 rounded-[2.5rem] shadow-2xl"
                    >
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">RE: {reply.message.slice(0, 30)}...</p>
                      <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">{reply.adminReply}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-8">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-10 py-6 text-white text-xl focus:outline-none focus:border-[#ffcc00] transition-all backdrop-blur-2xl placeholder:text-white/10 font-bold shadow-2xl"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-8">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-10 py-6 text-white text-xl focus:outline-none focus:border-[#ffcc00] transition-all backdrop-blur-2xl placeholder:text-white/10 font-bold shadow-2xl"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-8">Your Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-10 py-6 text-white text-xl focus:outline-none focus:border-[#ffcc00] transition-all backdrop-blur-2xl placeholder:text-white/10 resize-none font-bold shadow-2xl"
                  placeholder="How can we help you today?"
                />
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-[#ff3c38] hover:bg-[#ff3c38]/90 text-white py-8 rounded-[2.5rem] font-black text-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-6 disabled:opacity-50 shadow-[0_30px_60px_rgba(255,60,56,0.5)] uppercase tracking-[0.2em] border border-white/10"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message <Send className="w-8 h-8" />
                  </>
                )}
              </button>

              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-4 text-[#4ade80] font-black text-sm uppercase tracking-[0.3em]"
                >
                  <CheckCircle2 className="w-6 h-6" /> Message sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Instagram Popup */}
      {showInstaPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 p-16 rounded-[4rem] max-w-xl w-full text-center relative shadow-[0_50px_150px_rgba(0,0,0,1)]"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(220,39,67,0.4)] border border-white/20">
              <Instagram className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">FOLLOW OUR JOURNEY</h3>
            <p className="text-white/40 text-xl mb-12 font-medium leading-relaxed">Stay updated with our latest pizza creations, exclusive deals, and behind-the-scenes stories.</p>
            <div className="flex flex-col gap-6">
              <a 
                href={settings.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-[0.1em]"
              >
                Open Instagram
              </a>
              <button 
                onClick={() => setShowInstaPopup(false)}
                className="w-full bg-white/5 text-white/30 py-6 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all uppercase tracking-[0.1em]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
