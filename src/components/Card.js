import picture from './card.jpg'
//huh
const Card = ({id, index, flipCard, onClick}) => {
  return (
    <div className={`card ${flipCard ? "flipped" : ""}`} key={index}>
      <div className="inside">
        <div className="front"><img className="card" id={id} src={`./JPEG/${id}.jpg`} alt=""></img></div>
        <div className="back">
          <img id={id} onClick={onClick} src={picture} alt="back of a card" className="cardBack"></img>
        </div>
      </div>
    </div>
    )
}

export default Card