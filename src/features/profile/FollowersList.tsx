import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ProfileHeader from "./componets/ProfileHeader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUsers, selectUsers } from "../auth/Slicer/authSlice";
import {
  fetchFollowersAsync, fetchFollowersListAsync, selectFollowersListAR,
  selectFollowingListAR
}
  from "./Slicer/FollowersSlice";
import { FollowListForm } from "./componets/FollowerListForm";




const FollowersList = () => {
  const dispatch = useAppDispatch()
  const { username: username, status: status } = useParams<{ username: string, status: string }>()
  const list_status = status
  const [activeTab, setActiveTab] = useState('')
  const [pageNotFound, setPageNotFound] = useState(false)
  const users = useAppSelector(selectUsers)
  const profileCreds = users.find(
    (user: any) => user.username === username
  )
  const profile_id = profileCreds && profileCreds.id
  const FollowersList = useAppSelector(selectFollowersListAR)
  const FollowingList = useAppSelector(selectFollowingListAR)

  useEffect(() => {
    dispatch(fetchFollowersListAsync(profile_id || 0))


  }, [profile_id])

  useEffect(() => {
    dispatch(getUsers())
    dispatch(fetchFollowersAsync())
    if (list_status === 'followers') {
      setActiveTab('followers')
    } else if (list_status === 'following') {
      setActiveTab('following')
    } else if (list_status === 'mutal-followers') {
      setActiveTab('mutal-frends')
    } else {
      setPageNotFound(true)
    }
  }, [profile_id, status, username])

  return (
    <div className='my-container'>
      <div>
        <div className="flex flex-row relative top-6 mx-4">
          <ProfileHeader
            display_name={profileCreds?.display_name || ''}
            is_verified={profileCreds?.is_verified || false}
            profile_id={profile_id || 0}
          />
        </div>
        <div className="flex flex-row relative top-11 text-gray-400 cursor-pointer border-b border-gray-600">
          <p onClick={() => setActiveTab('followers')} className={`w-1/2 text-center p-4 hover:bg-gray-600 ${activeTab === 'followers' && ' text-white'}`}>Followers</p>
          <p onClick={() => setActiveTab('following')} className={`w-1/2 text-center p-4 hover:bg-gray-600 ${activeTab === 'following' && ' text-white'}`}>Following</p>
        </div>
        {activeTab === 'followers' && (
          FollowersList.length > 0 ? (
            <div>
              {FollowersList.map((data: any, index) => {
                return (
                  <div key={index} className="relative top-13">
                    <FollowListForm user_list_id={data['user_id']} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="relative top-12 left-5">No followers yet</p>
            </div>
          )
        )}
        {activeTab === 'following' && (
          FollowingList.length > 0 ? (
            <div>
              {FollowingList.map((data: any, index) => {
                return (
                  <div key={index} className="relative top-13">
                    <FollowListForm user_list_id={data['user_id']} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="relative top-12 left-5">No following yet</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default FollowersList