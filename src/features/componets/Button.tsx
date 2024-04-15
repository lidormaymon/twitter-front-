import { ButtonHTMLAttributes, useEffect} from 'react';
import Loader from './Loader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text:string,
    isLoading:boolean,
    className?:string,
    loaderClass?:string
}

const Button: React.FC<ButtonProps> = ({ text, className,isLoading, loaderClass, ...props}) => {
  useEffect(() => {
    console.log(isLoading);
    
  }, [isLoading])
  
  return (
    <div>
        <button {...props} className={`bg-blue-600 h-11 w-24 rounded-full font-semibold hover:bg-blue-400 ${className}`}>
          {isLoading ? (<div className={`relative left-13 ${loaderClass}`}><Loader isTextLoading={false}  /></div>) : text}
        </button>
    </div>
  )
}

export default Button