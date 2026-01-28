import './Egg.css';

function Egg({ onClick, isLoading, price, image }) {
  return (
    <div className="egg-container">
      <div className={`ball-wrapper ${isLoading ? 'shake-pro' : ''}`} onClick={onClick}>
        <img src={image} alt="Pokébola" className={`ball-image ${isLoading ? 'loading-brightness' : ''}`} />
      </div>

      <button disabled={isLoading} onClick={onClick} className='cyber-button'>
        {isLoading ? '...' : `ABRIR (${price} 💰)`}
      </button>
    </div>
  );
}

export default Egg;