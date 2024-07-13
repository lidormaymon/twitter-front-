import React from 'react'
import { useAppSelector } from '../app/hooks'
import { selectUserData } from './Slicer/authSlice'
import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {
    const BrowsingUser = useAppSelector(selectUserData)
    return (
        <>
            {BrowsingUser.is_logged ? (
                <Navigate to={'/'} />
            ) : <Outlet />}
        </>
    )
}

export default AuthLayout