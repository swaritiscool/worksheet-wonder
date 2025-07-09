import "./master.css"
import Image from 'next/image'

const UtilsButton = ({symbol, alt, ...props}) => {
  return (
    <div className="utils" {...props}>
      <Image
        src={symbol}
        width={40}
        height={40}
        alt={alt}
      />
    </div>
  )
}

export default UtilsButton
