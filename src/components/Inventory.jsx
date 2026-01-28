import './PokeGacha.css'; 

function Inventory({ collection, sellMode, onToggleSell, onSell }) {
    return (
        <div className="inventory-section">
            <div className="inventory-header">
                <h3 className="inventory-title">INVENTÁRIO ({collection.length})</h3>

                <button className={`sell-btn ${sellMode ? 'active' : ''}`} onClick={onToggleSell}>
                    {sellMode ? '⚠️ MODO VENDA ATIVO' : '💲 HABILITAR VENDA'}
                </button>
            </div>

            <div className="inventory-grid">
                {[...collection].reverse().map((poke) => (
                    <div key={poke.id} className={`inventory-slot rarity-${poke.rarity || 'blue'} ${sellMode ? 'shake-sell' : ''}`} onClick={() => sellMode && onSell(poke.pokedexId, poke.id, poke.rarity)} style={{ cursor: sellMode ? 'pointer' : 'default' }}>
                        <img src={poke.image} alt={poke.name} />
                        {sellMode && <div className="sell-overlay">$</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Inventory;