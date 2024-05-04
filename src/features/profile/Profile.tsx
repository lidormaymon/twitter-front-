import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { getUsers, selectUserData, selectUsers } from "../auth/Slicer/authSlice"
import ProfilePic from "./componets/ProfilePic"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format } from 'date-fns';
import { ProfilePosts } from "./ProfilePosts"
import ProfileLikes from "./ProfileLikes"
import Button from "../componets/Button"
import {
    countFollowersFollowingAsync, deleteFollowAsync, fetchFollowersAsync,
    postFolloweAsync, isFollowingAsync, selectFollowers,
    selectFollowersData, selectFollowStatusList
}
    from "./Slicer/FollowersSlice"
import VerifiedIcon from '@mui/icons-material/Verified';
import ProfileHeader from "./componets/ProfileHeader"
import { Link } from "react-router-dom";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Error404 } from "../componets/Error404"
import CloseIcon from '@mui/icons-material/Close';
import OpenImage from "../componets/OpenImage"
import Loader from "../componets/Loader"

const Profile = () => {
    const { username } = useParams<{ username: string }>()
    const users = useAppSelector(selectUsers)
    const navigate = useNavigate()
    const BrowsingUser = useAppSelector(selectUserData)
    const profileCreds = users.find((user: any) => user.username === username)
    const profile_id = profileCreds && profileCreds.id
    const isFollowing = useAppSelector(selectFollowStatusList)
    const isFollowingEntry = isFollowing.find(
        (status) => status.from_user_id === BrowsingUser.id && status.to_user_id === profile_id
    );
    const [verifiedRequestFlag, setVerifiedRequestFlag] = useState(false)
    const isUserFollowing = isFollowingEntry ? isFollowingEntry.isFollowing : false;
    const followersData = useAppSelector(selectFollowersData)
    const [followFlag, setFollowFlag] = useState(false)
    const [activeTab, setActiveTab] = useState('posts')
    const dispatch = useAppDispatch()
    const followersAR = useAppSelector(selectFollowers)
    const [hovered, setHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false)


    const handleHover = () => {
        setHovered(!hovered);
    };
    const joinedData = profileCreds?.date_joined
    const formattedJoinedDate = joinedData
        ? format(new Date(joinedData), 'MMMM dd, yyyy')
        : '';

    const follow = () => {
        if (BrowsingUser.email_verified) {
            setFollowFlag(true)
            dispatch(postFolloweAsync({ from_user_id: BrowsingUser.id, to_user_id: profile_id }))
        } else navigate('/email-verify')
    }

    const navigateToEdit = () => {
        if (BrowsingUser.email_verified) {
            navigate('/profile/edit')
        } else navigate('/email-verify')
    }

    const unFollow = () => {
        setFollowFlag(true)
        const index = followersAR.findIndex(
            (follower) => follower.from_user_id === BrowsingUser.id && follower.to_user_id === profile_id
        )
        const follower_id = followersAR[index]['id']
        dispatch(deleteFollowAsync(follower_id))
        console.log(isUserFollowing);
    }

    const asyncGetUsers = async () => {
        setIsLoading(true)
        try {
            await dispatch(getUsers())
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (verifiedRequestFlag) {
            setVerifiedRequestFlag(false)
        }
        asyncGetUsers()
        profile_id === 1 && navigate('/')
    }, [profile_id, verifiedRequestFlag])

    useEffect(() => {
        dispatch(fetchFollowersAsync())
        dispatch(countFollowersFollowingAsync(profile_id || 0))
        followFlag && setFollowFlag(false)
        if (BrowsingUser.is_logged) {
            if (BrowsingUser.id !== profile_id) {
                console.log('yes');
                dispatch(isFollowingAsync({ from_user_id: BrowsingUser.id, to_user_id: profile_id }))
            }
        }
    }, [BrowsingUser.is_logged, profile_id, BrowsingUser.id, isUserFollowing, followFlag, followersData.followers, followersData.following])


    if (isLoading) {
        return <div className="self-center relative top-48"><Loader isTextLoading={true} /></div>
    }
    if (profileCreds === undefined) {
        return <Error404 />
    }


    return (
        <div>
            <ProfileHeader
                display_name={profileCreds?.display_name || ''}
                is_verified={profileCreds?.is_verified || false}
                profile_id={profile_id || 0}
                setVerifiedRequestFlag={setVerifiedRequestFlag}
            />
            <div>
                <div>
                    <div className="flex flex-row relative top-6 mx-4">
                        {profileCreds?.id === BrowsingUser.id && (
                            <div className="relative left-44 sm:left-98 top-12">
                                <Button onClick={() => navigateToEdit()} text="Edit" isLoading={false} className="hover:bg-blue-400 rounded-sm" />
                            </div>
                        )}
                        {profile_id !== BrowsingUser.id && (
                            <>
                                {BrowsingUser.is_logged && (
                                    <div className="relative flex left-48 sm:left-98 3xl:left-100 top-12">
                                        <Link to={`/messages/${profileCreds?.username}`} className="relative right-4 top-2 border-1 border-gray-600 rounded-full h-10 w-8">
                                            <MailOutlineIcon className="relative top-1 left-1" />
                                        </Link>
                                        {isUserFollowing ? (
                                            <Button
                                                isLoading={false}
                                                onMouseEnter={handleHover}
                                                onMouseLeave={handleHover}
                                                text={hovered && isFollowing ? 'Unfollow' : isFollowing ? 'Following' : 'Follow'}
                                                className="hover:bg-blue-400"
                                                onClick={() => unFollow()}
                                            />
                                        ) : (
                                            <Button
                                                isLoading={false}
                                                text="Follow"
                                                onClick={() => follow()}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="relative top-10 left-5 w-20">
                        <OpenImage isProfile={true} image={profileCreds.profile_image} />
                        <div className="relative top-4">
                            <div>
                                <div className="flex">
                                    <p className="font-bold text-xl">{profileCreds?.display_name}</p>
                                    {profileCreds?.is_verified && (
                                        <>
                                            <VerifiedIcon className="relative top-1 text-blue-600" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="font-semibold text-gray-500">@{profileCreds?.username}</p>
                            <p className="font-semibold  w-82 sm:w-102 text-sm relative top-2" style={{ whiteSpace: 'pre-wrap' }}>{profileCreds?.bio}</p>
                        </div>
                        <div className="flex flex-row relative top-10 space-x-3 w-72">
                            <CalendarMonthIcon className="text-gray-500" fontSize="small" />
                            <p className="font-semibold text-gray-500 text-sm">Joined {formattedJoinedDate}</p>
                        </div>
                        <div className="relative top-12">
                            <div className="flex flex-row space-x-3">
                                <div className="flex flex-row space-x-1">
                                    <p className="font-bold">{followersData.followers}</p>
                                    <Link to={`/profile/${profileCreds.username}/followers`}>
                                        <p className="text-sm text-gray-500 font-semibold cursor-pointer hover:underline">Followers</p>
                                    </Link>
                                </div>
                                <div className="flex flex-row space-x-1">
                                    <p className="font-bold">{followersData.following}</p>
                                    <Link to={`/profile/${profileCreds.username}/following`}>
                                        <p className="text-sm text-gray-500 font-semibold cursor-pointer hover:underline">Following</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative top-28">
                    <div className="flex flex-row w-full relative text-center text-gray-500 font-semibold border-b border-gray-600 h-18">
                        <p className={`w-1/2 hover:bg-gray-700 p-2  cursor-pointer ${activeTab === 'posts' && 'text-white'}`} onClick={() => setActiveTab('posts')}>Posts</p>
                        <p className={`w-1/2 hover:bg-gray-700 p-2 cursor-pointer ${activeTab === 'likes' && 'text-white'}`} onClick={() => setActiveTab('likes')}>Likes</p>
                    </div>
                    <div className="relative top-5 ">
                        {activeTab === 'posts' ? (<ProfilePosts profile_id={profile_id || 0} />)
                            : activeTab === 'likes' && <ProfileLikes profile_id={profile_id || 0} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile