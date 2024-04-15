import { Dictionary, createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { fetchMessagesAPI, fetchNextPageMessageAPI, fetchUserConversationsAPI, findConversationIdAPI, isConverstaionExistAPI, postCoverstaionMessageAPI } from './chatsAPI';
import { build } from 'vite';


export interface ConversationTemp {
    id: number,
    user1: number,
    user2: number,
    created_at: string,
    is_converstaion_exist: boolean
}

export interface ConversationsAR {
    conversation: {
        id: number,
        user1: number,
        user2: number,
        created_at: string
    },
    last_message: {
        id: number,
        conversation_id: number,
        sender_id: number,
        text: string,
        timestamp: string
    }
}

export interface MessageTemp {
    id: number,
    sender_id: number,
    converstaion_id: number,
    text: string,
    timestamp: string
}

export interface Chats {
    ConversationAR: ConversationsAR[],
    Conversation: ConversationTemp,
    MessageAR: MessageTemp[],
}

const initialState: Chats = {
    ConversationAR: [],
    Conversation: {
        id: 0,
        user1: 0,
        user2: 0,
        created_at: '',
        is_converstaion_exist: false
    },
    MessageAR: [],
}

// <----------------------------------- Conversation Async ------------------------------------------>

export const is_converstaion_exist_async = createAsyncThunk( // CHECK IF ITS NEED OR CAN BE REMOVED
    'is_exist/converstaion',
    async (data: any) => {
        const response = await isConverstaionExistAPI(data.BrowsingUserID, data.RecipientUserID)
        return response.data
    }
)

export const postCoverstaionMessageAsync = createAsyncThunk(
    'post/message',
    async (data: any) => {
        const response = await postCoverstaionMessageAPI(data.BrowsingUserID, data.RecipientUserID, data.token, data?.inputText, data?.image)
        return response?.data
    }
)

export const findConversationIDAsync = createAsyncThunk(
    'find_id/conversation',
    async (data: any) => {
        const response = await findConversationIdAPI(data.BrowsingUserID, data.RecipientUserID, data.token)
        return response.data
    }
)

export const fetchUserConversationsAsync = createAsyncThunk(
    'fetch-user/conversations',
    async (data: any) => {
        const response = await fetchUserConversationsAPI(data.BrowsingUserID, data.token)
        return response.data
    }
)

// <----------------------------------- Messages Async ------------------------------------------>

export const fetchMessagesAsync = createAsyncThunk(
    'fetch/messages',
    async (converstaion_id: number) => {
        const response = await fetchMessagesAPI(converstaion_id)
        return response.data
    }
)

export const fetchNextPageMessageAsync = createAsyncThunk(
    'next-page/messages',
    async ( data:any  ) => {
        const response = await fetchNextPageMessageAPI(data.conversation_id, data.currentPage)
        return response.data
    }
)



export const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        updateConversation: (state, action) => {
            const { conversation_id, text, timestamp, sender_id, recipient_id } = action.payload
            console.log('slicerrrd', action.payload);
            
            const conversationIndex = state.ConversationAR.findIndex(
                (conversation) => conversation.conversation.id === conversation_id
            )
            //checking if conversation id exist
            if (conversationIndex !== -1) {
                const conversation = state.ConversationAR[conversationIndex]
                conversation.conversation.id = conversation_id
                conversation.last_message.text = text
                conversation.last_message.timestamp = timestamp
                conversation.last_message.sender_id = sender_id
            } else {
                const newConversation: ConversationsAR = {
                    conversation: {
                        id: conversation_id,
                        user1: recipient_id, 
                        user2: sender_id,
                        created_at: '', 
                    },
                    last_message: {
                        id: 0,
                        conversation_id,
                        sender_id,
                        text,
                        timestamp,
                    },
                };
                state.ConversationAR.push(newConversation);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(is_converstaion_exist_async.fulfilled, (state, action) => { // CHECK IF ITS NEED OR CAN BE REMOVED
            const conversationResponse = action.payload
            const conversation_exist = conversationResponse.conversation_exists
            state.Conversation.is_converstaion_exist = conversation_exist
        })
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
            state.MessageAR = action.payload
        })
        builder.addCase(fetchUserConversationsAsync.fulfilled, (state, action) => {
            state.ConversationAR = action.payload['Conversations']
        })
        builder.addCase(fetchNextPageMessageAsync.fulfilled, (state, action) => {
            console.log(action.payload);
            
            state.MessageAR.push(...action.payload)
        })
    }
})


export const selectConverstaionsAR = (state: RootState) => state.chats.ConversationAR
export const selectConverstaion = (state: RootState) => state.chats.Conversation
export const selectMessages = (state: RootState) => state.chats.MessageAR
export const { updateConversation } = chatsSlice.actions;
export default chatsSlice.reducer