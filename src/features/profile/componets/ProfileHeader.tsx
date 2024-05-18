import React, { useEffect, useState } from 'react'
import BackButton from '../../componets/BackButton'
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchUserPostsAsync, selectUserData, verifiedAsync } from '../../auth/Slicer/authSlice';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface ProfileHeaderProps {
    display_name: string,
    is_verified: boolean,
    profile_id: number,
    setVerifiedRequestFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ display_name, is_verified, profile_id, setVerifiedRequestFlag }) => {
    const dispatch = useAppDispatch()
    const [userPosts, setUserPosts] = useState(0)
    const BrowsingUser = useAppSelector(selectUserData)
    const [adminOptions, setadminOptions] = useState(false)
    const [hovered, setHovered] = useState(false)

    const handleHover = () => {
        setHovered(!hovered)
    }

    const toggleAdminOptions = () => {
        adminOptions ? setadminOptions(false) : setadminOptions(true)
    }

    const verifiedRequest = () => {
        setVerifiedRequestFlag && setVerifiedRequestFlag(true)
        dispatch(verifiedAsync({ profile_id, is_verified }))
    }

    useEffect(() => {
        dispatch(fetchUserPostsAsync(profile_id)).then(
            (res: any) => setUserPosts(res.payload.post_count))
    }, [userPosts, profile_id])

    return (
        <div className="sticky top-9 sm:top-0 sm:mx-4 z-20 bg-black h-fit">
            <div className='relative top-5 flex bg-black z-20'>
                <BackButton />
                <div className="flex flex-col relative left-8 bottom-2">
                    <div className="flex flex-row self-start  space-x-1">
                        <p className="font-bold text-xl">{display_name}</p>
                        {is_verified && (
                            <>
                                <VerifiedIcon className="relative top-1 text-blue-600" />
                            </>
                        )}
                        {BrowsingUser.is_staff && (
                            <MoreHorizIcon className='flex flex-row justify-end self-end cursor-pointer' onClick={() => toggleAdminOptions()} />
                        )}
                        {adminOptions && (
                            <div className='relative left-5 border-2 w-fit h-9 text-center border-gray-600 font-semibold '>
                                {is_verified ? (
                                    <div className='cursor-pointer' onClick={() => verifiedRequest()}>Remove verified</div>
                                ) : (
                                    <div className='cursor-pointer' onClick={() => verifiedRequest()}>Give verified</div>
                                )}
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