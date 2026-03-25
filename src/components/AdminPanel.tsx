import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem, Order, Message, Deal, BlogPost, SiteSettings } from '../types';
import { 
  LayoutDashboard, 
  Pizza, 
  ShoppingBag, 
  MessageSquare, 
  Tag, 
  BookOpen, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Clock, 
  Truck, 
  ChefHat, 
  X,
  Reply
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'menu' | 'deal' | 'blog' | 'reply' | 'settings'>('menu');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  // Form states
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({ name: '', description: '', price: 0, category: 'Pizza', image: '', options: { sizes: ['Small', 'Medium', 'Large'], crusts: ['Hand Tossed'], toppings: [] } });
  const [dealForm, setDealForm] = useState<Partial<Deal>>({ title: '', description: '', price: 0, discount: 0, image: '', code: '' });
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({ title: '', content: '', image: '', author: 'Admin', category: 'News' });
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({ 
    restaurantName: 'Pizza Paradise', 
    contactEmail: '', 
    contactPhone: '', 
    address: '', 
    openingHours: '',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: ''
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (s) => {
      setOrders(s.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });
    const unsubMenu = onSnapshot(query(collection(db, 'menu_items'), orderBy('name')), (s) => {
      setMenu(s.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
    });
    const unsubMessages = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (s) => {
      setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    });
    const unsubDeals = onSnapshot(query(collection(db, 'deals')), (s) => {
      setDeals(s.docs.map(d => ({ id: d.id, ...d.data() } as Deal)));
    });
    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('createdAt', 'desc')), (s) => {
      setBlog(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
    });
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (d) => {
      if (d.exists()) setSiteSettings(d.data() as SiteSettings);
    });

    return () => {
      unsubOrders();
      unsubMenu();
      unsubMessages();
      unsubDeals();
      unsubBlog();
      unsubSettings();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (editingItem) {
      if (modalType === 'menu') setMenuForm(editingItem);
      if (modalType === 'deal') setDealForm(editingItem);
      if (modalType === 'blog') setBlogForm(editingItem);
    } else {
      setMenuForm({ name: '', description: '', price: 0, category: 'Pizza', image: '', options: { sizes: ['Small', 'Medium', 'Large'], crusts: ['Hand Tossed'], toppings: [] } });
      setDealForm({ title: '', description: '', price: 0, discount: 0, image: '', code: '' });
      setBlogForm({ title: '', content: '', image: '', author: 'Admin', category: 'News' });
    }
  }, [editingItem, modalType]);

  useEffect(() => {
    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateDoc(doc(db, 'menu_items', editingItem.id), menuForm);
    } else {
      await addDoc(collection(db, 'menu_items'), menuForm);
    }
    setIsModalOpen(false);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateDoc(doc(db, 'deals', editingItem.id), dealForm);
    } else {
      await addDoc(collection(db, 'deals'), dealForm);
    }
    setIsModalOpen(false);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateDoc(doc(db, 'blog', editingItem.id), blogForm);
    } else {
      await addDoc(collection(db, 'blog'), { ...blogForm, createdAt: serverTimestamp() });
    }
    setIsModalOpen(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, 'settings', 'general'), settingsForm);
    alert('Settings saved!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'moeezimran123') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  };

  const handleReply = async (messageId: string) => {
    await updateDoc(doc(db, 'messages', messageId), { 
      adminReply: replyText,
      status: 'read'
    });
    setReplyText('');
    setIsModalOpen(false);
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#111] border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center"
        >
          <Pizza className="w-16 h-16 text-[#ff3c38] mx-auto mb-8" />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00] transition-colors text-center"
              placeholder="Enter Password"
            />
            <button className="w-full py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-[#ff3c38]/20">
              Login to Paradise
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#0a0a0a] border-r border-white/10 p-8 flex flex-col gap-12 fixed h-full z-50">
        <div className="flex items-center gap-3">
          <Pizza className="w-8 h-8 text-[#ff3c38]" />
          <span className="text-xl font-black text-white uppercase tracking-tighter">Admin Panel</span>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'menu', icon: Pizza, label: 'Menu' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
            { id: 'deals', icon: Tag, label: 'Deals' },
            { id: 'blog', icon: BookOpen, label: 'Blog' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm",
                activeTab === tab.id ? "bg-[#ff3c38] text-white shadow-2xl shadow-[#ff3c38]/20" : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={() => setIsLoggedIn(false)} className="text-white/20 hover:text-red-500 font-bold text-sm uppercase tracking-widest">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-80 p-12">
        <header className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{activeTab}</h2>
          <div className="flex items-center gap-6">
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-1">Total Revenue</span>
              <span className="text-[#ffcc00] font-black text-xl">Rs. {orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}</span>
            </div>
            <button 
              onClick={() => {
                setEditingItem(null);
                setModalType(activeTab as any);
                setIsModalOpen(true);
              }}
              className="p-4 bg-[#ff3c38] text-white rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[#ff3c38]/20"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="#ff3c38" />
            <StatCard label="Active Orders" value={orders.filter(o => o.status !== 'Delivered').length} icon={Clock} color="#ffcc00" />
            <StatCard label="Unread Messages" value={messages.filter(m => m.status === 'unread').length} icon={MessageSquare} color="#4ade80" />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">#{order.id?.slice(-6).toUpperCase()}</h3>
                    <span className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      order.status === 'Delivered' ? "bg-green-500/20 text-green-500" : "bg-[#ffcc00]/20 text-[#ffcc00]"
                    )}>{order.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Customer</p>
                      <p className="text-white font-bold">{order.customerName}</p>
                      <p className="text-white/40 text-sm">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Address</p>
                      <p className="text-white font-bold text-sm line-clamp-2">{order.address}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Items</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-xs text-white/60">
                          {item.quantity}x {item.name} ({item.size})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-6">
                  <div className="text-right">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-[#ffcc00]">Rs. {order.totalPrice}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateOrderStatus(order.id!, 'Preparing')} className="p-3 bg-white/5 text-white/40 hover:text-[#ffcc00] rounded-xl transition-all"><ChefHat className="w-5 h-5" /></button>
                    <button onClick={() => updateOrderStatus(order.id!, 'Out for Delivery')} className="p-3 bg-white/5 text-white/40 hover:text-[#ffcc00] rounded-xl transition-all"><Truck className="w-5 h-5" /></button>
                    <button onClick={() => updateOrderStatus(order.id!, 'Delivered')} className="p-3 bg-white/5 text-white/40 hover:text-green-500 rounded-xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                    <button onClick={() => deleteItem('orders', order.id!)} className="p-3 bg-white/5 text-white/40 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {messages.map(msg => (
              <div key={msg.id} className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{msg.name}</h3>
                    <p className="text-white/40 text-sm">{msg.email}</p>
                  </div>
                  <span className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    msg.status === 'read' ? "bg-green-500/20 text-green-500" : "bg-[#ff3c38]/20 text-[#ff3c38]"
                  )}>{msg.status}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5 italic">
                  "{msg.message}"
                </p>
                {msg.adminReply && (
                  <div className="bg-[#ffcc00]/10 border border-[#ffcc00]/20 p-6 rounded-2xl">
                    <p className="text-[#ffcc00] text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Reply className="w-3 h-3" /> Your Reply
                    </p>
                    <p className="text-white text-sm">{msg.adminReply}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setEditingItem(msg);
                      setModalType('reply');
                      setIsModalOpen(true);
                    }}
                    className="flex-grow py-4 bg-white/5 hover:bg-[#ffcc00] hover:text-black text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Reply className="w-5 h-5" /> Reply
                  </button>
                  <button onClick={() => deleteItem('messages', msg.id!)} className="p-4 bg-white/5 text-white/20 hover:text-red-500 rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menu.map(item => (
              <div key={item.id} className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden group">
                <div className="h-48 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => { setEditingItem(item); setModalType('menu'); setIsModalOpen(true); }} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-[#ffcc00]"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem('menu_items', item.id!)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-white uppercase mb-2">{item.name}</h3>
                  <p className="text-[#ffcc00] font-black mb-4">Rs. {item.price}</p>
                  <p className="text-white/40 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deals.map(deal => (
              <div key={deal.id} className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden flex">
                <div className="w-1/3">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-2/3 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-white uppercase">{deal.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(deal); setModalType('deal'); setIsModalOpen(true); }} className="text-white/20 hover:text-[#ffcc00]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteItem('deals', deal.id!)} className="text-white/20 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-[#ffcc00] font-black mb-2">Rs. {deal.price} ({deal.discount}% OFF)</p>
                  <p className="text-white/40 text-sm line-clamp-2">{deal.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blog.map(post => (
              <div key={post.id} className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="h-48 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => { setEditingItem(post); setModalType('blog'); setIsModalOpen(true); }} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-[#ffcc00]"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem('blog', post.id!)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-white uppercase mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-white/40 text-sm line-clamp-3">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#111] border border-white/10 p-12 rounded-[3rem]">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Restaurant Name</label>
                  <input required type="text" value={settingsForm.restaurantName} onChange={(e) => setSettingsForm({...settingsForm, restaurantName: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Contact Email</label>
                  <input required type="email" value={settingsForm.contactEmail} onChange={(e) => setSettingsForm({...settingsForm, contactEmail: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Contact Phone</label>
                  <input required type="text" value={settingsForm.contactPhone} onChange={(e) => setSettingsForm({...settingsForm, contactPhone: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Address</label>
                  <textarea required rows={3} value={settingsForm.address} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00] resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Opening Hours</label>
                  <input required type="text" value={settingsForm.openingHours} onChange={(e) => setSettingsForm({...settingsForm, openingHours: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Instagram URL</label>
                    <input type="text" value={settingsForm.instagramUrl} onChange={(e) => setSettingsForm({...settingsForm, instagramUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Facebook URL</label>
                    <input type="text" value={settingsForm.facebookUrl} onChange={(e) => setSettingsForm({...settingsForm, facebookUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Twitter URL</label>
                    <input type="text" value={settingsForm.twitterUrl} onChange={(e) => setSettingsForm({...settingsForm, twitterUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00]" />
                  </div>
                </div>
              </div>
              <button className="w-full py-5 bg-[#ffcc00] text-black rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-[#ffcc00]/20">Save Settings</button>
            </form>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] max-w-2xl w-full p-12"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                  {modalType === 'reply' ? 'Reply to Message' : `Add New ${modalType}`}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/20 hover:text-white"><X /></button>
              </div>

              {modalType === 'reply' && (
                <div className="space-y-8">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">User Message</p>
                    <p className="text-white text-sm italic">"{editingItem?.message}"</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Your Reply</label>
                    <textarea 
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ffcc00] transition-colors resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>
                  <button 
                    onClick={() => handleReply(editingItem.id)}
                    className="w-full py-5 bg-[#ffcc00] text-black rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-[#ffcc00]/20"
                  >
                    Send Reply
                  </button>
                </div>
              )}

              {modalType === 'menu' && (
                <form onSubmit={handleSaveMenu} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Item Name</label>
                      <input required type="text" value={menuForm.name} onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Price (Rs.)</label>
                      <input required type="number" value={menuForm.price} onChange={(e) => setMenuForm({...menuForm, price: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Description</label>
                    <textarea required rows={3} value={menuForm.description} onChange={(e) => setMenuForm({...menuForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00] resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Image URL</label>
                    <input required type="text" value={menuForm.image} onChange={(e) => setMenuForm({...menuForm, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Category</label>
                    <select value={menuForm.category} onChange={(e) => setMenuForm({...menuForm, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]">
                      <option value="Pizza">Pizza</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Sides">Sides</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>
                  <button className="w-full py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all">Save Item</button>
                </form>
              )}

              {modalType === 'deal' && (
                <form onSubmit={handleSaveDeal} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Deal Title</label>
                    <input required type="text" value={dealForm.title} onChange={(e) => setDealForm({...dealForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Price (Rs.)</label>
                      <input required type="number" value={dealForm.price} onChange={(e) => setDealForm({...dealForm, price: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Discount (%)</label>
                      <input required type="number" value={dealForm.discount} onChange={(e) => setDealForm({...dealForm, discount: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Description</label>
                    <textarea required rows={3} value={dealForm.description} onChange={(e) => setDealForm({...dealForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00] resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Image URL</label>
                    <input required type="text" value={dealForm.image} onChange={(e) => setDealForm({...dealForm, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                  </div>
                  <button className="w-full py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all">Save Deal</button>
                </form>
              )}

              {modalType === 'blog' && (
                <form onSubmit={handleSaveBlog} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Blog Title</label>
                    <input required type="text" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Content</label>
                    <textarea required rows={8} value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00] resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Author</label>
                      <input required type="text" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Category</label>
                      <input required type="text" value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Image URL</label>
                    <input required type="text" value={blogForm.image} onChange={(e) => setBlogForm({...blogForm, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#ffcc00]" />
                  </div>
                  <button className="w-full py-5 bg-[#ff3c38] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all">Save Post</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-[#111] border border-white/10 p-10 rounded-[3rem] space-y-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}10`, color }}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
