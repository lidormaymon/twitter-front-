import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchFollowingTweetsAsync, nextPageFollowingTweetsAsync, selectNewTweet, selectTweets } from "./slicer/tweetSlice"
import { getUsers, selectUserData } from "../auth/Slicer/authSlice"
import Button from "../componets/Button";
import TweetForm from "./componets/TweetForm";
import Loader from "../componets/Loader";
import { ToastContainer, toast } from 'react-toastify';



const FollowingTweets = () => {
  const BrowsingUser = useAppSelector(selectUserData)
  const newTweet = useAppSelector(selectNewTweet)
  const BrowsingUserID = BrowsingUser.id
  const tokenString = localStorage.getItem('token')
  const tweets = useAppSelector(selectTweets)
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [newComment, setNewComment] = useState(false)
  const [isNextPage, setNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreTweets = () => {
    console.log(BrowsingUserID);

    setCurrentPage(currentPage + 1)
    setNextPage(true)
  };

  const fetchTweets = async () => {
    setIsLoading(true)
    try {
      if (tokenString) {
        const token = JSON.parse(tokenString)
        await dispatch(fetchFollowingTweetsAsync({ user_id: BrowsingUser.id, token }))
      }
    } catch (error) {
      console.log('Error has been occured!', error);
    } finally { 
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTweets()
    dispatch(getUsers())
    newTweet && setNewComment(false)
    newComment && setNewComment(false)
  }, [newTweet, newComment])

  useEffect(() => {
    const fetchData = async () => {
      if (isNextPage) {
        const response = await dispatch(nextPageFollowingTweetsAsync({ currentPage, BrowsingUserID }))
        if (response.payload.length <= 0) {
          toast.error('No more tweets to load')
        }
        setNextPage(false)
      }
    }
    fetchData()
  }, [isNextPage, currentPage])

  if (isLoading) {
    return <div className="relative left-69 top-20"><Loader isTextLoading={true} /></div>
  }

  return (
    <div>
      <ToastContainer theme='colored' />
      <div>
        {tweets.length > 0 ? (
          <>
            {tweets.map((data: any, index: any) => {
              return (
                <div key={index} className="relative top-7">
                  <TweetForm
                    setNewComment={setNewComment}
                    tweet_data={data}
                  />
                </div>
              );
            })}
            {tweets.length > 9 && (
              <div className="mx-auto mt-4 h-20  sm:border-b sm:border-gray-600 relative sm:bottom-5">
                <Button
                  isLoading={false}
                  text="Load more"
                  className="relative left-38  sm:left-67 top-4 sm:top-6  font-semibold"
                  onClick={() => loadMoreTweets()}
                />
              </div>
            )}
          </>
        ) : (
          <div className="relative sm:bottom-5 sm:h-105 sm:border-b 3xl h-120 sm:border-gray-600">
            <p className="mx-4 relative top-3 text-center">No tweets have been posted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowingTweets