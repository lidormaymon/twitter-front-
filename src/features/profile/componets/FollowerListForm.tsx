import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUsers, selectUserData, selectUsers } from "../../auth/Slicer/authSlice";
import {
  deleteFollowAsync, fetchFollowersAsync, postFolloweAsync, 
  isFollowingAsync, selectFollowers,selectFollowStatusList
}
  from "../Slicer/FollowersSlice";
import ProfilePic from "../componets/ProfilePic";
import VerifiedIcon from '@mui/icons-material/Verified';
import Button from "../../componets/Button";
import { Link } from "react-router-dom";

interface FollowerListFormProps {
    user_list_id: number,
  }
  
export  const FollowListForm: React.FC<FollowerListFormProps> = ({ user_list_id }) => {
    const dispatch = useAppDispatch()
    const BrowsingUser = useAppSelector(selectUserData)
    const users = useAppSelector(selectUsers)
    const followsCreds = users.find((user: any) => user.id === user_list_id)
    const isFollowing = useAppSelector(selectFollowStatusList)
    const isFollowingEntry = isFollowing.find(
      (status) => status.from_user_id === BrowsingUser.id && status.to_user_id === followsCreds?.id
    );
    const isUserFollowing = isFollowingEntry ? isFollowingEntry.isFollowing : false;
    const [followFlag, setFollowFlag] = useState(false)
    const followersAR = useAppSelector(selectFollowers)
    const [hovered, setHovered] = useState(false);
    const handleHover = () => {
      setHovered(!hovered);
    };
  
    const follow = () => {
      setFollowFlag(true)
      dispatch(postFolloweAsync({ from_user_id: BrowsingUser.id, to_user_id: followsCreds?.id }))
    }
  
    const unFollow = () => {
      setFollowFlag(true)
      const index = followersAR.findIndex(
        (follower) => follower.from_user_id === BrowsingUser.id && follower.to_user_id === followsCreds?.id
      )
      const follower_id = followersAR[index]['id']
      dispatch(deleteFollowAsync(follower_id))
    }
  
  
  
    useEffect(() => {
      dispatch(getUsers)
      if (BrowsingUser.is_logged) {
        if (followFlag) {
          setFollowFlag(false)
          dispatch(fetchFollowersAsync())
          if (BrowsingUser.is_logged) {
            if (BrowsingUser.id !== followsCreds?.id) {
              dispatch(isFollowingAsync({ from_user_id: BrowsingUser.id, to_user_id: followsCreds?.id }))
            }
          }
        }

      }
    }, [BrowsingUser.is_logged, BrowsingUser.id, followsCreds?.id, followFlag])
  
  
    return (
      <div className="container flex flex-row p-6 border-b border-gray-600 h-auto ">
        <div className="mx-2 flex relative bottom-5 w-full">
          <Link to={`/profile/${followsCreds?.username}`}>
            <ProfilePic image={followsCreds?.profile_image || ''} width={'55px'} className="relative right-2" />
          </Link>
          <div className="flex-col mx-2">
            <p className="font-bold flex">
              <Link to={`/profile/${followsCreds?.username}`}>
                <p className="hover:underline">{followsCreds?.display_name}</p>
              </Link>
              {followsCreds?.is_verified && (<VerifiedIcon fontSize="small" className="text-blue-600"/>)}
            </p>
            <p className="text-sm font-semibold text-gray-500 relative bottom-1 right-1">@{followsCreds?.username}</p>
          </div>
          <div className="w-full">  
            {BrowsingUser.is_logged && (
              <>
                {BrowsingUser.id !== followsCreds?.id && (
                  <>
                    <div className="flex justify-end relative top-3"> {/* place this end in the end */}
                      {isUserFollowing ? (
                        <Button
                          isLoading={false}
                          onMouseEnter={handleHover}
                          onMouseLeave={handleHover}
                          text={hovered && isFollowing ? 'Unfollow' : isFollowing ? 'Following' : 'Follow'}
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }