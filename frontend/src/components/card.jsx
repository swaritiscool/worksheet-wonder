import "./master.css"

const Card = ({title, ...props}) => {
  return (
    <div className="Card" {...props}>
      <p>{title}</p>
    </div>
  )
}

export default Card
