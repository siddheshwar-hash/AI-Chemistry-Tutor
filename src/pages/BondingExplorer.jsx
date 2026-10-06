import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Atom,
  CircleDot,
  Info,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react'

const MOLECULES = [
  {
    id: 'h2o',
    formula: 'H₂O',
    name: 'Water',
    type: 'Covalent',
    bondOrder: 'Single bonds',
    bonds: 2,
    atoms: [
      { symbol: 'H', name: 'Hydrogen', count: 2 },
      { symbol: 'O', name: 'Oxygen', count: 1 },
    ],
    central: 'O',
    structure: ['H', 'O', 'H'],
    explanation:
      'Water contains two hydrogen atoms covalently bonded to one oxygen atom. Oxygen attracts the shared electrons more strongly, making the molecule polar.',
    concept:
      'Each hydrogen shares one electron with oxygen. Oxygen shares electrons with both hydrogen atoms to complete its outer shell.',
    geometry: 'Bent',
    polarity: 'Polar',
    electrons: 8,
  },
  {
    id: 'co2',
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    type: 'Covalent',
    bondOrder: 'Double bonds',
    bonds: 2,
    atoms: [
      { symbol: 'C', name: 'Carbon', count: 1 },
      { symbol: 'O', name: 'Oxygen', count: 2 },
    ],
    central: 'C',
    structure: ['O', 'C', 'O'],
    explanation:
      'Carbon dioxide has one carbon atom connected to two oxygen atoms through double covalent bonds.',
    concept:
      'Carbon shares two pairs of electrons with each oxygen atom. This creates two double bonds and gives the molecule a linear structure.',
    geometry: 'Linear',
    polarity: 'Non-polar overall',
    electrons: 16,
  },
  {
    id: 'o2',
    formula: 'O₂',
    name: 'Oxygen Molecule',
    type: 'Covalent',
    bondOrder: 'Double bond',
    bonds: 1,
    atoms: [
      { symbol: 'O', name: 'Oxygen', count: 2 },
    ],
    central: 'O',
    structure: ['O', 'O'],
    explanation:
      'Two oxygen atoms share two pairs of electrons, producing a double covalent bond.',
    concept:
      'Each oxygen contributes electrons to the shared region between the two atoms. Both atoms reach a stable outer electron configuration.',
    geometry: 'Linear',
    polarity: 'Non-polar',
    electrons: 12,
  },
  {
    id: 'n2',
    formula: 'N₂',
    name: 'Nitrogen Molecule',
    type: 'Covalent',
    bondOrder: 'Triple bond',
    bonds: 1,
    atoms: [
      { symbol: 'N', name: 'Nitrogen', count: 2 },
    ],
    central: 'N',
    structure: ['N', 'N'],
    explanation:
      'Two nitrogen atoms are connected by a very strong triple covalent bond.',
    concept:
      'The nitrogen atoms share three pairs of electrons. This produces one of the strongest common covalent bonds.',
    geometry: 'Linear',
    polarity: 'Non-polar',
    electrons: 10,
  },
  {
    id: 'ch4',
    formula: 'CH₄',
    name: 'Methane',
    type: 'Covalent',
    bondOrder: 'Single bonds',
    bonds: 4,
    atoms: [
      { symbol: 'C', name: 'Carbon', count: 1 },
      { symbol: 'H', name: 'Hydrogen', count: 4 },
    ],
    central: 'C',
    structure: ['H', 'C', 'H'],
    explanation:
      'Methane contains one carbon atom surrounded by four hydrogen atoms using four single covalent bonds.',
    concept:
      'Carbon has four valence electrons and shares one electron with each of four hydrogen atoms.',
    geometry: 'Tetrahedral',
    polarity: 'Non-polar overall',
    electrons: 10,
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    name: 'Ammonia',
    type: 'Covalent',
    bondOrder: 'Single bonds',
    bonds: 3,
    atoms: [
      { symbol: 'N', name: 'Nitrogen', count: 1 },
      { symbol: 'H', name: 'Hydrogen', count: 3 },
    ],
    central: 'N',
    structure: ['H', 'N', 'H'],
    explanation:
      'Ammonia contains nitrogen bonded to three hydrogen atoms and has one lone pair of electrons on nitrogen.',
    concept:
      'Nitrogen shares electrons with three hydrogen atoms and keeps one lone pair. The lone pair influences the molecular shape.',
    geometry: 'Trigonal pyramidal',
    polarity: 'Polar',
    electrons: 8,
  },
  {
    id: 'hcl',
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    type: 'Covalent',
    bondOrder: 'Single bond',
    bonds: 1,
    atoms: [
      { symbol: 'H', name: 'Hydrogen', count: 1 },
      { symbol: 'Cl', name: 'Chlorine', count: 1 },
    ],
    central: 'Cl',
    structure: ['H', 'Cl'],
    explanation:
      'Hydrogen chloride contains a single covalent bond between hydrogen and chlorine.',
    concept:
      'The shared electrons are attracted more strongly toward chlorine because chlorine has higher electronegativity.',
    geometry: 'Linear',
    polarity: 'Polar',
    electrons: 8,
  },
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Sodium Chloride',
    type: 'Ionic',
    bondOrder: 'Electron transfer',
    bonds: 1,
    atoms: [
      { symbol: 'Na', name: 'Sodium', count: 1 },
      { symbol: 'Cl', name: 'Chlorine', count: 1 },
    ],
    central: 'Na',
    structure: ['Na⁺', 'Cl⁻'],
    explanation:
      'Sodium chloride is formed when sodium transfers an electron to chlorine, producing oppositely charged ions.',
    concept:
      'Sodium loses one electron and becomes Na⁺. Chlorine gains that electron and becomes Cl⁻. Electrostatic attraction holds the ions together.',
    geometry: 'Ionic lattice',
    polarity: 'Ionic compound',
    electrons: 8,
  },
]

const atomColors = {
  H: '#f8fafc',
  O: '#fb7185',
  C: '#94a3b8',
  N: '#60a5fa',
  Cl: '#4ade80',
  Na: '#fbbf24',
}

function AtomBubble({ symbol, large = false }) {
  const color = atomColors[symbol.replace(/[⁺⁻]/g, '')] || '#a78bfa'

  return (
    <div
      style={{
        width: large ? 82 : 58,
        height: large ? 82 : 58,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: `2px solid ${color}`,
        background: `radial-gradient(circle at 35% 30%, ${color}55, #10172d 68%)`,
        boxShadow: `0 0 28px ${color}30`,
        color: '#ffffff',
        fontSize: large ? 25 : 18,
        fontWeight: 800,
      }}
    >
      {symbol}
    </div>
  )
}

function BondLine({ order = 1 }) {
  return (
    <div
      style={{
        minWidth: 65,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: order }).map((_, index) => (
        <div
          key={index}
          style={{
            width: 58,
            height: 3,
            borderRadius: 10,
            background:
              'linear-gradient(90deg, #6366f1, #22d3ee)',
            boxShadow: '0 0 12px rgba(99,102,241,0.65)',
          }}
        />
      ))}
    </div>
  )
}

function MoleculeVisual({ molecule }) {
  const structure = molecule.structure
  const isIonic = molecule.type === 'Ionic'

  let bondOrder = 1

  if (molecule.id === 'co2') {
    bondOrder = 2
  }

  if (molecule.id === 'n2') {
    bondOrder = 3
  }

  return (
    <div
      style={{
        minHeight: 300,
        borderRadius: 24,
        border: '1px solid rgba(148,163,184,0.15)',
        background:
          'radial-gradient(circle at center, rgba(99,102,241,0.12), rgba(8,13,29,0.95) 65%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#94a3b8',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
        }}
      >
        <Atom size={15} />
        MOLECULAR VIEW
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          flexWrap: 'wrap',
        }}
      >
        {structure.map((symbol, index) => (
          <div
            key={`${symbol}-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AtomBubble symbol={symbol} large />

            {index < structure.length - 1 && (
              isIonic ? (
                <div
                  style={{
                    width: 65,
                    height: 2,
                    margin: '0 6px',
                    background:
                      'repeating-linear-gradient(90deg, #fbbf24 0 7px, transparent 7px 13px)',
                  }}
                />
              ) : (
                <BondLine order={bondOrder} />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        border: '1px solid rgba(148,163,184,0.13)',
        background: 'rgba(15,23,42,0.72)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          color: '#818cf8',
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {icon}
        {label}
      </div>

      <strong
        style={{
          color: '#f8fafc',
          fontSize: 17,
        }}
      >
        {value}
      </strong>
    </div>
  )
}

export default function BondingExplorer({ onBack }) {
  const [selectedId, setSelectedId] = useState('h2o')

  const molecule = useMemo(
    () =>
      MOLECULES.find((item) => item.id === selectedId) ||
      MOLECULES[0],
    [selectedId],
  )

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 20% 0%, rgba(79,70,229,0.18), transparent 32%), radial-gradient(circle at 85% 15%, rgba(14,165,233,0.12), transparent 28%), #050914',
        color: '#f8fafc',
        padding: '28px 22px 60px',
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: '0 auto',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid rgba(148,163,184,0.2)',
            background: 'rgba(15,23,42,0.7)',
            color: '#cbd5e1',
            borderRadius: 12,
            padding: '10px 16px',
            cursor: 'pointer',
            marginBottom: 28,
          }}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <section
          style={{
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: 999,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#a5b4fc',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            <Sparkles size={14} />
            INTERACTIVE CHEMISTRY LAB
          </div>

          <h1
            style={{
              margin: '14px 0 10px',
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Bonding Explorer
          </h1>

          <p
            style={{
              maxWidth: 800,
              margin: 0,
              color: '#94a3b8',
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            Explore how atoms connect, share electrons, transfer
            electrons, and form chemical bonds.
          </p>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(210px, 280px) minmax(0, 1fr)',
            gap: 22,
            alignItems: 'start',
          }}
        >
          <aside
            style={{
              borderRadius: 24,
              border: '1px solid rgba(148,163,184,0.14)',
              background: 'rgba(8,13,29,0.82)',
              padding: 18,
              position: 'sticky',
              top: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                color: '#cbd5e1',
                fontWeight: 800,
                marginBottom: 15,
              }}
            >
              <Layers size={18} />
              Choose Molecule
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {MOLECULES.map((item) => {
                const active = item.id === molecule.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 14,
                      border: active
                        ? '1px solid rgba(99,102,241,0.7)'
                        : '1px solid rgba(148,163,184,0.1)',
                      background: active
                        ? 'rgba(99,102,241,0.16)'
                        : 'rgba(15,23,42,0.45)',
                      color: '#f8fafc',
                      padding: '12px 13px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                      }}
                    >
                      {item.formula}
                    </div>

                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      {item.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          <section
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 1.5fr) minmax(260px, 0.8fr)',
                gap: 20,
              }}
            >
              <div>
                <MoleculeVisual molecule={molecule} />
              </div>

              <div
                style={{
                  borderRadius: 24,
                  border:
                    '1px solid rgba(148,163,184,0.14)',
                  background:
                    'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(8,13,29,0.9))',
                  padding: 25,
                }}
              >
                <div
                  style={{
                    color: '#818cf8',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                  }}
                >
                  SELECTED COMPOUND
                </div>

                <div
                  style={{
                    fontSize: 54,
                    fontWeight: 900,
                    marginTop: 8,
                    letterSpacing: -2,
                  }}
                >
                  {molecule.formula}
                </div>

                <h2
                  style={{
                    margin: '4px 0 18px',
                    fontSize: 23,
                  }}
                >
                  {molecule.name}
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <StatCard
                    icon={<Zap size={15} />}
                    label="BOND TYPE"
                    value={molecule.type}
                  />

                  <StatCard
                    icon={<CircleDot size={15} />}
                    label="BONDING"
                    value={molecule.bondOrder}
                  />

                  <StatCard
                    icon={<Atom size={15} />}
                    label="GEOMETRY"
                    value={molecule.geometry}
                  />

                  <StatCard
                    icon={<Sparkles size={15} />}
                    label="POLARITY"
                    value={molecule.polarity}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: 20,
                marginTop: 20,
              }}
            >
              <article
                style={{
                  borderRadius: 22,
                  padding: 24,
                  border:
                    '1px solid rgba(148,163,184,0.13)',
                  background: 'rgba(15,23,42,0.68)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#a5b4fc',
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  <Info size={18} />
                  What is happening?
                </div>

                <p
                  style={{
                    margin: 0,
                    color: '#cbd5e1',
                    lineHeight: 1.75,
                  }}
                >
                  {molecule.explanation}
                </p>
              </article>

              <article
                style={{
                  borderRadius: 22,
                  padding: 24,
                  border:
                    '1px solid rgba(148,163,184,0.13)',
                  background: 'rgba(15,23,42,0.68)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#67e8f9',
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  <Atom size={18} />
                  Electron concept
                </div>

                <p
                  style={{
                    margin: 0,
                    color: '#cbd5e1',
                    lineHeight: 1.75,
                  }}
                >
                  {molecule.concept}
                </p>
              </article>
            </div>

            <div
              style={{
                marginTop: 20,
                borderRadius: 22,
                border:
                  '1px solid rgba(99,102,241,0.2)',
                background:
                  'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(49,46,129,0.18))',
                padding: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <Sparkles size={19} color="#a5b4fc" />

                <h3
                  style={{
                    margin: 0,
                    fontSize: 19,
                  }}
                >
                  Atomic Composition
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 12,
                }}
              >
                {molecule.atoms.map((atom) => (
                  <div
                    key={atom.symbol}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 13,
                      padding: 14,
                      borderRadius: 16,
                      background:
                        'rgba(8,13,29,0.65)',
                      border:
                        '1px solid rgba(148,163,184,0.1)',
                    }}
                  >
                    <AtomBubble symbol={atom.symbol} />

                    <div>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 16,
                        }}
                      >
                        {atom.name}
                      </strong>

                      <span
                        style={{
                          display: 'block',
                          color: '#94a3b8',
                          fontSize: 13,
                          marginTop: 3,
                        }}
                      >
                        {atom.symbol} × {atom.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 17,
                borderRadius: 18,
                background:
                  'rgba(15,23,42,0.55)',
                border:
                  '1px solid rgba(148,163,184,0.1)',
                color: '#94a3b8',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <Info
                size={18}
                color="#818cf8"
                style={{ flexShrink: 0 }}
              />

              <span>
                This interactive model is designed for
                educational visualization. Real molecular
                orbitals and electron probability distributions
                are more complex than this simplified model.
              </span>
            </div>
          </section>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1050px) {
            main > div > div {
              grid-template-columns: 1fr !important;
            }

            aside {
              position: static !important;
            }
          }

          @media (max-width: 800px) {
            section > div {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            main {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }
          }
        `}
      </style>
    </main>
  )
}