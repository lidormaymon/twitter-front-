import { useAppDispatch, useAppSelector } from "../../app/hooks"
import ProfilePic from "../profile/componets/ProfilePic"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VerifiedIcon from '@mui/icons-material/Verified'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { likeTweet, query_likes, undoLike, selectLikes, getLikes, selectTweets, getTweet, getPageComments, selectTweetComments, selectTweetIsLoading, deleteTweetAsync, editTweetAsync } from "./slicer/tweetSlice"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PostComment from "./componets/PostComment"
import Comment from "./componets/Comment"
import { Link } from "react-router-dom";
import { ViewLikes } from "./componets/ViewLikes"
import { abbreviateLikes } from "../../lib/abbreviateLikes"
import { getUsers, selectUserData, selectUsers } from "../../_auth/Slicer/authSlice"
import BackButton from "../../shared/componets/BackButton"
import OpenImage from "../../shared/componets/OpenImage"
import Button from "../../shared/componets/Button"
import Loader from "../../shared/componets/Loader"




const TweetPage = () => {
  const { id } = useParams<{ id: string }>() // Use type annotation to indicate the parameter type
  const tweet_id = Number(id)
  const tweet_comments = useAppSelector(selectTweetComments)
  const tweets = useAppSelector(selectTweets)
  const tweetData = tweets[0]
  const users = useAppSelector(selectUsers)
  const posterCreds = tweetData ? users.find((user: any) => user.id === tweetData.user_id) : null; // getthing the user data of the poster of the tweet by using getting it from tweet_data
  const likedByMe = tweetData?.liked_by_me
  const likes_data = useAppSelector(selectLikes)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const BrowsingUser = useAppSelector(selectUserData)
  const [toggleOptionsFlag, setToggleOptionsFlag] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [likesViewFlag, setlikesViewFlag] = useState(false)
  const [editText, seteditText] = useState(tweetData?.text || '')
  const [sumbitEdited, setSumbitEdited] = useState(false)
  const BrowsingUserID = BrowsingUser.id
  const likes = abbreviateLikes(tweetData.likes)
  const [isLoading, setIsLoading] = useState(true)
  const parsedDate = parseISO(tweetData?.created_time || '')
  const [newComment, setnewComment] = useState(false)
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()

  const tweetLike = (tweet_id: number, likes: number) => {
    if (BrowsingUser.is_logged) {
      if (BrowsingUser.email_verified) {
        dispatch(likeTweet({ BrowsingUserID, tweet_id, likes }))
      } else navigate('/email-verify')
    } else {
      navigate('/login')
    }
  }


  const unLike = (tweet_id: number, likes: number) => {
    const index = likes_data && likes_data.findIndex(
      (like) => like.user_id === BrowsingUserID && like.tweet_id === tweet_id
    )
    const likeID = likes_data[index]['id']
    console.log('Found like ID:', likeID);
    dispatch(undoLike({ likeID, tweet_id, likes }))
  }

  const toggleOption = (event: React.MouseEvent) => {
    event.preventDefault()
    if (toggleOptionsFlag) {
      setToggleOptionsFlag(false)
      console.log('lidor');
    } else {
      setToggleOptionsFlag(true)
    }
  }

  const deleteTweet = (event: React.MouseEvent, tweet_id: number) => {
    event.preventDefault()
    dispatch(deleteTweetAsync(tweet_id))
    navigate('/')
  }

  const toggleEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!editMode) {
      setEditMode(true)
      setToggleOptionsFlag(false)
    } else {
      setEditMode(false)
    }
  }

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    seteditText(event.target.value);
  };

  const editTweet = (event: React.MouseEvent, tweet_id: number, text: string) => {
    event.preventDefault()
    setEditMode(false)
    dispatch(editTweetAsync({ tweet_id, text }))
    setSumbitEdited(true)
  }

  const toggleLikesView = () => {
    setlikesViewFlag(true)
    document.body.classList.add('overflow-hidden')
  }

  const fetchTweet = async () => {
    setIsLoading(true)
    try {
      dispatch(getTweet(tweet_id))
    } catch (error) {
      console.log('Error has been occured', error);
      
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTweet()
    console.log(tweets);
    
    dispatch(getPageComments(tweet_id))
    dispatch(getUsers())
    if (newComment) {
      setnewComment(false)
    }
    if (sumbitEdited) {
      setSumbitEdited(false)
    }
  }, [newComment, sumbitEdited])

  useEffect(() => {
    dispatch(getLikes())
  }, [])


  useEffect(() => {
    if (BrowsingUser.is_logged) {
      dispatch(query_likes({ BrowsingUserID, tweet_id }))
    }
  }, [tweet_id, BrowsingUser.is_logged, likedByMe, BrowsingUserID])

  if (isLoading) {
    return <div className="relative left-44 top-44 sm:left-72"><Loader isTextLoading={true} /></div>; // Render a loading indicator
  }


  return (
    <div className="my-container">
      {likesViewFlag && (
        <ViewLikes setlikesViewFlag={setlikesViewFlag} tweet_id={tweet_id} />
      )}
      <div className="mx-2 sm:mx-10 relative top-10 h-">
        <div className="felx flex row relative bottom-5 sm:right-4 space-x-4">
          <BackButton />
          <p className="text-xl font-bold">Post</p>
        </div>
        <div className="flex relative bottom-3 sm:bottom-0 sm:right-4">
          <Link to={`/profile/${posterCreds?.username}`}>
            <ProfilePic image={posterCreds?.profile_image || ''} className="sm:w-14" alt="profile image" />
          </Link>
          <div className="mx-5 flex">
            <Link to={`/profile/${posterCreds?.username}`}>
              <p className="text-lg font-bold hover:underline">{posterCreds?.display_name}</p>
            </Link>
            {posterCreds?.is_verified && (
              <VerifiedIcon className="mx-1 text-blue-600" />
            )}
            <Link to={`/profile/${posterCreds?.id}`}>
              <p className="text-gray-500 font-semibold hover:underline " >@{posterCreds?.username}</p>
            </Link>
            <p className="text-gray-500 relative bottom-1 font-bold mx-1">.</p>
            <p className="text-gray-500 font-semibold">{formattedDate}</p>
            <div className="flex items-center">
              {(BrowsingUserID === posterCreds?.id || BrowsingUser.is_staff) && (
                <>
                  {toggleOptionsFlag ? (
                    <div className="flex">
                      <div className="w-16 rounded-md text-gray-400 font-semibold bg-gray-800 relative -left-1 sm:-left-1 text-center">
                        {BrowsingUser.id === posterCreds?.id && (
                          <p onClick={(event) => toggleEdit(event)} className="border-b border-gray-600 hover:bg-gray-600 cursor-pointer">Edit</p>
                        )}
                        <p onClick={(event) => deleteTweet(event, tweet_id)} className="hover:bg-gray-600 cursor-pointer">Delete</p>
                      </div>
                    </div>
                  ) : null}
                  <MoreHorizIcon
                    className="flex flex-row text-gray-600 cursor-pointer relative bottom-4"
                    onClick={(event) => toggleOption(event)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {editMode ? (
          <>
            <textarea
              className="bg-black border-b-1 border-gray-600 h-14 w-80 sm:w-98 3xl:w-102 relative left-13 sm:left-11 resize-none focus:outline-none"
              value={editText}
              onChange={handleTextInput}
              onClick={(event) => event.preventDefault()}
            />
            <p
              className="relative left-13 w-4 text-sm text-gray-400 cursor-pointer hover:underline"
              onClick={(event) => toggleEdit(event)}
            >Cancel
            </p>
            <Button
              isLoading={false}
              className="relative left-48 sm:left-98 3xl:left-100 top-5 h-10 w-20 sm:h-11 sm:w-24"
              text="Edit"
              onClick={(event) => editTweet(event, tweet_id, editText)}
            />
          </>
        ) : (
          <>
            <p className="relative left-14 bottom-8">{tweetData.text}</p>
            <div className="relative left-14"><OpenImage isProfile={false} image={tweetData.image} /></div>
          </>
        )}
        <div className="flex w-40 flex-row gap-x-4 relative left-14 top-2">
          <p onClick={() => toggleLikesView()} className="cursor-pointer">{likes}</p>
          {likedByMe ? (
            <div>
              <FavoriteIcon
                className="cursor-pointer text-red-500"
                onClick={() => unLike(tweet_id, tweetData.likes)}
              />
            </div>
          ) :
            <FavoriteBorderIcon
              onClick={() => tweetLike(tweet_id, tweetData.likes)}
              className="cursor-pointer hover:text-red-500"
            />
          }
          {tweetData.comments}
          <ChatBubbleOutlineIcon className="cursor-pointer hover:text-gray-400" />
        </div>
        <div className="relative right-10 w-97 sm:w-105 border-b border-gray-600 h-4 sm:h-6" />
        {BrowsingUser.is_logged && (
          <PostComment 
            setNewComment={setnewComment} 
            comments={tweetData.comments} 
            tweet_id={tweet_id} 
            className="border-t-0 relative right-4 sm:right-10 w-96 sm:w-105" 
          />
        )}
      </div>
      {tweet_comments.map((data: any, index: any) => (
        <div key={index} >
          <Comment tweet_comments={data} />
        </div>
      ))}
    </div>
  )
}

export default TweetPage