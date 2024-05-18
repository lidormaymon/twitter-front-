import Home from "./features/Home";
import SideNav from "./features/Navbars/SideNav"
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './app/hooks'
import { checkRefresh, credsCheck, getUserData, selectAdminStatus, selectLoggedStatus } from "./features/auth/Slicer/authSlice";
import { useEffect, useState } from "react";
import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import MobileMenu from "./features/Navbars/MoblieMenu";
import FooterMenu from "./features/Navbars/FooterMenu";
import TweetPage from "./features/Tweets/TweetPage";
import Profile from "./features/profile/Profile";
import FollowersList from "./features/profile/FollowersList";
import RightSide from "./features/RightSide";
import SearchMobile from "./features/componets/Search/SearchMobile";
import MessageChats from "./features/messages/MessageChats";
import EditProfile from "./features/profile/EditProfile";
import { Error404 } from "./features/componets/Error404";
import Loader from "./features/componets/Loader";
import { ChangePWD } from "./features/auth/ChangePWD";
import EmailVerify from "./features/auth/EmailVerify";
import VerifyAccount from "./features/auth/VerifyAccount";
import axios from 'axios';
import { API_SERVER } from "./lib/api";



function App() {
  const isLogged = useAppSelector(selectLoggedStatus)
  const token = localStorage.getItem('token')
  const session = sessionStorage.getItem('refresh')
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectAdminStatus)
  const location = useLocation();
  const authPages = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/messages')
  const noScrollPage = location.pathname === 'login' || location.pathname === 'register' || location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/profile/edit')
  const [authenticationComplete, setAuthenticationComplete] = useState(false)

  useEffect(() => {
    const credsValidChk = () => {
      try {
        if (token) {
          const tokenData = JSON.parse(token);
          dispatch(credsCheck(tokenData))
            .then((res) => {
              if (res.payload === 200) {
                dispatch(getUserData());
              } else {
                if (session) {
                  const refresh = JSON.parse(session)
                  dispatch(checkRefresh(refresh)).then((res) => console.log('refreshhhhh1', res))
                }
              }
            });
        } else {
          if (session) {
            const refresh = JSON.parse(session)
            dispatch(checkRefresh(refresh)).then((res) => console.log('refreshhhhh2', res.payload))
          }
        }
        console.log('user logged status = ', isLogged);
      } catch (error) {
        console.log(error);

      } finally {
        setAuthenticationComplete(true);
      }
    };



    credsValidChk();
  }, [isLogged, session, getUserData, isAdmin, token]);


  if (!authenticationComplete) {
    return <div className="flex justify-center mt-50"><Loader isTextLoading={true} /> </div>
  }


  return (
    <div>
      <div className={`flex flex-col sm:flex-row container xl:ml-80 3xl:ml-96  min-h-screen ${noScrollPage && 'overflow-y-hidden'}`}>
        <SideNav />
        <MobileMenu />
        <div className={`${!authPages && 'my-container'} `}>
          <Routes>
            <Route path="*" element={<Error404 />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/tweet-post/:id" element={<TweetPage />} />
            <Route path='/profile/:username' element={<Profile />} />
            <Route path="/profile/:username/:status" element={<FollowersList />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/edit/change-password" element={<ChangePWD />} />
            <Route path="/messages" element={<MessageChats />} />
            <Route path="/messages/:username" element={<MessageChats />} />
            <Route path="/search" element={<SearchMobile />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
          </Routes>
        </div>
        {isLogged && <FooterMenu />}
        {!authPages && <RightSide />}

      </div>
    </div>

  )
}

export default App;
