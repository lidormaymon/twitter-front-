import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLoggedStatus, logOut, selectUserData } from "../auth/Slicer/authSlice";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from './logo.png'
import { Link } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import Button from "../componets/Button";
import { useEffect, useRef, useState } from "react";
import { PostTweet } from "../Tweets/componets/PostTweet";
import CloseIcon from '@mui/icons-material/Close';

const SideNav = () => {
    const dispatch = useAppDispatch();
    const BrowsingUser = useAppSelector(selectUserData)
    const modalRef = useRef<HTMLDivElement>(null)
    const isLogged = useAppSelector(selectLoggedStatus);
    const [postTweetFlag, setPostTweetFlag] = useState<boolean>(false)

    
    const togglePostFlagOn = () => {
        if (!postTweetFlag) {
            setPostTweetFlag(true)
            document.body.classList.add('overflow-hidden')
        } else {
            setPostTweetFlag(false)
            document.body.classList.remove('overflow-hidden')
        }
    }

    useEffect(() => {
        const handleClickOutside = ( event: MouseEvent ) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setPostTweetFlag(false)
                document.body.classList.remove('overflow-hidden')
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])
    



    return (
        <div className="sm:sticky sm:top-0 h-fit self-start z-50 hidden sm:block  ">
            <ul className="relative top-5 sm:left-3 2xl:right-8 right-20 h-full px-2 py-4">
                <div className="relative  lg:right-2">
                    <span>
                        <Link to='/'>
                            <p className="text-blue-400  font-bold font-serif text-2xl relative right-3 md:hidden xl:block xl:left-0">Litter</p>
                        </Link>
                    </span>
                    <img src={logo} width={'25px'} className="relative bottom-6 xl:bottom-6 md:left-0 md:bottom-0 left-20 xl:left-20" />
                </div>
                <div className="flex flex-col gap-y-7 relative top-5">
                    <div className="flex flex-row items-center links">
                        <Link to={'/'} className="flex">
                            <HomeIcon className="relative right-2 top-1" />
                            <p className="hidden xl:flex">Home</p>
                        </Link>
                    </div>
                    {isLogged === false ? (
                        <>
                            <div className="flex items-center links">
                                <Link to={'/login'} className="flex">
                                    <LoginIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Sign in</p>
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/register'} className="flex">
                                    <LoginIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Sign up</p>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="items-center links">
                                <Link to={`/profile/${BrowsingUser.username}`} className="flex">
                                    <PersonIcon className="relative  right-2 top-1" />
                                    <p className="hidden xl:block">Profile</p>
                                </Link>
                            </div>
                            <div className="flex items-center links  xl:hidden">
                                <Link to={'/search'} className="flex">
                                    <SearchIcon className="relative  right-2 top-1" fontSize='large' />
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/messages'} className="flex">
                                    <MailOutlineIcon className="relative  right-2 top-1" />
                                    <p className="hidden xl:block">Messages</p>
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/'} onClick={() => dispatch(logOut())} className="flex">
                                    <LogoutIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Log out</p>
                                </Link>
                            </div>
                            <div className="hidden xl:block">
                                <Button
                                    text="POST"
                                    isLoading={false}
                                    className="w-40 relative right-5"
                                    onClick={() => togglePostFlagOn()}
                                />
                            </div>
                        </>
                    )}
                </div>
            </ul>
            {postTweetFlag && (
                <div  className="fixed inset-0 bg-zinc-700/20 h-screen bottom-40 flex flex-col items-center justify-center z-50 ">
                    <div ref={modalRef} className="bg-black md:w-[45%] relative bottom-10 left-10 rounded-xl h-[250px]">
                        <div className="flex justify-end">
                            <CloseIcon
                                className="cursor-pointer absolute top-2 right-2 z-50"
                                onClick={togglePostFlagOn}
                            />
                        </div>
                        <PostTweet setPostTweetFlag={setPostTweetFlag} underline={false} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;
