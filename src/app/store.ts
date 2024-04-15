import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import authSlice from "../features/auth/Slicer/authSlice"
import  tweetSlice  from "../features/Tweets/slicer/tweetSlice"
import  followersSlice  from "../features/profile/Slicer/FollowersSlice"
import chatsSlice  from "../features/messages/slicer/chatsSlicer"



export const store = configureStore({
  reducer: {
    auth:authSlice,
    tweet:tweetSlice,
    followers:followersSlice,
    chats:chatsSlice
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

