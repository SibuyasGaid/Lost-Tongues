import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Translate from './pages/Translate';
import HowItWorks from './pages/HowItWorks';
import Languages from './pages/Languages';
import Train from './pages/Train';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="grain-overlay min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/train" element={<Train />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
