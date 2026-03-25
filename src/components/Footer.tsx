import { Pizza, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#ff3c38]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div className="space-y-10">
            <Link to="/" className="flex items-center gap-3 group">
              <Pizza className="w-10 h-10 text-[#ff3c38] group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                {settings.restaurantName.split(' ')[0]}
                <span className="text-[#ffcc00]">{settings.restaurantName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-white/30 text-lg leading-relaxed max-w-xs font-medium tracking-tight">
              {settings.restaurantName}'s most premium pizza experience. We blend tradition with modern flavors to bring you paradise in every bite.
            </p>
            <div className="flex gap-5">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#ff3c38] hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-[0_10px_30px_rgba(255,60,56,0.3)] border border-white/10">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#ff3c38] hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-[0_10px_30px_rgba(255,60,56,0.3)] border border-white/10">
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#ff3c38] hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-[0_10px_30px_rgba(255,60,56,0.3)] border border-white/10">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {!settings.instagramUrl && !settings.facebookUrl && !settings.twitterUrl && (
                [Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#ff3c38] hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-[0_10px_30px_rgba(255,60,56,0.3)] border border-white/10">
                    <Icon className="w-6 h-6" />
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Quick Links</h4>
            <nav className="flex flex-col gap-5">
              {['Menu', 'Deals', 'Blog', 'Contact', 'Track Order'].map(link => (
                <Link key={link} to={`/#${link.toLowerCase()}`} className="text-white/40 hover:text-[#ffcc00] transition-all font-black text-sm uppercase tracking-[0.2em] hover:translate-x-2">
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-10">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Opening Hours</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-5 text-white/40">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10">
                  <Clock className="w-5 h-5 text-[#ffcc00]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-30">Schedule</p>
                  <p className="text-white font-black text-lg tracking-tighter uppercase">{settings.openingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#ff3c38]/20 transition-all duration-500">
                  <Phone className="w-5 h-5 text-[#ff3c38]" />
                </div>
                <p className="text-white font-black text-lg tracking-tighter uppercase">{settings.contactPhone}</p>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#ff3c38]/20 transition-all duration-500">
                  <Mail className="w-5 h-5 text-[#ff3c38]" />
                </div>
                <p className="text-white font-black text-lg tracking-tighter uppercase">{settings.contactEmail}</p>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#ff3c38]/20 transition-all duration-500 shrink-0">
                  <MapPin className="w-5 h-5 text-[#ff3c38]" />
                </div>
                <p className="text-white font-black text-lg tracking-tighter uppercase leading-tight">{settings.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {settings.restaurantName.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <Link to="/admin" className="text-white/10 hover:text-white/40 transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
