import React, { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectUserData } from './Slicer/authSlice'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {
    const BrowsingUser = useAppSelector(selectUserData)
    const navigate = useNavigate()

    useEffect(() => {
        const intervalId = setInterval(() => {
          // Your condition check goes here
          if (BrowsingUser.is_logged) {
            if (BrowsingUser.email_verified) {
              navigate('/');
            }
          }
        }, 1500);
      
        // Cleanup the interval to avoid memory leaks
        return () => clearInterval(intervalId);
      }, [BrowsingUser]);


    return (
        <div className='mx-10 py-10'>
            <div className='flex flex-col items-center mt-20'>
                <h1 className='text-2xl font-serif font-semibold'>Thank you for registering, {BrowsingUser.username}!</h1>
                <div className='flex flex-col items-center mt-2 gap-y-2'>
                    <p>Registering has been sucessful!</p>
                    <p>An email has been sent to {BrowsingUser.email},</p>
                    <p> with a link to verify your account</p>
                    <p>In order to process, and gain access to your priveleges, please go </p>
                    <p>verify your account.</p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerify