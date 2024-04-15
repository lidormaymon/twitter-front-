
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom"

interface BackButtonProps  {
    className?:string
}

const BackButton: React.FC<BackButtonProps> = ({className}) => {
    const navigate = useNavigate()

  return (
    <div>
        <ArrowBackIcon onClick={()=> navigate(-1)}  className={`cursor-pointer rounded-sm h-9  hover:bg-gray-700  ${className}`} />
    </div>
  )
}

export default BackButton