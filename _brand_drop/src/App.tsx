import { motion } from 'motion/react';
import { Logo } from './components/Logo';
import { Emblem } from './components/Emblem';
import { Leaf, ShieldCheck, Recycle, MapPin, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <Logo className="h-12 w-auto" />
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-emerald-600 transition-colors">Our Story</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Community</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Impact</a>
        </div>
        <button className="bg-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95">
          Join the Movement
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-8 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Users className="w-4 h-4" />
              Inclusive by Design
            </div>
            <h1 className="text-7xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-10">
              Healing <br />
              <span className="text-emerald-500">Together.</span> <br />
              Mending <br />
              <span className="text-blue-500">Forever.</span>
            </h1>
            <p className="text-2xl text-gray-500 max-w-lg mb-12 leading-relaxed font-medium">
              A vibrant, community-powered platform where every voice matters and every hand helps mend our planet.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-emerald-500 transition-colors shadow-xl shadow-gray-200">
                Report Now <ArrowRight className="w-6 h-6" />
              </button>
              <button className="flex items-center gap-3 border-4 border-gray-900 px-10 py-5 rounded-3xl font-black text-lg hover:bg-gray-900 hover:text-white transition-all">
                The Map
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            {/* Vibrant Background Blobs */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 bg-white p-12 rounded-[5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50">
              <Emblem className="w-full h-auto drop-shadow-2xl" />
            </div>
            
            {/* Community Avatars */}
            <div className="absolute -right-10 bottom-20 flex -space-x-4 z-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                +2k
              </div>
            </div>
          </motion.div>
        </section>

        {/* Community Inclusion Section */}
        <section className="bg-gray-50 py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-5xl font-black tracking-tight mb-6">Built for Everyone</h2>
              <p className="text-xl text-gray-500">Inclusion isn't just a feature—it's our foundation. We believe a cleaner world starts with a connected community.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">Diverse Voices</h3>
                <p className="text-gray-500 leading-relaxed">Our platform supports 40+ languages and accessibility features to ensure everyone can contribute.</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-8">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">Shared Purpose</h3>
                <p className="text-gray-500 leading-relaxed">Join local "Mend Circles" to meet neighbors and tackle environmental challenges together.</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-8">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">Vibrant Future</h3>
                <p className="text-gray-500 leading-relaxed">We celebrate every small win with community rewards and local recognition programs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-20 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
            <Logo className="h-16 w-auto" />
            <div className="flex gap-12 text-sm font-black uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Safety</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Press</a>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="text-sm text-gray-400 font-medium">
              © 2026 Earthmender. Mending the world, together.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Add missing icons to imports
import { Users, Heart, Sparkles } from 'lucide-react';
