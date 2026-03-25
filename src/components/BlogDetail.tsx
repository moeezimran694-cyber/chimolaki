import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function BlogDetail() {
  const { blogId } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!blogId) return;
    const unsub = onSnapshot(doc(db, 'blog', blogId), (doc) => {
      if (doc.exists()) {
        setPost({ id: doc.id, ...doc.data() } as BlogPost);
      }
    });
    return () => unsub();
  }, [blogId]);

  if (!post) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/40 font-bold uppercase tracking-widest text-xs">
      Loading story...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-40 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff3c38]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ffcc00]/5 blur-[150px] rounded-full" />

      <Navbar />
      <div className="max-w-4xl mx-auto px-8 pb-32 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-white/30 hover:text-white transition-all mb-16 font-black uppercase tracking-[0.3em] text-[10px] glass px-6 py-3 rounded-2xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Stories
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative h-[500px] rounded-[4rem] overflow-hidden mb-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
            <img 
              src={post.image || `https://picsum.photos/seed/${post.title}/1200/600`} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12">
              <span className="glass bg-[#ff3c38]/80 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full border border-white/20 shadow-2xl">
                {post.category}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-10 mb-12 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3 glass px-5 py-2 rounded-xl border border-white/5"><User className="w-4 h-4 text-[#ffcc00]" /> {post.author}</div>
            <div className="flex items-center gap-3 glass px-5 py-2 rounded-xl border border-white/5"><Calendar className="w-4 h-4 text-[#ffcc00]" /> {new Date(post.createdAt?.toDate()).toLocaleDateString()}</div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-16 leading-[0.9] text-glow">
            {post.title}
          </h1>

          <div className="glass-dark border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 text-xl md:text-2xl leading-relaxed font-medium whitespace-pre-wrap selection:bg-[#ff3c38] selection:text-white">
                {post.content}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
