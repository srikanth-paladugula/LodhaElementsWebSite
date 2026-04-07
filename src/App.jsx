import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { useScrollReveal } from './hooks/useScrollReveal'

const HomePage = lazy(() => import('./pages/HomePage'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const QuoteBuilderPage = lazy(() => import('./pages/QuoteBuilderPage'))

/* Scroll to top on route change */
function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/* Per-page scroll reveal re-init */
function RevealOnRoute() {
  const { pathname } = useLocation()
  useScrollReveal()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <RevealOnRoute />
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const { pathname } = useLocation()
  const isBuilder = pathname === '/quote-builder'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading…</div>}>
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/quote"        element={<QuotePage />} />
            <Route path="/quote-builder" element={<QuoteBuilderPage />} />
            {/* Catch-all: redirect unknown routes back to Home */}
            <Route path="*"             element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      {!isBuilder && <Footer />}
    </div>
  )
}
