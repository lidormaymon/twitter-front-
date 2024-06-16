import React, { useEffect, useState } from 'react'
import TweetForm from '../Tweets/componets/TweetForm'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProfileTweetsAsync, nextPageProfileTweetsAsync, selectTweets } from '../Tweets/slicer/tweetSlice'
import { getUsers, selectUsers } from '../auth/Slicer/authSlice'
import Button from '../componets/Button'
import Loader from '../componets/Loader'
import TweetFormSkeleton from '../Tweets/componets/TweetFormSkeleton'

interface profilePostProps {
  profile_id: number
}

export const ProfilePosts: React.FC<profilePostProps> = ({ profile_id }) => {
  const dispatch = useAppDispatch()
  const profileTweets = useAppSelector(selectTweets)
  const users = useAppSelector(selectUsers)
  const profileCreds = users.find((user: any) => user.id === profile_id)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setNextPage] = useState(false)
  const [sumbitEdited, setSumbitEdited] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [newComment, setNewComment] = useState(false)
  const [isLoadingTweets, setIsLoadingTweets] = useState(false)


  const loadMoreTweets = () => {
    setIsLoadingTweets(true)
    try {
      setCurrentPage(currentPage + 1)
      setNextPage(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingTweets(false)
    }
  };

  const fetchProfileTweets = async () => {
    setIsLoadingTweets(true)
    try {
      await dispatch(fetchProfileTweetsAsync(profile_id))
    } catch (error) {

    } finally {
      setIsLoadingTweets(false)
    }
  }

  useEffect(() => {
    fetchProfileTweets()
    dispatch(getUsers())
    if (sumbitEdited) {
      setSumbitEdited(false)
    }
  }, [profile_id, sumbitEdited])

  useEffect(() => {
    if (isNextPage) {
      dispatch(nextPageProfileTweetsAsync({ currentPage, profile_id }))
      console.log('test');

      setNextPage(false)
    }
  }, [isNextPage, currentPage, profile_id])




  return (
    <div>
      {isLoadingTweets ? (
        <>
          <TweetFormSkeleton></TweetFormSkeleton>
          <TweetFormSkeleton></TweetFormSkeleton>
          <TweetFormSkeleton></TweetFormSkeleton>
        </>
      ) : (
        <>
          {profileTweets.length > 0 ? (
            <>
              {profileTweets.map((data: any, index: any) => {
                return (
                  <div key={index}>
                    <TweetForm
                      setNewComment={setNewComment}
                      tweet_data={data}
                      setSumbitEdited={setSumbitEdited}
                    />
                  </div>
                );
              })}
              {profileTweets.length > 9 && (
                <div className="mx-auto mt-4 h-20  sm:border-b sm:border-gray-600 border-r border-l relative sm:bottom-5">
                  <Button
                    isLoading={isLoading}
                    text="Load more"
                    className="relative left-38  sm:left-67 top-1 font-semibold"
                    onClick={() => loadMoreTweets()}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="relative sm:bottom-5 sm:h-105 sm:border-b 3xl:h-120 sm:border-gray-600">
              <p className="mx-4 relative top-3 text-center">No tweets have been posted by {profileCreds?.username} yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
