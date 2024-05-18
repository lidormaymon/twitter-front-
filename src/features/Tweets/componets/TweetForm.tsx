import ProfilePic from "../../profile/componets/ProfilePic"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUserData, selectUsers } from "../../auth/Slicer/authSlice";
import { likeTweet, query_likes, undoLike, selectLikes, getLikes, deleteTweetAsync, editTweetAsync } from "../slicer/tweetSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PostComment from "./PostComment";
import Button from "../../componets/Button";
import { ViewLikes } from "./ViewLikes";
import OpenImage from "../../componets/OpenImage";
import { abbreviateLikes } from "../../../lib/abbreviateLikes";



interface TweetFormProps {
  tweet_data: {
    id: number,
    created_time: string,
    comments: number,
    likes: number,
    text: string,
    user_id: number,
    liked_by_me: boolean,
    edit: boolean,
    image: string
  },
  setSumbitEdited?: React.Dispatch<React.SetStateAction<boolean>> //putting this props, as not required, as there are componets where, don't need sumbit edit flag, such
  setNewComment: React.Dispatch<React.SetStateAction<boolean>>
}


const TweetForm: React.FC<TweetFormProps> = ({ tweet_data, setSumbitEdited, setNewComment }) => {
  const users = useAppSelector(selectUsers)
  const [newLike, setNewLike] = useState(false)
  const tweeterCreds = users.find((user: any) => user.id === tweet_data['user_id']) // getthing the user data of the poster of the tweet by using getting it from tweet_data
  const tweet_id = tweet_data['id']
  const likedByMe = tweet_data['liked_by_me']
  const [activeComment, setActiveComment] = useState(false)
  const likesData = useAppSelector(selectLikes)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [likesViewFlag, setlikesViewFlag] = useState(false)
  const BrowsingUser = useAppSelector(selectUserData)
  const [toggleOptionsFlag, setToggleOptionsFlag] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editText, seteditText] = useState(tweet_data.text)
  const BrowsingUserID = BrowsingUser.id
  const likes = abbreviateLikes(tweet_data.likes)
  const modalRef = useRef<HTMLDivElement>(null)
  const parsedDate = parseISO(tweet_data['created_time'])
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()


  const tweetLike = (tweet_id: number, likes: number, event: React.MouseEvent) => {
    event.preventDefault()
    if (BrowsingUser.is_logged) {
      if (BrowsingUser.email_verified) {
        setNewLike(true)
        dispatch(likeTweet({ BrowsingUserID, tweet_id, likes }))
      } else navigate('/email-verify')
    } else {
      navigate('/login')
    }
  }




  const unLike = (tweet_id: number, likes: number, event: React.MouseEvent) => {
    event.preventDefault()
    const index = likesData.findIndex(
      (like) => like.user_id === BrowsingUserID && like.tweet_id === tweet_id
    )
    console.log(likesData);
    const likeID = likesData[index]['id']
    console.log('Found like ID:', likeID);
    try {
      dispatch(undoLike({ likeID, tweet_id, likes }))
    } catch (error) {
      console.log('An error occured while trying to unlike this tweet', error);
    }
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

  const toggleComments = (event: React.MouseEvent) => {
    event.preventDefault()
    if (activeComment === false) {
      if (BrowsingUser.is_logged) {
        setActiveComment(true)
      } else {
        navigate('/login')
      }
    } else {
      setActiveComment(false)
    }
  }

  const deleteTweet = (event: React.MouseEvent, tweet_id: number) => {
    event.preventDefault()
    dispatch(deleteTweetAsync(tweet_id))
    setToggleOptionsFlag(false)
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
    if (setSumbitEdited) {
      setSumbitEdited(true);
    }
  }

  const toggleLikesView = (event: React.MouseEvent) => {
    event.preventDefault()
    setlikesViewFlag(true)
    document.body.classList.add('overflow-hidden')
  }


  useEffect(() => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if ( modalRef.current && !modalRef.current.contains( event.target as Node)) {
        setToggleOptionsFlag(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  

  useEffect(() => {
    if (newLike) { //adding this if statement, so if user tries to like and unlike again, it'd retrive the new data of likes
      setNewLike(false)
      console.log('it does reach');
      dispatch(getLikes())
    }
    dispatch(getLikes())
  }, [newLike])

  useEffect(() => {
    if (BrowsingUser.is_logged) {
      dispatch(query_likes({ BrowsingUserID, tweet_id }))
    }
  }, [BrowsingUserID, tweet_data['id'], BrowsingUser.is_logged, likedByMe]);



  return (
    <div>
      {likesViewFlag && (
        <ViewLikes setlikesViewFlag={setlikesViewFlag} tweet_id={tweet_id} />
      )}
      <div className="border-b-2 border-gray-600 h-fit w-full shrink relative  sm:bottom-5 ">
        <Link to={`/tweet-post/${tweet_id}`}>
          <div className="container  w-95  sm:w-97% p-6 sm:p-8 max-h-max ">
            <div className="flex flex-row flex-shrink">
              <Link to={`/profile/${tweeterCreds?.username}`}>
                <ProfilePic image={tweeterCreds?.profile_image || ''} className="relative bottom-4 right-3 cursor-pointer" />
              </Link>
              <div className="flex flex-row justify-between relative bottom-4 space-x-1 bg-whit  w-82 sm:w-100">
                <div className="flex flex-row space-x-1 w-full">
                  <Link to={`/profile/${tweeterCreds?.username}`}>
                    <p className="font-bold hover:underline cursor-pointer text-sm sm:text-base">{tweeterCreds?.display_name}</p>
                  </Link>
                  {tweeterCreds?.is_verified && (
                    <VerifiedIcon className="text-blue-600" />
                  )}
                  <Link to={`/profile/${tweeterCreds?.username}`}>
                    <p className="text-gray-500 font-semibold font-sans text-sm sm:text-base cursor-pointer">@{tweeterCreds?.username}</p>
                  </Link>
                  <p className="relative left-1 text-gray-500 font-semibold font-sans text-sm sm:text-base">
                    <span className="relative right-1 bottom-1 font-bold">.</span>
                    {formattedDate}
                  </p>
                  {tweet_data.edit && (
                    <>
                      <p className="text-gray-500 font-semibold font-sans text-sm sm:text-base relative left-4">(Edited)</p>
                    </>
                  )}
                </div>
                <div className="flex flex-row w-full ">
                  <div className="flex w-full flex-row justify-end">
                    {(BrowsingUserID === tweeterCreds?.id || BrowsingUser.is_staff) && (
                      <>
                        {toggleOptionsFlag ? (
                          <div ref={modalRef} className="flex">
                            <div className="w-16 rounded-md text-gray-400 font-semibold bg-gray-800 relative -left-1 sm:-left-1 text-center">
                              {BrowsingUser.id === tweeterCreds?.id && (
                                <p onClick={(event) => toggleEdit(event)} className="border-b border-gray-600 hover:bg-gray-600">Edit</p>
                              )}
                              <p onClick={(event) => deleteTweet(event, tweet_id)} className="hover:bg-gray-600">Delete</p>
                            </div>
                          </div>
                        ) : null}
                        <MoreHorizIcon
                          className="flex flex-row text-gray-600 cursor-pointer relative bottom-1"
                          onClick={(event) => toggleOption(event)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-13 w-75 relative bottom-8 left-2">
              {editMode ? (
                <>
                  <textarea
                    className="bg-black border-b-1 border-gray-600 h-14 w-75 sm:w-98 3xl:w-102 relative right-5 top-2 resize-none focus:outline-none"
                    value={editText}
                    onChange={handleTextInput}
                    onClick={(event) => event.preventDefault()}
                  />
                  <p
                    className="relative right-4 top-2 text-sm text-gray-400 cursor-pointer hover:underline"
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
                  <p>{tweet_data.text}</p>
                  <OpenImage image={tweet_data.image} isProfile={false} />
                </>
              )}
            </div>
            <div className="flex w-40 flex-row gap-x-4 relative left-14 top-5 sm:top-7">
              <p className="relative bottom-1 p-1" onClick={(event) => toggleLikesView(event)}>{likes}</p>
              {likedByMe ? (
                <div>
                  <FavoriteIcon
                    className="cursor-pointer text-red-500"
                    onClick={(event) => unLike(tweet_id, tweet_data.likes, event)}
                  />
                </div>
              ) :
                <FavoriteBorderIcon
                  onClick={(event) => tweetLike(tweet_id, tweet_data.likes, event)}
                  className="cursor-pointer hover:text-red-500"
                />
              }
              {tweet_data['comments']}
              {activeComment ? (
                <ChatBubbleOutlineIcon onClick={(event) => toggleComments(event)} className="cursor-pointer hover:text-gray-400" />
              ) : (
                <ChatBubbleOutlineIcon onClick={(event) => toggleComments(event)} className="cursor-pointer hover:text-gray-400" />
              )}
            </div>
          </div>
        </Link>
        {activeComment && (
          <PostComment setNewComment={setNewComment} comments={tweet_data.comments} tweet_id={tweet_id} className="" />
        )}
      </div>
    </div>
  )
};

export default TweetForm;