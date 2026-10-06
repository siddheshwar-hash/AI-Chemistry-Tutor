import { useEffect, useMemo, useState } from 'react'
import {
  Atom,
  BookOpen,
  Database,
  FlaskConical,
  Flame,
  Rotate3D,
  Search,
  Sparkles,
  Volume2,
  LogOut,
} from 'lucide-react'

import { supabase } from './lib/supabase'
import Atom3D from './components/Atom3D'
import PeriodicTable from './components/PeriodicTable'
import FusionLab from './pages/FusionLab'
import FormulaExplorer from './pages/FormulaExplorer'
import Login from './pages/Login'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState('home')

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (mounted) {
        setSession(currentSession)
        setAuthLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession)
          setAuthLoading(false)
        }
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogin(loginSession) {
    setSession(loginSession)
    setCurrentPage('home')
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function handleLogout() {
    const { error: logoutError } =
      await supabase.auth.signOut()

    if (logoutError) {
      console.error(logoutError)
      return
    }

    setSession(null)
    setCurrentPage('home')
  }

  // --------------------------------------------------
  // LOAD ELEMENTS
  // --------------------------------------------------

  useEffect(() => {
    if (!session) {
      return
    }

    async function loadElements() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } =
        await supabase
          .from('elements')
          .select(
            'atomic_number, symbol, name, atomic_mass, category',
          )
          .order('atomic_number', {
            ascending: true,
          })

      if (fetchError) {
        console.error(fetchError)
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setElements(data || [])

      if (data && data.length > 0) {
        setSelectedElement(data[0])
      }

      setLoading(false)
    }

    loadElements()
  }, [session])

  // --------------------------------------------------
  // CATEGORY FILTER
  // --------------------------------------------------

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        elements
          .map((element) => element.category)
          .filter(Boolean),
      ),
    ]

    return ['All', ...uniqueCategories]
  }, [elements])

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredElements = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return elements.filter((element) => {
      const matchesSearch =
        !search ||
        element.name.toLowerCase().includes(search) ||
        element.symbol.toLowerCase().includes(search) ||
        String(element.atomic_number).includes(search)

      const matchesCategory =
        selectedCategory === 'All' ||
        element.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [elements, searchTerm, selectedCategory])

  // --------------------------------------------------
  // ELEMENT SELECTION
  // --------------------------------------------------

  function handleElementSelect(element) {
    setSelectedElement(element)

    setTimeout(() => {
      document
        .getElementById('atom-lab')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }, 50)
  }

  // --------------------------------------------------
  // VOICE EXPLANATION
  // --------------------------------------------------

  function speakElement() {
    if (!selectedElement) {
      alert('Please select an element first.')
      return
    }

    if (!('speechSynthesis' in window)) {
      alert(
        'Speech is not supported in this browser. Please use Microsoft Edge or Google Chrome.',
      )
      return
    }

    const speechSynthesis = window.speechSynthesis

    speechSynthesis.cancel()

    const message = `This is ${selectedElement.name}. Its chemical symbol is ${selectedElement.symbol}. Its atomic number is ${selectedElement.atomic_number}. Its atomic mass is approximately ${selectedElement.atomic_mass}. It belongs to the ${selectedElement.category} category.`

    const speak = () => {
      const utterance =
        new SpeechSynthesisUtterance(message)

      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      const voices = speechSynthesis.getVoices()

      const indianEnglishVoice =
        voices.find(
          (voice) =>
            voice.lang?.toLowerCase() === 'en-in',
        ) ||
        voices.find((voice) =>
          voice.name?.toLowerCase().includes('india'),
        ) ||
        voices.find(
          (voice) =>
            voice.lang?.toLowerCase().startsWith('en'),
        )

      if (indianEnglishVoice) {
        utterance.voice = indianEnglishVoice
        utterance.lang = indianEnglishVoice.lang
      } else {
        utterance.lang = 'en-IN'
      }

      utterance.onstart = () => {
        console.log(
          'Speech started:',
          selectedElement.name,
        )
      }

      utterance.onend = () => {
        console.log('Speech finished')
      }

      utterance.onerror = (event) => {
        console.error('Speech error:', event)

        const errorMessage =
          event?.error || 'Unknown speech synthesis error'

        alert(`Speech Error: ${errorMessage}`)
      }

      speechSynthesis.speak(utterance)
    }

    const voices = speechSynthesis.getVoices()

    if (voices.length > 0) {
      speak()
      return
    }

    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.onvoiceschanged = null
      speak()
    }

    setTimeout(() => {
      if (!speechSynthesis.speaking) {
        speechSynthesis.onvoiceschanged = null
        speak()
      }
    }, 500)
  }

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  function scrollToTable() {
    document
      .getElementById('periodic-table')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  function scrollToAtomLab() {
    document
      .getElementById('atom-lab')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }

  function openFusionLab() {
    setCurrentPage('fusion')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function openFormulaExplorer() {
    setCurrentPage('formula')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function openHome() {
    setCurrentPage('home')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // --------------------------------------------------
  // AUTH LOADING SCREEN
  // --------------------------------------------------

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-icon">
          <Atom size={42} />
        </div>

        <h2>AI Chemistry Tutor</h2>

        <p>Preparing your Chemistry Lab...</p>

        <div className="auth-loading-spinner" />
      </div>
    )
  }

  // --------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  // --------------------------------------------------
  // SPECIAL PAGES
  // --------------------------------------------------

  if (currentPage === 'fusion') {
    return (
      <FusionLab
        elements={elements}
        onBack={openHome}
      />
    )
  }

  if (currentPage === 'formula') {
    return (
      <FormulaExplorer
        onBack={openHome}
      />
    )
  }

  // --------------------------------------------------
  // MAIN CHEMISTRY DASHBOARD
  // --------------------------------------------------

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={22} />
          </div>

          <div>
            <h1>AI Chemistry Tutor</h1>
            <span>
              Interactive Chemistry Learning
            </span>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="fusion-nav-button"
            onClick={openFormulaExplorer}
          >
            <FlaskConical size={17} />
            Formula Explorer
          </button>

          <button
            type="button"
            className="fusion-nav-button"
            onClick={openFusionLab}
          >
            <Flame size={17} />
            Fusion Laboratory
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={17} />
            Logout
          </button>

          <div className="topbar-status">
            <span className="status-dot" />
            Learning Lab Online
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-kicker">
              <Sparkles size={15} />
              NEXT-GENERATION CHEMISTRY
            </span>

            <h2>
              Understand Chemistry
              <br />
              <span>Visually.</span>
            </h2>

            <p>
              Explore elements, atomic structures,
              chemical properties and molecular
              interactions through an interactive
              learning environment.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={scrollToTable}
              >
                <BookOpen size={18} />
                Explore Elements
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={scrollToAtomLab}
              >
                <Rotate3D size={18} />
                Open 3D Lab
              </button>

              <button
                type="button"
                className="fusion-hero-button"
                onClick={openFormulaExplorer}
              >
                <FlaskConical size={18} />
                Formula Explorer
              </button>

              <button
                type="button"
                className="fusion-hero-button"
                onClick={openFusionLab}
              >
                <Flame size={18} />
                Fusion Laboratory
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />

            <div className="hero-atom">
              <Atom
                size={82}
                strokeWidth={1.1}
              />
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Atom size={20} />
            </div>

            <div>
              <strong>{elements.length}</strong>
              <span>Elements Loaded</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Database size={20} />
            </div>

            <div>
              <strong>
                {error ? 'Offline' : 'Connected'}
              </strong>
              <span>Supabase Database</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Rotate3D size={20} />
            </div>

            <div>
              <strong>3D</strong>
              <span>Atomic Visualization</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FlaskConical size={20} />
            </div>

            <div>
              <strong>Formula</strong>
              <span>Composition Explorer</span>
            </div>
          </div>
        </section>

        <section
          id="periodic-table"
          className="dashboard-section"
        >
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                CHEMICAL ELEMENTS
              </span>

              <h2>Explore the Elements</h2>

              <p>
                Search the database or select an
                element directly from the periodic
                table.
              </p>
            </div>
          </div>

          <div className="search-panel">
            <div className="search-box">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search by element name, symbol or atomic number..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              Loading chemical elements...
            </div>
          ) : error ? (
            <div className="error-state">
              <strong>
                Unable to load elements
              </strong>

              <span>{error}</span>
            </div>
          ) : (
            <>
              <div className="element-results">
                <span>
                  Showing{' '}
                  <strong>
                    {filteredElements.length}
                  </strong>{' '}
                  of {elements.length} elements
                </span>
              </div>

              <div className="element-mini-grid">
                {filteredElements.map((element) => (
                  <button
                    type="button"
                    key={element.atomic_number}
                    className={
                      selectedElement?.atomic_number ===
                      element.atomic_number
                        ? 'mini-element active'
                        : 'mini-element'
                    }
                    onClick={() =>
                      handleElementSelect(element)
                    }
                  >
                    <small>
                      {element.atomic_number}
                    </small>

                    <strong>
                      {element.symbol}
                    </strong>

                    <span>{element.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {!loading &&
          !error &&
          elements.length > 0 && (
            <PeriodicTable
              elements={elements}
              selectedElement={selectedElement}
              onSelect={handleElementSelect}
            />
          )}

        <section
          id="atom-lab"
          className="atom-lab"
        >
          <div className="atom-lab-heading">
            <div>
              <span className="section-kicker">
                INTERACTIVE 3D LAB
              </span>

              <h2>
                Atomic Structure Explorer
              </h2>

              <p>
                Rotate the atom and explore its
                electron shells.
              </p>
            </div>

            <div className="lab-badge">
              <Rotate3D size={16} />
              Interactive
            </div>
          </div>

          <div className="atom-lab-card">
            <div className="atom-lab-view">
              <Atom3D
                element={selectedElement}
              />
            </div>

            <div className="atom-lab-info">
              {selectedElement ? (
                <>
                  <span className="lab-label">
                    SELECTED ELEMENT
                  </span>

                  <div className="lab-symbol">
                    {selectedElement.symbol}
                  </div>

                  <h3>
                    {selectedElement.name}
                  </h3>

                  <div className="lab-details">
                    <div>
                      <span>
                        Atomic Number
                      </span>

                      <strong>
                        {selectedElement.atomic_number}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Atomic Mass
                      </span>

                      <strong>
                        {selectedElement.atomic_mass}
                      </strong>
                    </div>

                    <div>
                      <span>Category</span>

                      <strong>
                        {selectedElement.category}
                      </strong>
                    </div>
                  </div>

                  <div className="voice-controls">
                    <label>
                      <Volume2 size={16} />
                      Voice Explanation
                    </label>

                    <span className="voice-language">
                      English (India)
                    </span>
                  </div>

                  <button
                    type="button"
                    className="lab-voice-button"
                    onClick={speakElement}
                  >
                    <Volume2 size={18} />
                    Explain Element
                  </button>

                  <div className="lab-instructions">
                    <Rotate3D size={17} />

                    <span>
                      Drag to rotate the atom.
                      <br />
                      Scroll to zoom.
                    </span>
                  </div>
                </>
              ) : (
                <div className="lab-empty">
                  Select an element to begin.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>AI Chemistry Tutor</span>

        <span>
          Interactive Chemistry Learning Platform
        </span>
      </footer>
    </div>
  )
}