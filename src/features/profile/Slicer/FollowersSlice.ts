import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
    countFollowersFollowingAPI, deleteFollowAPI, fetchFollowersAPI,
    fetchFollowersListAPI, postFollowAPI, isFollowingAPI
} from './FollowerAPI';

export interface FollowersTemp { // an interface temp thatd be used to store all the follows in general
    id: number,
    created_time: string,
    from_user_id: number,
    to_user_id: number,

}

export interface FollowersListTemp { //an interface temp that would be used for following and followers list
    user_id: number
}

export interface FollowStatus {
    id:number,
    from_user_id: number;
    to_user_id: number;
    isFollowing: boolean;
}

export interface Followers {
    FollowersAR: FollowersTemp[];
    FollowersListAR: FollowersListTemp[];
    FollowingListAR: FollowersListTemp[];
    followStatusList: FollowStatus[]
    followers: number
    following: number
}

const initialState: Followers = {
    FollowersListAR: [],
    FollowingListAR: [],
    FollowersAR: [],
    followStatusList: [],
    followers: 0,
    following: 0
}

export const fetchFollowersAsync = createAsyncThunk(
    'get/followers',
    async () => {
        const response = await fetchFollowersAPI()
        return response.data
    }
)

export const postFolloweAsync = createAsyncThunk(
    'post/follow',
    async (data: any) => {
        const response = await postFollowAPI(data.from_user_id, data.to_user_id)
        return response.data
    }
)

export const deleteFollowAsync = createAsyncThunk(
    'delete/follower',
    async (follower_id: number) => {
        const response = await deleteFollowAPI(follower_id)
        return response.data
    }
)

export const isFollowingAsync = createAsyncThunk(
    'isFollowing/follows',
    async (data: any) => {
        console.log(data);
        const response = await isFollowingAPI(data.from_user_id, data.to_user_id)
        return response.data
    }
)

export const countFollowersFollowingAsync = createAsyncThunk(
    'count/followers',
    async (user_id: number) => {
        const response = await countFollowersFollowingAPI(user_id)
        return response.data
    }
)

export const fetchFollowersListAsync = createAsyncThunk(
    'list/folloewrs',
    async (user_id: number) => {
        const response = await fetchFollowersListAPI(user_id)
        return response.data
    }
)


export const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowersAsync.fulfilled, (state, action) => {
                state.FollowersAR = action.payload
                
            })
        builder
            .addCase(isFollowingAsync.fulfilled, (state, action) => {
                const { from_user_id, to_user_id, follower_exists, id } = action.payload;
                const existingStatusIndex = state.followStatusList.findIndex(
                    status => status.from_user_id === from_user_id && status.to_user_id === to_user_id
                );

                if (existingStatusIndex !== -1) {
                    state.followStatusList[existingStatusIndex].isFollowing = follower_exists;
                } else {
                    state.followStatusList.push({ from_user_id, to_user_id, isFollowing: follower_exists, id });
                }
            });
        builder
            .addCase(postFolloweAsync.fulfilled, (state, action) => {
                const { from_user_id, to_user_id, id } = action.payload;
                const existingStatusIndex = state.followStatusList.findIndex(
                    status => status.from_user_id === from_user_id && status.to_user_id === to_user_id
                );

                if (existingStatusIndex !== -1) {
                    state.followStatusList[existingStatusIndex].isFollowing = true;
                } else {
                    state.followStatusList.push({ from_user_id, to_user_id, isFollowing: true, id });
                }        
            });
        builder
            .addCase(deleteFollowAsync.fulfilled, (state, action) => {
                const follow_id = action.meta['arg']
                const existingStatusIndex = state.followStatusList.findIndex(
                    status => status.id === follow_id
                )
                if (existingStatusIndex !== -1) {
                    
                }
                console.log(state.followStatusList[existingStatusIndex]);
            });
        builder
            .addCase(countFollowersFollowingAsync.fulfilled, (state, action) => {
                console.log(action)
                state.followers = action.payload['followers_count']
                state.following = action.payload['following_count']
                console.log('followers', state.followers, 'following', state.following);

            })
        builder
            .addCase(fetchFollowersListAsync.fulfilled, (state, action) => {
                console.log(action);
                state.FollowersListAR = action.payload.followers
                console.log(state.FollowersListAR)
                state.FollowingListAR = action.payload.following
                console.log(state.FollowingListAR);

            })
    }
})

export const selectFollowersData = (state: RootState) => state.followers
export const selectFollowers = (state: RootState) => state.followers.FollowersAR
export const selectFollowStatusList = (state: RootState) => state.followers.followStatusList;
export const selectFollowersListAR = (state: RootState) => state.followers.FollowersListAR
export const selectFollowingListAR = (state: RootState) => state.followers.FollowingListAR
export default followersSlice.reducer