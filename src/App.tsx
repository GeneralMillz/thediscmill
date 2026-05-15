import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { Gear } from './pages/Gear';
import SplashScreen from './components/SplashScreen';
// ── New pages ─────────────────────────────────────────────────────────────────
import { BestDiscsPage } from './pages/BestDiscsPage';
import { CompareDiscs } from './pages/CompareDiscs';
import { SimilarDiscsPage } from './pages/SimilarDiscsPage';
import { Recommend } from './pages/Recommend';
import { Glossary } from './pages/Glossary';
import { Releases } from './pages/Releases';
import { Deals } from './pages/Deals';
import { StateHub } from './pages/StateHub';
import { Footer } from './components/Footer';
import { OutboundAnalytics } from './pages/admin/OutboundAnalytics';
import Partners from './pages/Partners';
import DyersIndex from './pages/dyer/DyersIndex';
import DyerDetail from './pages/dyer/DyerDetail';

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => (localStorage.getItem('theme') as 'dark' | 'light') || 'dark');

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <div className="min-h-dvh transition-colors duration-300">
        {showSplash && <SplashScreen duration={5000} onComplete={() => setShowSplash(false)} />}
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        {/* Mobile: extra bottom clearance for the bottom nav + safe area */}
        <main className="pb-[calc(56px+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gear" element={<Gear />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course-finder" element={<CourseFinder />} />
            <Route path="/players" element={<Players />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            <Route path="/analyzer" element={<ThrowAnalyzer />} />
            <Route path="/discs" element={<Discs />} />
            <Route path="/disc/:id" element={<DiscDetail />} />
            <Route path="/disc/:brandSlug/:discSlug" element={<DiscDetail />} />
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
            {/* ── High-intent SEO landing pages ─────────────────────────── */}
            <Route path="/best/:slug" element={<BestDiscsPage />} />
            {/* ── Tools ─────────────────────────────────────────────────── */}
            <Route path="/compare/:slug" element={<CompareDiscs />} />
            <Route path="/similar/:slug" element={<SimilarDiscsPage />} />
            <Route path="/recommend" element={<Recommend />} />
            {/* ── Content ───────────────────────────────────────────────── */}
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/news" element={<Navigate to="/blog" replace />} />
            {/* ── State hubs ────────────────────────────────────────────── */}
            <Route path="/michigan"   element={<StateHub />} />
            <Route path="/texas"      element={<StateHub />} />
            <Route path="/california" element={<StateHub />} />
            <Route path="/ohio"       element={<StateHub />} />
            <Route path="/florida"    element={<StateHub />} />
            {/* ── Manufacturer vanity redirects (avoid duplicate content) ── */}
            <Route path="/innova"        element={<Navigate to="/manufacturer/innova" replace />} />
            <Route path="/discraft"      element={<Navigate to="/manufacturer/discraft" replace />} />
            <Route path="/mvp"           element={<Navigate to="/manufacturer/mvp" replace />} />
            <Route path="/axiom"         element={<Navigate to="/manufacturer/axiom" replace />} />
            <Route path="/kastaplast"    element={<Navigate to="/manufacturer/kastaplast" replace />} />
            <Route path="/dynamic-discs" element={<Navigate to="/manufacturer/dynamic-discs" replace />} />
            <Route path="/discmania"     element={<Navigate to="/manufacturer/discmania" replace />} />
            <Route path="/latitude-64"   element={<Navigate to="/manufacturer/latitude-64" replace />} />
            {/* ── Admin / Internal ────────────────────────────────────── */}
            <Route path="/admin/outbound-analytics" element={<OutboundAnalytics />} />
            <Route path="/partners" element={<Partners />} />
            {/* ── Creators / Dyers ────────────────────────────────────── */}
            <Route path="/dyers" element={<DyersIndex />} />
            <Route path="/dyer/:slug" element={<DyerDetail />} />
            {/* ── Fallback ──────────────────────────────────────────────── */}
            <Route path="*" element={<div className="pt-20 text-center text-gray-500 dark:text-gray-400 py-24">Page coming soon!</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
