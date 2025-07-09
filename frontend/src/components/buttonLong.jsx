import Link from 'next/link'
import "./master.css"

export const ButtonLong = ({title, onPress, ...props}) => {
  return (
    <div className="LongButton" onClick={onPress} {...props}>
      <p>{title}</p>
    </div>
  )
}

export const LinkedButton = ({title, ...props}) => {
  return (
  <Link className="LongButton" {...props}>{title}</Link>
  )
}
