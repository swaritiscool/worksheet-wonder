import "./master.css"

const Input = ({title, onChange, ...props}) => {
  return (
    <div className={"inputContainer"}>
      <p>{title}</p>
      <input type="text" onChange={onChange} {...props} />
    </div>
  )
}

export default Input
