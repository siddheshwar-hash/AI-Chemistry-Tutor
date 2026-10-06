import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Atom,
  Beaker,
  Calculator,
  FlaskConical,
  Info,
  Sparkles,
} from 'lucide-react'
import './FormulaExplorer.css'

const elementMap = {
  H: { name: 'Hydrogen', number: 1, mass: 1.008 },
  He: { name: 'Helium', number: 2, mass: 4.003 },
  Li: { name: 'Lithium', number: 3, mass: 6.94 },
  Be: { name: 'Beryllium', number: 4, mass: 9.012 },
  B: { name: 'Boron', number: 5, mass: 10.81 },
  C: { name: 'Carbon', number: 6, mass: 12.011 },
  N: { name: 'Nitrogen', number: 7, mass: 14.007 },
  O: { name: 'Oxygen', number: 8, mass: 15.999 },
  F: { name: 'Fluorine', number: 9, mass: 18.998 },
  Ne: { name: 'Neon', number: 10, mass: 20.18 },
  Na: { name: 'Sodium', number: 11, mass: 22.99 },
  Mg: { name: 'Magnesium', number: 12, mass: 24.305 },
  Al: { name: 'Aluminium', number: 13, mass: 26.982 },
  Si: { name: 'Silicon', number: 14, mass: 28.085 },
  P: { name: 'Phosphorus', number: 15, mass: 30.974 },
  S: { name: 'Sulfur', number: 16, mass: 32.06 },
  Cl: { name: 'Chlorine', number: 17, mass: 35.45 },
  Ar: { name: 'Argon', number: 18, mass: 39.948 },
  K: { name: 'Potassium', number: 19, mass: 39.098 },
  Ca: { name: 'Calcium', number: 20, mass: 40.078 },
  Fe: { name: 'Iron', number: 26, mass: 55.845 },
  Cu: { name: 'Copper', number: 29, mass: 63.546 },
  Zn: { name: 'Zinc', number: 30, mass: 65.38 },
  Ag: { name: 'Silver', number: 47, mass: 107.868 },
  I: { name: 'Iodine', number: 53, mass: 126.904 },
  Ba: { name: 'Barium', number: 56, mass: 137.327 },
  Au: { name: 'Gold', number: 79, mass: 196.967 },
  Hg: { name: 'Mercury', number: 80, mass: 200.592 },
  Pb: { name: 'Lead', number: 82, mass: 207.2 },
}

const examples = [
  'H2O',
  'CO2',
  'NaCl',
  'H2SO4',
  'CaCO3',
  'NH3',
]

function parseFormula(formula) {
  const cleanFormula = formula
    .replace(/\s+/g, '')
    .trim()

  if (!cleanFormula) {
    return {
      success: false,
      error: 'Enter a chemical formula.',
    }
  }

  const matches = [
    ...cleanFormula.matchAll(
      /([A-Z][a-z]?)(\d*)/g,
    ),
  ]

  if (
    matches.length === 0 ||
    matches.map((match) => match[0]).join('') !== cleanFormula
  ) {
    return {
      success: false,
      error:
        'Invalid formula. Use standard chemical notation such as H2O or CO2.',
    }
  }

  const counts = {}

  for (const match of matches) {
    const symbol = match[1]
    const count = match[2] ? Number(match[2]) : 1

    if (!elementMap[symbol]) {
      return {
        success: false,
        error: `${symbol} is not available in the formula database yet.`,
      }
    }

    if (count <= 0) {
      return {
        success: false,
        error: 'Atom counts must be greater than zero.',
      }
    }

    counts[symbol] = (counts[symbol] || 0) + count
  }

  return {
    success: true,
    counts,
  }
}

function formatFormula(formula) {
  return formula.replace(
    /(\d+)/g,
    (_, number) => {
      const subscripts = {
        0: '₀',
        1: '₁',
        2: '₂',
        3: '₃',
        4: '₄',
        5: '₅',
        6: '₆',
        7: '₇',
        8: '₈',
        9: '₉',
      }

      return number
        .split('')
        .map((digit) => subscripts[digit])
        .join('')
    },
  )
}

export default function FormulaExplorer({ onBack }) {
  const [formula, setFormula] = useState('H2O')
  const [submittedFormula, setSubmittedFormula] =
    useState('H2O')

  const analysis = useMemo(
    () => parseFormula(submittedFormula),
    [submittedFormula],
  )

  const analysisRows = useMemo(() => {
    if (!analysis.success) {
      return []
    }

    return Object.entries(analysis.counts).map(
      ([symbol, count]) => ({
        symbol,
        count,
        ...elementMap[symbol],
      }),
    )
  }, [analysis])

  const totalAtoms = analysisRows.reduce(
    (total, item) => total + item.count,
    0,
  )

  const molecularMass = analysisRows.reduce(
    (total, item) =>
      total + item.mass * item.count,
    0,
  )

  function analyzeFormula(event) {
    event.preventDefault()
    setSubmittedFormula(formula)
  }

  function selectExample(example) {
    setFormula(example)
    setSubmittedFormula(example)
  }

  return (
    <div className="formula-page">
      <header className="formula-header">
        <button
          type="button"
          className="formula-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Chemistry Lab
        </button>

        <div className="formula-title">
          <div className="formula-title-icon">
            <Beaker size={22} />
          </div>

          <div>
            <span>CHEMICAL ANALYSIS LAB</span>
            <h1>Formula Explorer</h1>
          </div>
        </div>
      </header>

      <main className="formula-content">
        <section className="formula-hero">
          <div>
            <span className="section-kicker">
              FORMULA → STRUCTURE → UNDERSTANDING
            </span>

            <h2>
              Decode Any
              <br />
              <strong>Chemical Formula.</strong>
            </h2>

            <p>
              Enter a chemical formula and instantly
              discover its elements, atom counts,
              molecular composition and approximate
              molecular mass.
            </p>
          </div>

          <div className="formula-hero-visual">
            <div className="formula-orbit one" />
            <div className="formula-orbit two" />
            <Atom size={95} strokeWidth={0.8} />
          </div>
        </section>

        <section className="formula-input-section">
          <div className="formula-section-heading">
            <span className="section-kicker">
              STEP 01
            </span>

            <h2>Enter a Chemical Formula</h2>

            <p>
              Try H₂O, CO₂, NaCl, H₂SO₄ or another
              standard formula.
            </p>
          </div>

          <form
            className="formula-input-card"
            onSubmit={analyzeFormula}
          >
            <div className="formula-input-wrapper">
              <FlaskConical size={21} />

              <input
                type="text"
                value={formula}
                onChange={(event) =>
                  setFormula(event.target.value)
                }
                placeholder="Enter formula e.g. H2O"
                aria-label="Chemical formula"
              />
            </div>

            <button
              type="submit"
              className="formula-analyze-button"
            >
              <Calculator size={18} />
              Analyze Formula
            </button>
          </form>

          <div className="formula-examples">
            <span>Quick examples:</span>

            {examples.map((example) => (
              <button
                type="button"
                key={example}
                onClick={() =>
                  selectExample(example)
                }
              >
                {formatFormula(example)}
              </button>
            ))}
          </div>
        </section>

        <section className="formula-result-section">
          <div className="formula-section-heading">
            <span className="section-kicker">
              STEP 02
            </span>

            <h2>Formula Breakdown</h2>

            <p>
              Here's what your chemical formula
              contains.
            </p>
          </div>

          {!analysis.success ? (
            <div className="formula-error-card">
              <Info size={22} />
              <div>
                <strong>Unable to analyze formula</strong>
                <span>{analysis.error}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="formula-result-hero">
                <div>
                  <span>FORMULA</span>
                  <strong>
                    {formatFormula(submittedFormula)}
                  </strong>
                </div>

                <div>
                  <span>TOTAL ATOMS</span>
                  <strong>{totalAtoms}</strong>
                </div>

                <div>
                  <span>MOLECULAR MASS</span>
                  <strong>
                    {molecularMass.toFixed(3)} u
                  </strong>
                </div>
              </div>

              <div className="formula-elements-grid">
                {analysisRows.map((item) => (
                  <div
                    className="formula-element-card"
                    key={item.symbol}
                  >
                    <div className="formula-element-symbol">
                      {item.symbol}
                    </div>

                    <div className="formula-element-info">
                      <span>{item.name}</span>

                      <strong>
                        {item.count}{' '}
                        {item.count === 1
                          ? 'atom'
                          : 'atoms'}
                      </strong>

                      <small>
                        Atomic number {item.number}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {analysis.success && (
          <section className="formula-learning-section">
            <div className="formula-section-heading">
              <span className="section-kicker">
                STEP 03
              </span>

              <h2>Understand the Formula</h2>

              <p>
                A simple explanation for 11th and
                12th standard chemistry students.
              </p>
            </div>

            <div className="formula-learning-grid">
              <div className="formula-learning-card">
                <div className="formula-learning-icon">
                  <Atom size={21} />
                </div>

                <span>ELEMENTS</span>

                <h3>
                  {analysisRows.length}{' '}
                  {analysisRows.length === 1
                    ? 'Element'
                    : 'Elements'}
                </h3>

                <p>
                  {analysisRows
                    .map(
                      (item) =>
                        `${item.name} (${item.symbol})`,
                    )
                    .join(', ')}
                  {' '}are present in this formula.
                </p>
              </div>

              <div className="formula-learning-card">
                <div className="formula-learning-icon">
                  <Calculator size={21} />
                </div>

                <span>COMPOSITION</span>

                <h3>
                  {totalAtoms} Total Atoms
                </h3>

                <p>
                  The formula represents a total of{' '}
                  <strong>{totalAtoms}</strong>{' '}
                  atoms in one formula unit or
                  molecule.
                </p>
              </div>

              <div className="formula-learning-card">
                <div className="formula-learning-icon">
                  <Sparkles size={21} />
                </div>

                <span>NEXT STEP</span>

                <h3>Bonding Analysis</h3>

                <p>
                  The next stage will identify likely
                  bonding patterns and explain how
                  these atoms are connected.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="formula-note">
          <Info size={18} />

          <p>
            <strong>Educational note:</strong> This
            first version focuses on formula parsing
            and composition. Chemical bonding,
            molecular geometry and reaction
            explanations will be added in the next
            layer.
          </p>
        </section>
      </main>
    </div>
  )
}