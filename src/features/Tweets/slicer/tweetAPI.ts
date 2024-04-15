import axios from "axios";
import { API_SERVER } from "../../../lib/api";



// <----------------------------------- Tweets API ------------------------------------------>

export const postTweet = ( user_id: number, text?: string, image?: File) => {
    const tweetData = new FormData() 
    tweetData.append('user_id', user_id.toString())
    text !== undefined && tweetData.append('text', text)
    image !== undefined && tweetData.append('image', image)
    return axios.post(API_SERVER + 'tweets/', tweetData)
}

export const fetchProfileTweetsAPI = (user_id: number) => {
    return axios.get(API_SERVER + `profile-page-tweets/?user_id=${user_id}`)
}

export const nextPageProfileTweetsAPI = (page: number, user_id: number) => {
    const params = { page }
    return axios.get(API_SERVER + `profile-page-tweets/?user_id=${user_id}`, { params });
}

export const fetchTweet = (tweet_id: number) => {
    return axios.get(API_SERVER + 'tweets/' + tweet_id)
}

export const fetchTweetsPage = () => {
    return axios.get(API_SERVER + 'page-tweets?page=1')
}

export const nextPageTweets = (page: number) => {
    const params = { page }
    return axios.get(API_SERVER + 'page-tweets', { params });
}

export const fetchFollowingTweetsAPI = (user_id: number, token: string) => {
    console.log(token);
    return axios.get(API_SERVER + `following-tweets/?user_id=${user_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const nextPageFollowingTweetsAPI = (page: number, user_id: number) => {
    const params = { page }
    return axios.get(API_SERVER + `following-tweets/?user_id=${user_id}`, { params });
}

export const fetchProfileLikedTweetsAPI = (profile_id: number) => {
    return axios.get(API_SERVER + `profile_liked_tweets/?user_id=${profile_id}`)
}

export const nextPageProfileLikedTweetsAPI = (page: number, profile_id: number) => {
    const params = { page }
    return axios.get(API_SERVER + `profile_liked_tweets/?user_id=${profile_id}`, { params });
}

export const deleteTweetAPI = (tweet_id: number) => {
    return axios.delete(API_SERVER + `tweets/${tweet_id}`)
}

export const editTweetAPI = (tweet_id: number, text: string) => {
    return axios.put(API_SERVER + `tweets/${tweet_id}/`, { text, edit: true })
}

// <----------------------------------- Tweets Likes API ------------------------------------------>

export const fetchLikes = () => {
    return axios.get(API_SERVER + 'tweet-like/')
}

export const postLike = (user_id: number, tweet_id: number, likes: number) => {
    const data = { user_id, tweet_id }
    const likesData = { likes: likes + 1 }
    const postLikeRequest = axios.post(API_SERVER + 'tweet-like/', data)
    const incrementLikesRequest = axios.put(API_SERVER + `tweets/${tweet_id}/`, likesData)


    return axios.all([postLikeRequest, incrementLikesRequest])
        .then(axios.spread((likeResponse, incrementResponse) => {
            return { likeResponse, incrementResponse }
        }))
        .catch(error => {
            throw error
        });
};


export const queryLikes = (user_id: number | null, tweet_id: number) => {
    return axios.post(API_SERVER + 'query-likes/', { user_id, tweet_id })
}

export const removeLike = (like_id: number, tweet_id: number, likes: number) => {
    const likesData = { likes: likes - 1 }
    const deleteLikeRequest = axios.delete(API_SERVER + `tweet-like/${like_id}`)
    const decremenetLikesRequest = axios.put(API_SERVER + `tweets/${tweet_id}/`, likesData)
    return axios.all([deleteLikeRequest, decremenetLikesRequest])
        .then(axios.spread((deleteResponse, decremenetLikesResponse) => {
            return { deleteResponse, decremenetLikesResponse }
        }))
        .catch(error => {
            throw error
        });
}

export const fetchTweetLikesAPI = (tweet_id: number) => {
    return axios.post(API_SERVER + `who-liked-tweet/`, { tweet_id })
}


// <----------------------------------- Tweet Comments API ------------------------------------------>

export const fetchCommentsLikesAPI = () => {
    return axios.get(API_SERVER + 'tweet-comment-like/')
}

export const fetchCommentsPage = (tweet_id: number) => {
    return axios.get(API_SERVER + `page-comments/${tweet_id}?page=1`)
}

export const postCommentAPI = (user_id: number, tweet_id: number, comments: number, text?: string, image?:File) => {
    console.log(image);
    
    const data = new FormData()
    data.append('user_id', user_id.toString())
    data.append('tweet_id', tweet_id.toString())
    text !== undefined && data.append('text', text)
    image !== undefined && data.append('image', image)
    const commentsData = { comments: comments + 1 }
    const postComment = axios.post(API_SERVER + 'tweet-comment/', data)
    const commentIncremenet = axios.put(API_SERVER + `tweets/${tweet_id}/`, commentsData)
    return axios.all([postComment, commentIncremenet])
        .then(axios.spread((commentResponse, incrementResponse) => {
            return { commentResponse, incrementResponse }
        }))
        .catch(error => {
            throw error
        })
}

// <----------------------------------- Tweet Comments Like API ------------------------------------------>

export const tweetCommentLikeAPI = (user_id: number, comment_id: number, likes: number) => {
    const likesData = { likes: likes + 1 }
    const postLikeData = { user_id, comment_id }
    console.log('user id', user_id, 'comment id', comment_id, 'likes', likes);

    const postCommentLike = axios.post(API_SERVER + 'tweet-comment-like/', postLikeData)
    const incremenetLike = axios.put(API_SERVER + `tweet-comment/${comment_id}/`, likesData)

    return axios.all([postCommentLike, incremenetLike])
        .then(axios.spread((postCommentResponse, incremenetCommentLike) => {
            return { postCommentResponse, incremenetCommentLike }
        }))
        .catch(error => {
            throw error
        })
}

export const queryTweetCommentsLikesAPI = (user_id: number, comment_id: number) => {
    return axios.post(API_SERVER + 'query-comments-likes/', { user_id: user_id, comment_id })
}

export const unLikeTweetCommentAPI = (like_id: number, comment_id: number, likes: number) => {
    const likesData = { likes: likes - 1 }
    const deleteLikeRequest = axios.delete(API_SERVER + `tweet-comment-like/${like_id}/`)
    const decremenetLikesRequest = axios.put(API_SERVER + `tweet-comment/${comment_id}/`, likesData)
    return axios.all([deleteLikeRequest, decremenetLikesRequest])
        .then(axios.spread((deleteResponse, decremenetLikesResponse) => {
            return { deleteResponse, decremenetLikesResponse }
        }))
        .catch(error => {
            throw error
        });
}