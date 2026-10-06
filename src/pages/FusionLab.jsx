import { useState } from 'react'
import {
  ArrowLeft,
  Atom,
  Flame,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function FusionLab({ elements, onBack }) {
  const [firstElement, setFirstElement] = useState(null)
  const [secondElement, setSecondElement] = useState(null)
  const [fusionStarted, setFusionStarted] = useState(false)

  function handleFusion() {
    if (!firstElement || !secondElement) {
      return
    }

    setFusionStarted(false)

    setTimeout(() => {
      setFusionStarted(true)
    }, 100)
  }

  function resetFusion() {
    setFirstElement(null)
    setSecondElement(null)
    setFusionStarted(false)
  }

  return (
    <div className="fusion-page">
      <header className="fusion-header">
        <button
          type="button"
          className="fusion-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Chemistry Lab
        </button>

        <div className="fusion-title">
          <div className="fusion-title-icon">
            <Flame size={22} />
          </div>

          <div>
            <span>INTERACTIVE LABORATORY</span>
            <h1>Fusion Laboratory</h1>
          </div>
        </div>
      </header>

      <main className="fusion-content">
        <section className="fusion-hero">
          <div>
            <span className="section-kicker">
              NUCLEAR &amp; CHEMICAL EXPLORATION
            </span>

            <h2>
              Explore How
              <br />
              <strong>Atoms Combine.</strong>
            </h2>

            <p>
              Select two elements and explore a visual
              simulation of how atomic systems can interact.
              Designed for 11th and 12th standard chemistry
              learning.
            </p>
          </div>

          <div className="fusion-hero-icon">
            <Atom size={105} strokeWidth={0.8} />
            <Sparkles className="fusion-spark-one" size={22} />
            <Sparkles className="fusion-spark-two" size={17} />
          </div>
        </section>

        <section className="fusion-selector-section">
          <div className="fusion-section-heading">
            <span className="section-kicker">
              STEP 01
            </span>

            <h2>Select Your Elements</h2>

            <p>
              Choose two elements for the interactive
              fusion experiment.
            </p>
          </div>

          <div className="fusion-selectors">
            <div className="fusion-selector-card">
              <div className="fusion-card-number">A</div>

              <span>FIRST ELEMENT</span>

              <select
                value={
                  firstElement?.atomic_number || ''
                }
                onChange={(event) => {
                  const selected = elements.find(
                    (element) =>
                      element.atomic_number ===
                      Number(event.target.value),
                  )

                  setFirstElement(selected || null)
                  setFusionStarted(false)
                }}
              >
                <option value="">
                  Select first element
                </option>

                {elements.map((element) => (
                  <option
                    key={element.atomic_number}
                    value={element.atomic_number}
                  >
                    {element.atomic_number}.{' '}
                    {element.name} ({element.symbol})
                  </option>
                ))}
              </select>

              {firstElement && (
                <div className="selected-element-preview">
                  <strong>
                    {firstElement.symbol}
                  </strong>

                  <div>
                    <b>{firstElement.name}</b>
                    <small>
                      Atomic Number:{' '}
                      {firstElement.atomic_number}
                    </small>
                  </div>
                </div>
              )}
            </div>

            <div className="fusion-plus">
              <span>+</span>
            </div>

            <div className="fusion-selector-card">
              <div className="fusion-card-number">B</div>

              <span>SECOND ELEMENT</span>

              <select
                value={
                  secondElement?.atomic_number || ''
                }
                onChange={(event) => {
                  const selected = elements.find(
                    (element) =>
                      element.atomic_number ===
                      Number(event.target.value),
                  )

                  setSecondElement(selected || null)
                  setFusionStarted(false)
                }}
              >
                <option value="">
                  Select second element
                </option>

                {elements.map((element) => (
                  <option
                    key={element.atomic_number}
                    value={element.atomic_number}
                  >
                    {element.atomic_number}.{' '}
                    {element.name} ({element.symbol})
                  </option>
                ))}
              </select>

              {secondElement && (
                <div className="selected-element-preview">
                  <strong>
                    {secondElement.symbol}
                  </strong>

                  <div>
                    <b>{secondElement.name}</b>
                    <small>
                      Atomic Number:{' '}
                      {secondElement.atomic_number}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="fusion-actions">
            <button
              type="button"
              className="start-fusion-button"
              onClick={handleFusion}
              disabled={
                !firstElement || !secondElement
              }
            >
              <Zap size={19} />
              Start Fusion Experiment
            </button>

            {(firstElement || secondElement) && (
              <button
                type="button"
                className="reset-fusion-button"
                onClick={resetFusion}
              >
                Reset
              </button>
            )}
          </div>
        </section>

        <section className="fusion-stage-section">
          <div className="fusion-section-heading">
            <span className="section-kicker">
              STEP 02
            </span>

            <h2>Fusion Chamber</h2>

            <p>
              Watch the selected atomic systems interact.
            </p>
          </div>

          <div
            className={
              fusionStarted
                ? 'fusion-chamber active'
                : 'fusion-chamber'
            }
          >
            <div className="fusion-stars" />

            <div className="fusion-atom first">
              {firstElement ? (
                <>
                  <strong>
                    {firstElement.symbol}
                  </strong>

                  <small>
                    {firstElement.name}
                  </small>
                </>
              ) : (
                <Atom size={60} />
              )}
            </div>

            <div className="fusion-energy">
              {fusionStarted ? (
                <>
                  <Zap size={35} />
                  <span>FUSION</span>
                </>
              ) : (
                <span>+</span>
              )}
            </div>

            <div className="fusion-atom second">
              {secondElement ? (
                <>
                  <strong>
                    {secondElement.symbol}
                  </strong>

                  <small>
                    {secondElement.name}
                  </small>
                </>
              ) : (
                <Atom size={60} />
              )}
            </div>

            {fusionStarted && (
              <div className="fusion-result">
                <Sparkles size={22} />

                <span>INTERACTION COMPLETE</span>

                <strong>
                  {firstElement?.symbol} +{' '}
                  {secondElement?.symbol}
                </strong>

                <small>
                  Educational simulation result
                </small>
              </div>
            )}
          </div>
        </section>

        <section className="fusion-info-grid">
          <div className="fusion-info-card">
            <div className="fusion-info-icon">
              <Atom size={20} />
            </div>

            <span>ATOMIC STRUCTURE</span>

            <h3>Understand the Atoms</h3>

            <p>
              Compare atomic numbers, symbols and basic
              properties of the selected elements.
            </p>
          </div>

          <div className="fusion-info-card">
            <div className="fusion-info-icon">
              <Zap size={20} />
            </div>

            <span>ENERGY</span>

            <h3>Explore Energy Changes</h3>

            <p>
              Learn how interactions between atomic systems
              can involve energy transfer.
            </p>
          </div>

          <div className="fusion-info-card">
            <div className="fusion-info-icon">
              <Flame size={20} />
            </div>

            <span>LEARNING MODE</span>

            <h3>Step-by-Step Explanation</h3>

            <p>
              Future versions can explain the reaction using
              animations, formulas and AI-generated lessons.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}