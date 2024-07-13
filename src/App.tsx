import { Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './app/hooks'
import { useEffect, useState } from "react";
import { checkRefresh, credsCheck, getUserData, selectAdminStatus, selectLoggedStatus } from "./_auth/Slicer/authSlice";
import SideNav from "./shared/componets/Navbars/SideNav";
import MobileMenu from "./shared/componets/Navbars/MoblieMenu";
import Loader from "./shared/componets/Loader";
import { Error404 } from "./shared/componets/Error404";
import Home from "./_root/Home";
import Login from "./_auth/pages/Login";
import SignUp from "./_auth/pages/SignUp";
import TweetPage from "./_root/Tweets/TweetPage";
import Profile from "./_root/profile/Profile";
import FollowersList from "./_root/profile/FollowersList";
import EditProfile from "./_root/profile/EditProfile";
import { ChangePWD } from "./_auth/pages/ChangePWD";
import MessageChats from "./_root/messages/MessageChats";
import SearchMobile from "./shared/componets/Search/SearchMobile";
import EmailVerify from "./_auth/pages/EmailVerify";
import VerifyAccount from "./_auth/pages/VerifyAccount";
import FooterMenu from "./shared/componets/Navbars/FooterMenu";
import RightSide from "./RightSide";
import AuthLayout from "./_auth/AuthLayout";
import RootLayOut from "./_root/RootLayOut";





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
        <Routes>
          {/* 404 not found pages  */}
          <Route path="*" element={<Error404 />} />

          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
          </Route>

          {/* Private routes */}
          <Route element={<RootLayOut />}>
            <Route index element={<Home />} />
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
          </Route>
        </Routes>
      </div>
    </div>

  )
}

export default App;

