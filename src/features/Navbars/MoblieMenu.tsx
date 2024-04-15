import LoginIcon from '@mui/icons-material/Login';
import { selectLoggedStatus } from '../auth/Slicer/authSlice'
import logo from './logo.png'
import { Link } from "react-router-dom"
import LogoutIcon from '@mui/icons-material/Logout';;
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logOut } from '../auth/Slicer/authSlice';


const MobileMenu = () => {
    const dispatch = useAppDispatch()
    const isLogged = useAppSelector(selectLoggedStatus)
    return (
        <div className="sticky top-0 z-20 bg-black">
            <div className="flex flex-row  sm:hidden shrink border-none  sticky top-0">
                <div className="flex flex-row w-full ">
                    <Link to={'/'}>
                        <img src={logo} width={'30px'} className="relative left-2" />
                    </Link>

                    <div className="ml-auto ">
                        {!isLogged ? (
                            <Link to={'/login'}>
                                <LoginIcon className='relative top-1 right-1' fontSize='large' />
                            </Link>
                        ) : (
                            <Link to={'/'} onClick={() => dispatch(logOut())} className='relative top-1 right-1'>
                                <LogoutIcon fontSize='large' />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className='relative top-1 w-full sm:hidden border-b-1 border-gray-400 ' />
        </div>
    );
};

export default MobileMenu;


