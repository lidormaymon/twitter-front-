import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { activateAccountAsync, selectUserData } from './Slicer/authSlice'
import { useNavigate } from 'react-router-dom'
import Button from '../componets/Button'

const VerifyAccount = () => {
    const BrowsingUser = useAppSelector(selectUserData)
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)
    const dispatch = useAppDispatch()

    const handleActivateAccount = async () => {
        const user_id = BrowsingUser.id
        setisLoading(true)
        try {
            const response =  await dispatch(activateAccountAsync(user_id))
            if (response.type === 'activate/account/fulfilled') {
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setisLoading(false)
        }
    }
    
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         // Your condition check goes here
    //         if (BrowsingUser.is_logged) {
    //           if (BrowsingUser.email_verified) {
    //             navigate('/')
    //           }
    //         }else navigate('/')
    //       }, 1500);

    //       return () => clearInterval(intervalId);
    //   }, [BrowsingUser])


  return (
    <div className='mx-10 py-10'>
        <div className='flex flex-col items-center mt-20'>
            <p>Please press the button in order to verify, and activate your account</p>
            <Button
                onClick={()=> handleActivateAccount()} 
                text='Activate'
                className='rounded-sm mt-10'
                isLoading={isLoading}
            />
        </div>
    </div>
  )
}

export default VerifyAccount