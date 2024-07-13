import { useState } from 'react'
import { activateAccountAsync, selectUserData } from '../Slicer/authSlice'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Button from '../../shared/componets/Button'



const VerifyAccount = () => {
    const BrowsingUser = useAppSelector(selectUserData)
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)
    const dispatch = useAppDispatch()

    const handleActivateAccount = async () => {
        const user_id = BrowsingUser.id
        setisLoading(true)
        try {
            const response = await dispatch(activateAccountAsync(user_id))
            if (response.type === 'activate/account/fulfilled') {
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setisLoading(false)
        }
    }


    return (
        <>
            {BrowsingUser.is_logged ? (
                <>
                    {BrowsingUser.email_verified ? (
                        <Navigate to={'/'} />
                    ) : (
                        <div className='mx-10 py-10'>
                            <div className='flex flex-col items-center mt-20'>
                                <p>Please press the button in order to verify, and activate your account</p>
                                <Button
                                    onClick={() => handleActivateAccount()}
                                    text='Activate'
                                    className='rounded-sm mt-10'
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Navigate to={'/'} />
            )}
        </>
    )
}

export default VerifyAccount