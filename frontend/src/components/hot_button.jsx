import "./master.css"

const ButtonLongHot = ({title, onPress, ...props}) => {
  return (
    <div className="LongButtonHot" onClick={onPress} {...props}>
      <p>{title}</p>
    </div>
  )
}

export default ButtonLongHot
