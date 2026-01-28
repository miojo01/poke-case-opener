import { useEffect, useState } from 'react';
import './Pokedex.css';

function Pokedex({ myCollection, onClose }) {
  const [allPokemons, setAllPokemons] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(res => res.json())
      .then(data => {
        const formatted = data.results.map((p, index) => ({
          id: index + 1,
          name: p.name
        }));
        setAllPokemons(formatted);
      });
  }, []);

  return (
    <div className="pokedex-overlay">
      <div className="pokedex-window">
        <div className="pokedex-header">
          <h2>POKÉDEX KANTO</h2>
          <button onClick={onClose} className="close-dex">X</button>
        </div>
        
        <div className="pokedex-grid">
          {allPokemons.map((poke) => {
            const isOwned = myCollection.some(p => p.pokedexId === poke.id);
            const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;

            return (
              <div key={poke.id} className={`dex-slot ${isOwned ? 'owned' : 'missing'}`}>
                <span className="dex-number">#{String(poke.id).padStart(3, '0')}</span>
                <img src={image} alt={poke.name} loading="lazy" />
                <span className="dex-name">{isOwned ? poke.name : '???'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pokedex;