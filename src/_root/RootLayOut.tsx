import { Navigate, Outlet } from "react-router-dom"
import { selectUserData } from "../_auth/Slicer/authSlice"
import { useAppSelector } from "../app/hooks"
import SideNav from "../shared/componets/Navbars/SideNav"
import MobileMenu from "../shared/componets/Navbars/MoblieMenu"
import FooterMenu from "../shared/componets/Navbars/FooterMenu"
import RightSide from "../RightSide"


const RootLayOut = () => {
    const BrowsingUser = useAppSelector(selectUserData)

    return (
        <>
            {BrowsingUser.is_logged ? (
                <div className="flex flex-row">
                    <SideNav />

                    <div className="my-container flex flex-row">   
                    <MobileMenu />
                        <Outlet />
                        <FooterMenu />
                    </div>
                    <RightSide />
                </div>
            ) : (
                <Navigate to={'/login'} />
            )}
        </>
    )
}

export default RootLayOut