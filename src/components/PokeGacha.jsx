import { useEffect, useState } from 'react';
import Egg from './Egg';
import Pokedex from './Pokedex';
import CaseSelector from './CaseSelector';
import Inventory from './Inventory';
import './PokeGacha.css';

function PokeGacha() {
    // --- ESTADOS ---
    // Inicia lendo do LocalStorage ou usa o valor padrão (0 ou array vazio)
    const [balance, setBalance] = useState(() => {
        return parseInt(localStorage.getItem('poke_balance')) || 0;
    });

    const [myCollection, setMyCollection] = useState(() => {
        return JSON.parse(localStorage.getItem('poke_collection')) || [];
    });
    
    // Histórico da Pokédex (separado do inventário)
    const [pokedexHistory, setPokedexHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('pokedex_history')) || [];
    });

    const [wonPokemon, setWonPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // --- ESTADOS VISUAIS ---
    const [isSpinning, setIsSpinning] = useState(false);
    const [rouletteItems, setRouletteItems] = useState([]);
    const [rouletteStyle, setRouletteStyle] = useState({});

    const [selectedCase, setSelectedCase] = useState('common');
    const [showPokedex, setShowPokedex] = useState(false);
    const [sellMode, setSellMode] = useState(false);
    const [isWorking, setIsWorking] = useState(false);

    // Listas de Raridade
    const IDS_LEGENDARY = [144, 145, 146, 150, 151]; 
    const IDS_RARE = [
        3, 6, 9, 12, 15, 18, 24, 26, 28, 31, 34, 36, 38, 40, 45, 55, 57, 59, 62, 65, 
        68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 95, 99, 101, 103, 105, 107, 
        110, 112, 115, 121, 123, 125, 126, 127, 128, 130, 131, 134, 135, 136, 139, 
        141, 142, 143, 149
    ];

    const getCommonIds = () => {
        const all = [];
        for(let i=1; i<=151; i++) {
            if(!IDS_LEGENDARY.includes(i) && !IDS_RARE.includes(i)) all.push(i);
        }
        return all;
    };
    const IDS_COMMON = getCommonIds();

    const CASES = {
        common: { 
            id: 'common', name: 'Comum', price: 50, 
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
            probs: { blue: 0.94, purple: 0.055, gold: 0.005 } 
        },
        rare: { 
            id: 'rare', name: 'Rara', price: 150, 
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
            probs: { blue: 0.78, purple: 0.20, gold: 0.02 } 
        },
        legendary: { 
            id: 'legendary', name: 'Lendária', price: 500, 
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
            probs: { blue: 0.40, purple: 0.50, gold: 0.10 } 
        }
    };

    const currentCase = CASES[selectedCase];

    const playSound = (fileName, volume = 0.5) => {
        try {
            // No GitHub Pages, precisamos garantir que o caminho comece com "./" ou o base path
            const audio = new Audio(`./${fileName}`);
            audio.volume = volume;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.error(`Erro ao tocar ${fileName}:`, error));
            }
        } catch (e) {
            console.error("Erro no sistema de áudio:", e);
        }
    };

    // Função auxiliar para salvar tudo no LocalStorage
    const saveToLocal = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const handleWork = async () => {
        if (isWorking) return;
        setIsWorking(true);
        setTimeout(() => {
            const newBalance = balance + 100;
            setBalance(newBalance);
            saveToLocal('poke_balance', newBalance); // Salva Local
            setIsWorking(false);
        }, 1000);
    };

    const handleSell = async (pokedexId, dbId, rarity) => {
        if (!sellMode) return;
        
        let price = 20; 
        if (rarity === 'purple') price = 80;
        if (rarity === 'gold') price = 350;

        const newBalance = balance + price;
        setBalance(newBalance);
        saveToLocal('poke_balance', newBalance);

        const newCollection = myCollection.filter(item => item.id !== dbId);
        setMyCollection(newCollection);
        saveToLocal('poke_collection', newCollection);
    };

    const getRandomRarity = (probs) => {
        const r = Math.random();
        if (r < probs.blue) return 'blue';
        if (r < probs.blue + probs.purple) return 'purple';
        return 'gold';
    };

    const getRandomIdByRarity = (rarity) => {
        if (rarity === 'gold') return IDS_LEGENDARY[Math.floor(Math.random() * IDS_LEGENDARY.length)];
        if (rarity === 'purple') return IDS_RARE[Math.floor(Math.random() * IDS_RARE.length)];
        return IDS_COMMON[Math.floor(Math.random() * IDS_COMMON.length)];
    };

    const handleOpenEgg = async () => {
        if (balance < currentCase.price) { alert("Sem saldo!"); return; }
        
        playSound('clicksound.mp3');
        
        // 1. Cobra o valor
        const newBalance = balance - currentCase.price;
        setBalance(newBalance);
        saveToLocal('poke_balance', newBalance);

        setIsLoading(true);
        setWonPokemon(null);
        setRouletteStyle({ transform: 'translateX(0px)', transition: 'none' });

        // 2. Sorteia
        const winnerRarity = getRandomRarity(currentCase.probs);
        const winnerId = getRandomIdByRarity(winnerRarity);
        
        const apiRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${winnerId}`);
        const data = await apiRes.json();
        
        // Cria objeto do Pokemon (Gera um ID aleatório único tipo timestamp)
        const winnerItemFull = { 
            id: Date.now(), 
            pokedexId: data.id, 
            name: data.name, 
            image: data.sprites.other['official-artwork'].front_default, 
            rarity: winnerRarity 
        };

        const winnerItemSprite = { ...winnerItemFull, image: data.sprites.front_default };

        // 3. Monta Roleta
        const WINNER_INDEX = 70;
        const TOTAL_ITEMS = 80;
        const fakeItems = [];

        for(let i=0; i < TOTAL_ITEMS; i++) {
            if (i === WINNER_INDEX) {
                fakeItems.push(winnerItemSprite);
            } else {
                const r = getRandomRarity(currentCase.probs);
                const id = getRandomIdByRarity(r);
                fakeItems.push({
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    rarity: r
                });
            }
        }
        setRouletteItems(fakeItems);

        // 4. Animação
        setTimeout(() => {
            setIsSpinning(true);
            playSound('openingsound1.mp3', 1);

            const CARD_SIZE = 150; 
            const randomOffset = Math.floor(Math.random() * 40) - 20; 
            const finalPosition = -(WINNER_INDEX * CARD_SIZE) + 400 - 70 + randomOffset;

            setRouletteStyle({
                transform: `translateX(${finalPosition}px)`,
                transition: 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)'
            });
        }, 100);

        // 5. Finaliza
        setTimeout(() => {
            setIsSpinning(false);
            setWonPokemon(winnerItemFull);
            
            // Salva Inventário
            const updatedCollection = [...myCollection, winnerItemFull];
            setMyCollection(updatedCollection);
            saveToLocal('poke_collection', updatedCollection);
            
            // Salva Histórico da Pokedex
            const updatedHistory = [...new Set([...pokedexHistory, winnerItemFull.pokedexId])];
            setPokedexHistory(updatedHistory);
            saveToLocal('pokedex_history', updatedHistory);

            setIsLoading(false);
            setRouletteItems([]);
            playSound('winsound.mp3', 0.6);
        }, 6500);
    };

    const pokedexData = pokedexHistory.map(id => ({ pokedexId: id }));

    return (
        <div className="gacha-container">
            <header className="game-header">
                <div className="header-left">
                    <h1 className="brand-title">POKÉ<span className="highlight">CASE</span></h1>
                    <div className="action-buttons">
                        <button className="dex-btn" onClick={() => setShowPokedex(true)}>
                            <span>📖</span> POKÉDEX
                        </button>
                        <button className="work-btn" onClick={handleWork} disabled={isWorking}>
                            {isWorking ? '⛏️ ...' : '⛏️ TRABALHAR (+100)'}
                        </button>
                    </div>
                </div>
                <div className="stat-item">
                    <span className="label">SALDO</span>
                    <span className="value">💰 {balance}</span>
                </div>
            </header>

            <div className="main-stage">
                {rouletteItems.length > 0 && (
                    <div className="roulette-container">
                        <div className="roulette-marker"></div>
                        <div className="roulette-strip" style={rouletteStyle}>
                            {rouletteItems.map((item, index) => (
                                <div key={index} className={`roulette-card ${item.rarity}`}>
                                    <img src={item.image} alt="poke" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {wonPokemon && !isSpinning && (
                    <div className={`result-card rarity-${wonPokemon.rarity}`}>
                        <h3>ITEM OBTIDO</h3>
                        <img src={wonPokemon.image} alt={wonPokemon.name} className="pokemon-reveal" />
                        <p className="pokemon-name">{wonPokemon.name}</p>
                        
                        <p className="result-probability">
                            Probabilidade: {(currentCase.probs[wonPokemon.rarity] * 100).toFixed(1)}%
                        </p>
                        
                        <button className="close-btn" onClick={() => setWonPokemon(null)}>VOLTAR</button>
                    </div>
                )}

                {!wonPokemon && rouletteItems.length === 0 && (
                    <div className="egg-stage">
                         <Egg onClick={handleOpenEgg} isLoading={isLoading} price={currentCase.price} image={currentCase.image} />
                         <div className="probs-info">
                            <span className="prob-blue">Comum: {(currentCase.probs.blue * 100).toFixed(1)}%</span> | 
                            <span className="prob-purple"> Raro: {(currentCase.probs.purple * 100).toFixed(1)}%</span> | 
                            <span className="prob-gold"> Lendário: {(currentCase.probs.gold * 100).toFixed(1)}%</span>
                         </div>
                    </div>
                )}
            </div>

            <CaseSelector 
                cases={CASES} 
                selectedCase={selectedCase} 
                onSelect={(id) => {
                    if(!isLoading) {
                        playSound('clicksound.mp3');
                        setSelectedCase(id);
                    }
                }} 
            />
            
            <Inventory 
                collection={myCollection} 
                sellMode={sellMode} 
                onToggleSell={() => setSellMode(!sellMode)} 
                onSell={handleSell} 
            />

            {showPokedex && <Pokedex myCollection={pokedexData} onClose={() => setShowPokedex(false)} />}
        </div>
    );
}

export default PokeGacha;