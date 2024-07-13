import { RootState } from '../../../app/store';
import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    postLike, postTweet, fetchTweetsPage,
    nextPageTweets, queryLikes,
    removeLike, fetchLikes, fetchTweet,
    postCommentAPI, fetchCommentsPage, tweetCommentLikeAPI,
    queryTweetCommentsLikesAPI, unLikeTweetCommentAPI, fetchCommentsLikesAPI,
    fetchProfileTweetsAPI, fetchFollowingTweetsAPI, nextPageFollowingTweetsAPI,
    fetchProfileLikedTweetsAPI, nextPageProfileTweetsAPI, nextPageProfileLikedTweetsAPI,
    deleteTweetAPI, editTweetAPI, fetchTweetLikesAPI
} from './tweetAPI'


export interface TweetsTemp {
    id: number,
    created_time: string,
    user_id: number,
    comments: number,
    likes: number
    text: string
    liked_by_me: boolean,
    edit: boolean,
    image:string
}
export interface TweetsLikeTemp {
    id: number,
    user_id: number,
    tweet_id: number,
    created_time: string
}

export interface TweetCommentTemp {
    id: number,
    likes: number,
    comments: number,
    text: string,
    created_time: string,
    user_id: number,
    tweet_id: number,
    liked_by_me: boolean,
    image:string
}

export interface TweetCommentLikeTemp {
    id: number,
    user_id: number,
    comment_id: number,
    created_time: string
}


export interface Tweets {
    TweetsAR: TweetsTemp[]
    TweetLikesAR: TweetsLikeTemp[]
    TweetLikesViewAR: TweetsLikeTemp[]
    CommentsAR: TweetCommentTemp[]
    TweetCommentLikeAR: TweetCommentLikeTemp[]
    isLoading: boolean,
    newTweet:boolean
}

const initialState: Tweets = {
    TweetsAR: [],
    TweetLikesAR: [],
    TweetLikesViewAR: [],
    CommentsAR: [],
    TweetCommentLikeAR: [],
    isLoading: false,
    newTweet: false
}

// <----------------------------------- Tweets Async ------------------------------------------>

export const postTweetData = createAsyncThunk(
    'tweet/post',
    async (data: any) => {
        const response = await postTweet(data.user_id, data?.text, data?.image)
        return response.data
    }
)

export const getTweet = createAsyncThunk(
    'get/tweet',
    async (tweet_id: number) => {
        const response = await fetchTweet(tweet_id)
        return response.data
    }
)

export const getTweetsPage = createAsyncThunk(
    'tweet/get',
    async () => {
        const response = await fetchTweetsPage()
        return response.data
    }
)

export const tweetNextPage = createAsyncThunk(
    'tweet/nextPage',
    async (page: number) => {
        const response = await nextPageTweets(page)
        console.log(response.data, 'twiterrr');
        return response.data
    }
)

export const fetchProfileTweetsAsync = createAsyncThunk(
    'profile/tweets',
    async (user_id: number) => {
        const response = await fetchProfileTweetsAPI(user_id)
        return response.data
    }
)

export const nextPageProfileTweetsAsync = createAsyncThunk(
    'nextPage/profile',
    async (data: any) => {
        const response = await nextPageProfileTweetsAPI(data.currentPage, data.profile_id)
        return response.data
    }
)

export const fetchFollowingTweetsAsync = createAsyncThunk(
    'following/tweets',
    async (data: any) => {
        const response = await fetchFollowingTweetsAPI(data.user_id, data.token)
        return response.data
    }
)

export const nextPageFollowingTweetsAsync = createAsyncThunk(
    'nextPageFollowing/tweets',
    async (data: any) => {
        const repsonse = await nextPageFollowingTweetsAPI(data.currentPage, data.BrowsingUserID)
        return repsonse.data
    }
)

export const fetchProfileLikedTweetsAsync = createAsyncThunk(
    'liked/tweets',
    async (profile_id: number) => {
        const response = await fetchProfileLikedTweetsAPI(profile_id)
        return response.data
    }
)

export const nextPageProfileLikedTweetsAsync = createAsyncThunk(
    'nextPageFollowing/tweets',
    async (data: any) => {
        const repsonse = await nextPageProfileLikedTweetsAPI(data.currentPage, data.profile_id)
        return repsonse.data
    }
)

export const deleteTweetAsync = createAsyncThunk(
    'delete/tweet',
    async (tweet_id: number) => {
        const response = await deleteTweetAPI(tweet_id)
        return response.data
    }
)

export const editTweetAsync = createAsyncThunk(
    'edit/tweet',
    async (data: any) => {
        const response = await editTweetAPI(data.tweet_id, data.text)
        return response.data
    }
)

// <----------------------------------- Tweet Likes Async ------------------------------------------>

export const getLikes = createAsyncThunk(
    'getLikes/likes',
    async () => {
        const response = await fetchLikes()
        return response.data
    }
)

export const likeTweet = createAsyncThunk(
    'tweet/like',
    async (data: any) => {
        const response = await postLike(data.BrowsingUserID, data.tweet_id, data.likes)
        return response
    }
)

export const query_likes = createAsyncThunk(
    'query/like',
    async (data: any) => {
        const response = await queryLikes(data.BrowsingUserID, data.tweet_id)
        return response.data
    }
)

export const undoLike = createAsyncThunk(
    'delete/like',
    async (data: any) => {
        const response = await removeLike(data.likeID, data.tweet_id, data.likes)
        return response
    }
)

export const fetchTweetLikesAsync = createAsyncThunk(
    'fetch/likes',
    async (tweet_id: number) => {
        const response = await fetchTweetLikesAPI(tweet_id)
        return response.data
    }
)

// <----------------------------------- Tweet Comments Async ------------------------------------------>

export const getPageComments = createAsyncThunk(
    'page/comment',
    async (tweet_id: number) => {
        const response = await fetchCommentsPage(tweet_id)
        return response.data
    }
)

export const postCommentAsync = createAsyncThunk(
    'post/comment',
    async (data: any) => {
        const response = await postCommentAPI(data.user_id, data.tweet_id, data.comments, data?.text, data?.image)
        return response
    }
)

// <----------------------------------- Tweet Comments Like Async ------------------------------------------>

export const getCommentLikes = createAsyncThunk(
    'get/likes',
    async () => {
        const response = await fetchCommentsLikesAPI()
        return response.data
    }
)

export const tweetCommentLikeAsync = createAsyncThunk(
    'like/comment',
    async (data: any) => {
        const response = await tweetCommentLikeAPI(data.user_id, data.comment_id, data.likes)
        return response
    }
)

export const queryTweetCommentsLikesAsync = createAsyncThunk(
    'query/comment-likes',
    async (data: any) => {
        const response = await queryTweetCommentsLikesAPI(data.BrowsingUserID, data.comment_id)
        return response.data
    }
)

export const unlikeTweetCommentAsync = createAsyncThunk(
    'unlike/comment',
    async (data: any) => {
        const response = await unLikeTweetCommentAPI(data.like_id, data.comment_id, data.likes)
        return response
    }
)

// <----------------------------------- Tweet Slicer ------------------------------------------>

export const tweetSlice = createSlice({
    name: 'tweet',
    initialState,
    reducers: {
        setNewTweetTrue: (state) => {
            state.newTweet = true
        },
        setNewTweetFalse: (state) => {
            state.newTweet = false
        }
    },
    extraReducers: (builder) => {

        // <----------------------------------- Tweets Builder ------------------------------------------>

        builder.addCase(getTweet.fulfilled, (state, action) => {
            state.TweetsAR = [action.payload]
        })
        builder.addCase(getTweetsPage.fulfilled, (state, action) => {
            state.TweetsAR = action.payload
        })
        builder
            .addCase(tweetNextPage.fulfilled, (state, action) => {
                state.TweetsAR.push(...action.payload)
            })
        builder.addCase(fetchFollowingTweetsAsync.fulfilled, (state, action) => {
            state.TweetsAR = action.payload
        })
        builder.addCase(nextPageFollowingTweetsAsync.fulfilled, (state, action) => {
            state.TweetsAR.push(...action.payload)
        })
        builder.addCase(fetchProfileLikedTweetsAsync.fulfilled, (state, action) => {
            state.TweetsAR = action.payload
        })
        builder.addCase(nextPageProfileTweetsAsync.fulfilled, (state, action) => {
            state.TweetsAR.push(...action.payload)
        })
        builder.addCase(fetchProfileTweetsAsync.fulfilled, (state, action) => {
            state.TweetsAR = action.payload
        })
        builder.addCase(deleteTweetAsync.fulfilled, (state, action) => {
            console.log(action);
            const deletedTweetId = action.meta.arg;
            state.TweetsAR = state.TweetsAR.filter(tweet => tweet.id !== deletedTweetId);
        })
        builder.addCase(editTweetAsync.fulfilled, (state, action) => {
            console.log(action);
            const editResponse = action.payload
            const editedTweetIndex = state.TweetsAR.findIndex(tweet => tweet.id === editResponse.id)
            if (editedTweetIndex !== -1) {
                state.TweetsAR[editedTweetIndex].text === editResponse.text
                state.TweetsAR[editedTweetIndex].edit === editResponse.edit
                console.log(state.TweetsAR[editedTweetIndex].text);
            }

        })
        // <----------------------------------- Likes Builder ------------------------------------------>

        builder.addCase(getLikes.fulfilled, (state, action) => {
            state.TweetLikesAR = action.payload
        })
        builder.addCase(likeTweet.fulfilled, (state, action) => {
            const updatedLikeResponse = action.payload.incrementResponse.data

            const likedTweetIndex = state.TweetsAR.findIndex(tweet => tweet.id === updatedLikeResponse.id)
            if (likedTweetIndex !== -1) {
                state.TweetsAR[likedTweetIndex].likes = updatedLikeResponse.likes
                state.TweetsAR[likedTweetIndex].liked_by_me = true
                state.TweetLikesAR = action.payload.likeResponse.data
                console.log(state.TweetLikesAR);
            }
        })
        builder.addCase(undoLike.fulfilled, (state, action) => {
            const updatedLikeResponse = action.payload.decremenetLikesResponse.data
            console.log(state.TweetLikesAR);
            
            const likedTweetIndex = state.TweetsAR.findIndex(
                tweet => tweet.id === updatedLikeResponse.id
            )
            if (likedTweetIndex !== -1) {
                state.TweetsAR[likedTweetIndex].liked_by_me = false
                state.TweetsAR[likedTweetIndex].likes = updatedLikeResponse.likes
                console.log('hi');
                
            }
        })
        builder.addCase(query_likes.fulfilled, (state, action) => {
            const updatedLikeResponse = action.payload
            const likedTweetIndex = state.TweetsAR.findIndex(
                tweet => tweet.id === updatedLikeResponse.tweet_id
            )
            const likeExists = updatedLikeResponse['like_exists']
            state.TweetsAR[likedTweetIndex].liked_by_me = likeExists
        })
        builder.addCase(fetchTweetLikesAsync.fulfilled, (state, action) => {
            state.TweetLikesViewAR = action.payload.likes
            console.log(action);
            
        })
        // <----------------------------------- Tweet Comments Builder ------------------------------------------>
        builder.addCase(getPageComments.fulfilled, (state, action) => {
            state.CommentsAR = action.payload
        })


        // <----------------------------------- Tweet Comments Likes Builder ------------------------------------------>
        builder.addCase(getCommentLikes.fulfilled, (state, action) => {
            state.TweetCommentLikeAR = action.payload
        })
        builder.addCase(tweetCommentLikeAsync.fulfilled, (state, action) => {
            const updatedLikeResponse = action.payload.incremenetCommentLike.data
            console.log(updatedLikeResponse);

            const likedCommentIndex = state.CommentsAR.findIndex(
                comment => comment.id === updatedLikeResponse.id
            )
            if (likedCommentIndex !== -1) {
                state.CommentsAR[likedCommentIndex].likes = updatedLikeResponse.likes
                state.CommentsAR[likedCommentIndex].liked_by_me = true
                state.TweetCommentLikeAR = action.payload.postCommentResponse.data
            }
        })
        builder.addCase(queryTweetCommentsLikesAsync.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(queryTweetCommentsLikesAsync.fulfilled, (state, action) => {
            state.isLoading = false
            const updatedLikeResponse = action.payload
            const likedCommentIndex = state.CommentsAR.findIndex(
                comment => comment.id === updatedLikeResponse.comment_id
            )
            const likeExists = updatedLikeResponse['like_exists']
            state.CommentsAR[likedCommentIndex].liked_by_me = likeExists
        })
        builder.addCase(unlikeTweetCommentAsync.fulfilled, (state, action) => {
            console.log(action);

            const updatedLikeResponse = action.payload.decremenetLikesResponse.data
            const likedCommentIndex = state.CommentsAR.findIndex(
                comment => comment.id === updatedLikeResponse.id
            )
            if (likedCommentIndex !== -1) {
                state.CommentsAR[likedCommentIndex].liked_by_me = false
                state.CommentsAR[likedCommentIndex].likes = updatedLikeResponse.likes
            }
        })
    }
})


export const selectTweetIsLoading = (state: RootState) => state.tweet.isLoading
export const selectTweets = (state: RootState) => state.tweet.TweetsAR
export const selectLikes = (state: RootState) => state.tweet.TweetLikesAR
export const selectViewLikes = (state: RootState) => state.tweet.TweetLikesViewAR
export const selectTweetComments = (state: RootState) => state.tweet.CommentsAR
export const selectCommentLikes = (state: RootState) => state.tweet.TweetCommentLikeAR
export const selectNewTweet = (state: RootState) => state.tweet.newTweet
export const { setNewTweetFalse, setNewTweetTrue } = tweetSlice.actions
export default tweetSlice.reducer