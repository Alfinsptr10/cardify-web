import Link from "next/link";
import { Gift, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative isolate w-full bg-[#1C1917] text-stone-400 py-12 border-t border-stone-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1C1917]">
                <Gift size={16} className="text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-white italic font-playfair">Cardify.</span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              The modern way to celebrate. Creating digital moments that last forever.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-stone-500 font-medium">
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/showcase" className="hover:text-white transition-colors">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-stone-500 font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://instagram.com/alfinnsptr"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#E1306C] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-[#E1306C] transition-colors">
                  <Instagram size={16} />
                </div>
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href="https://wa.me/6289501847804"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#25D366] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-[#25D366] transition-colors">
                  <MessageCircle size={16} />
                </div>
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500 font-medium">
            © {new Date().getFullYear()} Cardify Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-stone-500 font-bold">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}