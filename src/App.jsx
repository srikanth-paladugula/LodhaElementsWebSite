import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import QuotePage from './pages/QuotePage'
import QuoteBuilderPage from './pages/QuoteBuilderPage'
import { useScrollReveal } from './hooks/useScrollReveal'

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
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/quote"        element={<QuotePage />} />
          <Route path="/quote-builder" element={<QuoteBuilderPage />} />
          {/* Catch-all: redirect unknown routes back to Home */}
          <Route path="*"             element={<HomePage />} />
        </Routes>
      </main>
      {!isBuilder && <Footer />}
    </div>
  )
}
