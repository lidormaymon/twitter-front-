import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import tweetSlice from "../_root/Tweets/slicer/tweetSlice"

import FollowersSlice from "../_root/profile/Slicer/FollowersSlice"
import chatsSlicer from "../_root/messages/slicer/chatsSlicer"
import authSlice from "../_auth/Slicer/authSlice"




export const store = configureStore({
  reducer: {
    auth:authSlice,
    tweet:tweetSlice,
    followers:FollowersSlice,
    chats:chatsSlicer
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

