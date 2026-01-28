import './PokeGacha.css';

function CaseSelector({ cases, selectedCase, onSelect }) {
    return (
        <div className="case-selector">
            {Object.values(cases).map(box => (
                <button key={box.id} className={`case-btn ${box.id} ${selectedCase === box.id ? 'active' : ''}`} onClick={() => onSelect(box.id)}>
                    <span className="case-name">{box.name}</span>
                    <span className="case-price">💰 {box.price}</span>
                </button>
            ))}
        </div>
    );
}

export default CaseSelector;