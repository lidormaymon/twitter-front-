import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../componets/BackButton'
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchUserPostsAsync, selectUserData, verifiedAsync } from '../../auth/Slicer/authSlice';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileHeaderProps {
    display_name: string,
    is_verified: boolean,
    profile_id: number,
    username?: string,
    setVerifiedRequestFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ display_name, is_verified, profile_id, setVerifiedRequestFlag, username }) => {
    const dispatch = useAppDispatch()
    const [userPosts, setUserPosts] = useState(0)
    const BrowsingUser = useAppSelector(selectUserData)
    const [adminOptions, setadminOptions] = useState(false)
    const [toggleDelePopUpMSG, setToggleDelePopUpMSG] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)


    const toggleDeleUser = () => {
        console.log('hi');
        
        if (toggleDelePopUpMSG) {
            setToggleDelePopUpMSG(false)
            document.body.classList.remove('overflow-hidden')
        } else {
            setToggleDelePopUpMSG(true)
            document.body.classList.add('overflow-hidden')
        }
    }

    const toggleAdminOptions = () => {
        adminOptions ? setadminOptions(false) : setadminOptions(true)
    }

    const verifiedRequest = () => {
        setVerifiedRequestFlag && setVerifiedRequestFlag(true)
        dispatch(verifiedAsync({ profile_id, is_verified }))
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                toggleDeleUser()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

    }, [])


    useEffect(() => {
        dispatch(fetchUserPostsAsync(profile_id)).then(
            (res: any) => setUserPosts(res.payload.post_count))
    }, [userPosts, profile_id])

    return (
        <div className="sticky top-9 sm:top-0 sm:mx-4 z-20 bg-black h-fit">
            {toggleDelePopUpMSG && (
                <div className='fixed inset-0 bg-zinc-700/20 h-screen bottom-40 flex flex-col items-center justify-center z-50'>
                    <div ref={modalRef} className='border-1 border-gray-600 bg-black rounded-2xl p-10 xl:p-24 relative xl:left-10'>
                        <div className='absolute left-[350px] md:left-[370px] xl:left-[480px] top-1'>
                            <CloseIcon className='cursor-pointer' onClick={()=> toggleDeleUser()} />
                        </div>
                        <div className='relative bottom-5'>
                            <p className='text-center'>Are you sure you want to delete {username}?</p>
                            <div className='relative left-14 top-5'>
                                <button className='p-5 bg-green-500 w-24'>Yes</button>
                                <button className='p-5 bg-red-500 relative left-5 w-24'>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='relative top-5 flex bg-black z-20'>
                <BackButton />
                <div className="flex flex-col relative left-8 bottom-2">
                    <div className="flex flex-row self-start  space-x-1">
                        <p className="font-bold text-xl">{display_name}</p>
                        {is_verified && (
                            <>
                                <VerifiedIcon  className="relative top-1 text-blue-600" />
                            </>
                        )}
                        {BrowsingUser.is_staff && (
                            <MoreHorizIcon className='flex flex-row justify-end self-end cursor-pointer' onClick={() => toggleAdminOptions()} />
                        )}
                        {adminOptions && (
                            <div  className='fixed left-52 md:left-[300px] xl:left-[720px] 3xl:left-[790px] border-2 w-fit  text-center rounded-lg p-1 border-gray-600 font-semibold '>
                                {is_verified ? (
                                    <div className='cursor-pointer hover:underline' onClick={() => verifiedRequest()}>Remove verified</div>
                                ) : (
                                    <div className='cursor-pointer hover:underline' onClick={() => verifiedRequest()}>Give verified</div>
                                )}
                                <div className='cursor-pointer hover:underline' onClick={() => toggleDeleUser()}>Delete User</div>
                            </div>
                        )}
                    </div>
                    <p className="text-xs font-semibold text-gray-500">{userPosts} posts</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader