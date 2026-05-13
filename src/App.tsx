import React from 'react';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseFinder } from './pages/CourseFinder';
import { CourseDetail } from './pages/CourseDetail';
import { Players } from './pages/Players';
import { PlayerDetail } from './pages/PlayerDetail';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { LiveDataAudit } from './pages/LiveDataAudit';
import { ThrowAnalyzer } from './pages/ThrowAnalyzer';
import { DiscFinder } from './pages/DiscFinder';
import { Discs } from './pages/Discs';
import { RecommendedGear } from './pages/RecommendedGear';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { BagBuilder } from './pages/BagBuilder';
import { DiscReturn } from './pages/DiscReturn';
import { DiscReturnCreate } from './pages/DiscReturnCreate';
import { ReturnScan } from './pages/ReturnScan';
import { DiscDetail } from './pages/DiscDetail';
import { Manufacturers } from './pages/Manufacturers';
import { ManufacturerDetail } from './pages/ManufacturerDetail';

export default function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <div className="min-h-dvh transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        {/* Mobile: extra bottom clearance for the bottom nav + safe area */}
        <main className="pb-[calc(56px+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course-finder" element={<CourseFinder />} />
            <Route path="/players" element={<Players />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/audit" element={<LiveDataAudit />} />
            <Route path="/analyzer" element={<ThrowAnalyzer />} />
            <Route path="/discs" element={<Discs />} />
            <Route path="/disc/:id" element={<DiscDetail />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/manufacturer/:id" element={<ManufacturerDetail />} />
            <Route path="/disc-finder" element={<DiscFinder />} />
            <Route path="/disc-return" element={<DiscReturn />} />
            <Route path="/disc-return/create" element={<DiscReturnCreate />} />
            <Route path="/return" element={<ReturnScan />} />
            <Route path="/gear" element={<RecommendedGear />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/bag-builder" element={<BagBuilder />} />
            {/* Fallback routes for missing pages */}
            <Route path="*" element={<div className="pt-20 text-center">Page coming soon!</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
