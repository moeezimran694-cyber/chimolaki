import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { BookOpen, ArrowRight, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) => {
      setPosts(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
    });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#ff3c38]/3 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#ffcc00]/3 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#ff3c38] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Journal</span>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              PIZZA <br />
              <span className="text-[#ffcc00]">STORIES</span>
            </h2>
          </motion.div>
          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#ff3c38] border border-white/10 shadow-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden group relative shadow-xl"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={post.image || `https://picsum.photos/seed/${post.title}/800/600`} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                <div className="absolute top-6 left-6 glass px-4 py-1.5 rounded-full text-[9px] font-black text-[#ffcc00] uppercase tracking-[0.2em] border border-white/10">
                  {post.category}
                </div>
              </div>
              <div className="p-8 relative">
                <div className="flex items-center gap-4 mb-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#ff3c38]" /> {post.author}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#ffcc00]" /> {new Date(post.createdAt?.toDate()).toLocaleDateString()}</div>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9] group-hover:text-[#ffcc00] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-white/40 text-xs mb-8 line-clamp-3 font-medium leading-relaxed">
                  {post.content}
                </p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-3 text-[#ff3c38] font-black uppercase tracking-[0.2em] text-[10px] group/btn hover:gap-4 transition-all"
                >
                  Read Full Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
