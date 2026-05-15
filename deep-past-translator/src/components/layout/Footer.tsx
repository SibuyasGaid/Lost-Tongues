import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-near-black dark:bg-black text-warm-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-cinzel text-xl text-amber mb-3">DeepPast Translator</h3>
          <p className="text-sm text-warm-white/60">An educational platform making AI translation of ancient languages accessible to everyone.</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber mb-3">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-warm-white/70">
            <Link to="/translate" className="hover:text-amber transition-colors">Live Translator</Link>
            <Link to="/how-it-works" className="hover:text-amber transition-colors">How It Works</Link>
            <Link to="/languages" className="hover:text-amber transition-colors">Language Explorer</Link>
            <Link to="/train" className="hover:text-amber transition-colors">Train a Model</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-amber mb-3">Resources</h4>
          <div className="flex flex-col gap-2 text-sm text-warm-white/70">
            <a href="https://cdli.mpiwg-berlin.mpg.de/" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">CDLI Database</a>
            <a href="https://oracc.museum.upenn.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">ORACC Project</a>
            <a href="https://www.ebl.lmu.de/" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">eBL Dictionary</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-warm-white/10 text-center text-sm text-warm-white/40">
        Built by Charles Luis Gaid · Inspired by the Kaggle Deep Past Challenge
      </div>
    </footer>
  );
}
