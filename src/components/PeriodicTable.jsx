const categoryClass = {
  'Nonmetal': 'nonmetal',
  'Noble Gas': 'noble-gas',
  'Alkali Metal': 'alkali-metal',
  'Alkaline Earth Metal': 'alkaline-earth',
  'Metalloid': 'metalloid',
  'Halogen': 'halogen',
  'Post-transition Metal': 'post-transition',
  'Transition Metal': 'transition-metal',
  'Lanthanide': 'lanthanide',
  'Actinide': 'actinide',
}

function getPosition(atomicNumber) {
  if (atomicNumber === 1) {
    return { row: 1, column: 1 }
  }

  if (atomicNumber === 2) {
    return { row: 1, column: 18 }
  }

  if (atomicNumber >= 3 && atomicNumber <= 10) {
    return {
      row: 2,
      column: atomicNumber === 3
        ? 1
        : atomicNumber === 10
          ? 18
          : atomicNumber + 10,
    }
  }

  if (atomicNumber >= 11 && atomicNumber <= 18) {
    return {
      row: 3,
      column: atomicNumber === 11
        ? 1
        : atomicNumber === 18
          ? 18
          : atomicNumber,
    }
  }

  if (atomicNumber >= 19 && atomicNumber <= 36) {
    return {
      row: 4,
      column: atomicNumber - 18,
    }
  }

  if (atomicNumber >= 37 && atomicNumber <= 54) {
    return {
      row: 5,
      column: atomicNumber - 36,
    }
  }

  if (atomicNumber >= 55 && atomicNumber <= 86) {
    if (atomicNumber >= 57 && atomicNumber <= 71) {
      return { row: 6, column: 3 }
    }

    return {
      row: 6,
      column: atomicNumber - 54,
    }
  }

  if (atomicNumber >= 87 && atomicNumber <= 118) {
    if (atomicNumber >= 89 && atomicNumber <= 103) {
      return { row: 7, column: 3 }
    }

    return {
      row: 7,
      column: atomicNumber - 86,
    }
  }

  return null
}

function ElementTile({ element, onSelect, selected }) {
  const category =
    categoryClass[element.category] || 'default-category'

  return (
    <button
      type="button"
      className={`periodic-element ${category} ${
        selected ? 'selected' : ''
      }`}
      onClick={() => onSelect(element)}
      title={`${element.name} — Atomic number ${element.atomic_number}`}
    >
      <span className="element-number">
        {element.atomic_number}
      </span>

      <strong className="element-symbol">
        {element.symbol}
      </strong>

      <span className="element-name">
        {element.name}
      </span>
    </button>
  )
}

export default function PeriodicTable({
  elements,
  selectedElement,
  onSelect,
}) {
  const mainElements = elements.filter(
    (element) =>
      !(
        element.atomic_number >= 57 &&
        element.atomic_number <= 71
      ) &&
      !(
        element.atomic_number >= 89 &&
        element.atomic_number <= 103
      ),
  )

  const lanthanides = elements.filter(
    (element) =>
      element.atomic_number >= 57 &&
      element.atomic_number <= 71,
  )

  const actinides = elements.filter(
    (element) =>
      element.atomic_number >= 89 &&
      element.atomic_number <= 103,
  )

  return (
    <section className="periodic-table-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            ELEMENT DATABASE
          </span>

          <h2>Modern Periodic Table</h2>

          <p>
            Explore all 118 elements. Select an element to
            view its information and 3D atomic model.
          </p>
        </div>

        <div className="element-count">
          <strong>{elements.length}</strong>
          <span>Elements</span>
        </div>
      </div>

      <div className="periodic-table-scroll">
        <div className="periodic-table">
          {mainElements.map((element) => {
            const position = getPosition(
              element.atomic_number,
            )

            if (!position) {
              return null
            }

            return (
              <div
                key={element.atomic_number}
                className="periodic-position"
                style={{
                  gridColumn: position.column,
                  gridRow: position.row,
                }}
              >
                <ElementTile
                  element={element}
                  selected={
                    selectedElement?.atomic_number ===
                    element.atomic_number
                  }
                  onSelect={onSelect}
                />
              </div>
            )
          })}

          <div
            className="periodic-placeholder"
            style={{
              gridColumn: 3,
              gridRow: 6,
            }}
          >
            <span>57–71</span>
            <small>Lanthanides</small>
          </div>

          <div
            className="periodic-placeholder"
            style={{
              gridColumn: 3,
              gridRow: 7,
            }}
          >
            <span>89–103</span>
            <small>Actinides</small>
          </div>
        </div>
      </div>

      <div className="f-block">
        <div className="f-block-label">
          <span>Lanthanides</span>
        </div>

        <div className="f-block-elements">
          {lanthanides.map((element) => (
            <ElementTile
              key={element.atomic_number}
              element={element}
              selected={
                selectedElement?.atomic_number ===
                element.atomic_number
              }
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="f-block-label">
          <span>Actinides</span>
        </div>

        <div className="f-block-elements">
          {actinides.map((element) => (
            <ElementTile
              key={element.atomic_number}
              element={element}
              selected={
                selectedElement?.atomic_number ===
                element.atomic_number
              }
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <div className="periodic-legend">
        {Object.entries(categoryClass).map(
          ([category, className]) => (
            <div
              key={category}
              className="legend-item"
            >
              <span
                className={`legend-dot ${className}`}
              />
              {category}
            </div>
          ),
        )}
      </div>
    </section>
  )
}