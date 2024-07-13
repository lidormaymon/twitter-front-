import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import ProfilePic from "../../profile/componets/ProfilePic"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VerifiedIcon from '@mui/icons-material/Verified'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { getCommentLikes, queryTweetCommentsLikesAsync, selectCommentLikes, tweetCommentLikeAsync, unlikeTweetCommentAsync } from "../slicer/tweetSlice"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { selectUserData, selectUsers } from "../../../_auth/Slicer/authSlice"
import OpenImage from "../../../shared/componets/OpenImage"



interface CommentProps {
    tweet_comments: {
        id: number,
        likes: number,
        text: string,
        created_time: string,
        user_id: number,
        tweet_id: number,
        liked_by_me: false,
        comments: number,
        image: string
    }
}


const Comment: React.FC<CommentProps> = ({ tweet_comments }) => {
    const dispatch = useAppDispatch()
    const [newLike, setNewLike] = useState(false)
    const likes_data = useAppSelector(selectCommentLikes)
    const users = useAppSelector(selectUsers)
    const navigate = useNavigate()
    const BrowsingUser = useAppSelector(selectUserData)
    const BrowsingUserID = BrowsingUser.id
    const comment_id = tweet_comments['id']
    const likedByMe = tweet_comments['liked_by_me']
    const commnetPosterCreds = users.find((user: any) => user.id === tweet_comments['user_id']) // getthing the user data of the poster of the tweet by using getting it from tweet_data
    const parsedDate = parseISO(tweet_comments.created_time)
    const formattedDate =
        new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
            ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
            : parsedDate.toLocaleDateString()

    const likeComment = (likes: number, comment_id: number) => {
        console.log('like');
        setNewLike(true)
        const data = { likes, comment_id, user_id: BrowsingUserID }
        if (BrowsingUser.is_logged) {
            dispatch(tweetCommentLikeAsync(data))
        } else {
            navigate('/login')
        }
    }

    const unLike = (comment_id: number, likes: number) => {
        console.log('unlike');

        const index = likes_data.findIndex(
            (like) => like.user_id === BrowsingUserID && like.comment_id === comment_id
        )
        console.log(index);

        const like_id = likes_data[index]['id']
        console.log('Found like ID:', like_id);
        try {
            dispatch(unlikeTweetCommentAsync({ like_id, comment_id, likes }))
        } catch (error) {
            console.log('An error occured while trying to unlike this tweet', error);

        }
    }

    useEffect(() => {
        if (newLike) {
            setNewLike(false)
        }
        dispatch(getCommentLikes())
    }, [newLike])


    useEffect(() => {
        if (newLike) { //adding this if statement, so if user tries to like and unlike again,
            setNewLike(false) // it'd retrive the new data of likes
        }
        if (BrowsingUser.is_logged) {
            dispatch(queryTweetCommentsLikesAsync({ BrowsingUserID, comment_id }))
        }
    }, [BrowsingUser.is_logged, BrowsingUserID, comment_id, likedByMe])


    return (
        <div className="container p-3 ">
            <div className="relative top-10 right-5 sm:left-1 sm:top-12 mx-4 sm:mx-0">
                <div className="flex">
                    <div>
                        <Link to={`/profile/${commnetPosterCreds?.username}`}>
                            <ProfilePic image={commnetPosterCreds?.profile_image || ''} />
                        </Link>
                    </div>
                    <div className="flex  mx-4 sm:mx-6">
                        <Link to={`/profile/${commnetPosterCreds?.username}`}>
                            <p className="font-bold hover:underline">{commnetPosterCreds?.display_name}</p>
                        </Link>
                        {commnetPosterCreds?.is_verified && (
                            <VerifiedIcon className="mx-1 text-blue-600" />
                        )}
                        <Link to={`/profile/${commnetPosterCreds?.username}`}>
                            <p className="text-gray-500 text-sm font-semibold hover:underline">@{commnetPosterCreds?.username}</p>
                        </Link>
                        <p className="text-gray-500 text-sm relative bottom-1 font-bold mx-1">.</p>
                        <p className="text-gray-500 text-sm font-semibold">{formattedDate}</p>
                        <MoreHorizIcon className="text-gray-500 relative " />
                    </div>
                </div>
                <div className="relative left-20 bottom-5 w-72">
                    {tweet_comments.image === null ? (
                        <p>{tweet_comments.text}</p>
                    ) : (
                        <>
                            <OpenImage image={tweet_comments.image} isProfile={false} />
                            {tweet_comments.text.trim() !== "" && (
                                <p>{tweet_comments.text}</p>
                            )}
                        </>
                    )}
                </div>
                <div className="flex mx-20 space-x-2">
                    <p>{tweet_comments.likes}</p>
                    {tweet_comments.liked_by_me ? (
                        <FavoriteIcon onClick={() => unLike(tweet_comments.id, tweet_comments.likes)} className="text-red-500 cursor-pointer" />
                    ) : (
                        <FavoriteBorderIcon onClick={() => likeComment(tweet_comments.likes, tweet_comments.id)} className="cursor-pointer hover:text-red-500" />
                    )}
                    <p>{tweet_comments.comments}</p>
                </div>
            </div>
            <div className="border-b border-gray-600 relative right-2 top-12 w-95 sm:right-3 sm:top-14 sm:w-105"></div>
        </div>
    )
}

export default Comment