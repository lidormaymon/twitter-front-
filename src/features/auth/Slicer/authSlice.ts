import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { checkCredsValid, chkRefreshToken, register, getUsersData, fetchUserPostsAPI, searchUsersAPI, loginAPI, editUserAPI, changePwdAPI, verifiedAPI, activateAccountAPI } from './authAPI';
import { build } from 'vite';


export interface userDataState {
    id: number,
    is_superuser: any,
    username: string,
    display_name: string,
    first_name: string,
    last_name: string,
    email: string,
    is_verified: boolean
    is_staff: any,
    date_joined: any
    profile_image: string,
    is_logged: boolean,
    bio: string,
    email_verified: boolean
}

export interface Users {
    UsersAR: userDataState[]
}

const initialState: userDataState & Users = {
    is_logged: false,
    id: 0,
    is_superuser: false,
    display_name: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: false,
    date_joined: null,
    profile_image: '',
    is_verified: false,
    bio: '',
    email_verified: false,
    UsersAR: []
}

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (cred: any) => {
        const response = await loginAPI(cred.username, cred.password)
        return response.data
    }
)

export const credsCheck = createAsyncThunk(
    'auth/credsCheck',
    async (token: any) => {
        const response = await checkCredsValid(token)
        console.log(response.status);
        return response.status
    }
)

export const checkRefresh = createAsyncThunk(
    'auth/chkRefresh',
    async (refresh: string) => {
        const response = await chkRefreshToken(refresh)
        return response.data
    }
)

export const registerUser = createAsyncThunk(
    'auth/signUp',
    async (data: any) => {
        console.log(data, 'slice');
        const response = await register(data.username, data.password, data.email, data.display_name, data.image)
        return response.data
    }
)

export const activateAccountAsync = createAsyncThunk(
    'activate/account',
    async (user_id:number) => {
        const response = await activateAccountAPI(user_id)
        return response.data
    }
)

export const getUsers = createAsyncThunk(
    'auth/users',
    async () => {
        const response = await getUsersData()
        return response.data
    }
)

export const fetchUserPostsAsync = createAsyncThunk(
    'count/posts',
    async (user_id: number) => {
        const response = await fetchUserPostsAPI(user_id)
        return response.data
    }
)

export const searchUsers = createAsyncThunk(
    'auth/searchUsers',
    async (searchQuery: string) => {
        const response = await searchUsersAPI(searchQuery)
        return response.data
    }
);

export const editUserAsync = createAsyncThunk(
    'edit/user',
    async (data: any) => {
        const response = await editUserAPI(data.user_id, data.display_name, data.bio, data.image)
        console.log(data);

        return response.data
    }
)

export const changePwdAsync = createAsyncThunk(
    'change/pwd',
    async (data: any) => {
        console.log(data.username);
        const response = await changePwdAPI(data.oldPWD, data.newPWD, data.user_id, data.username)
        return response
    }
)

export const verifiedAsync = createAsyncThunk(
    'verified/request',
    async (data:any) => {
        const response = await verifiedAPI(data.profile_id, data.is_verified)
        return response.data
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut(state) {
            localStorage.removeItem('token')
            sessionStorage.removeItem('refresh')
            location.reload()
            state.is_logged = false
            state.is_staff = false
        },
        getUserData(state) {
            const tokenString = localStorage.getItem('token')
            if (tokenString) {
                const token = JSON.parse(atob(tokenString.split(".")[1]))
                state.username = token['username']
                state.email = token['email']
                state.is_staff = token['staff']
                state.is_superuser = token['super_user']
                state.id = token['user_id']
                state.profile_image = token['image']
                state.display_name = token['display_name']
                state.is_verified = token['is_verified']
                state.bio = token['bio']
                state.email_verified === false ? state.email_verified = token['email_verified'] : null
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {
            state.is_logged = true
            console.log(action.payload);
            const token = action.payload.access
            localStorage.setItem('token', JSON.stringify(token))
        })
        builder.addCase(credsCheck.fulfilled, (state, action) => {
            const status = action.payload
            if (status === 200) {
                state.is_logged = true
            } else {
                localStorage.removeItem('token')
                sessionStorage.removeItem('refresh')
                state.is_logged = false
            }
        })
        builder.addCase(checkRefresh.fulfilled, (state, action) => {
            state.is_logged = true
            localStorage.setItem('token', JSON.stringify(action.payload.access))
            sessionStorage.setItem('refresh', JSON.stringify(action.payload.refresh))
        })
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.UsersAR = action.payload
        })
        builder.addCase(verifiedAsync.fulfilled, (state, action) => {
            console.log(action);
            const userIndex = state.UsersAR.findIndex((user) => user.id, action.payload.user_id)
            state.UsersAR[userIndex].is_verified = action.payload.is_verified
        })
        builder.addCase(activateAccountAsync.fulfilled, (state, action) => {
            state.email_verified = true
        })
    }
})

export const { logOut, getUserData } = authSlice.actions
export const selectUserData = (state: RootState) => state.auth;
export const selectAdminStatus = (state: RootState) => state.auth.is_staff
export const selectUsers = (state: RootState) => state.auth.UsersAR
export const selectLoggedStatus = (state: RootState) => state.auth.is_logged
export default authSlice.reducer