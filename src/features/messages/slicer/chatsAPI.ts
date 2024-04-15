import axios from "axios";
import { API_SERVER } from "../../../lib/api";



// <----------------------------------- Converstaions API ------------------------------------------>

export const isConverstaionExistAPI = (BrowsingUserID:number, RecipientUserID:number) => {
    const data = {BrowsingUserID, RecipientUserID}
    return axios.post(API_SERVER + 'is-conversation-exist/', data)
}

export const postCoverstaionMessageAPI = async (browsingUserID:number, RecipientID:number, token:string, messageContent?:string, image?:File ) => {
    try {
        // Check if the conversation already exists
        const response = await isConverstaionExistAPI(browsingUserID, RecipientID);

        if (response.data.conversation_exists) {
            // If the conversation exists, get the conversation ID
            const conversation_id = response.data.id;
            const data = new FormData()
            messageContent !== undefined && data.append('text', messageContent)
            image !== undefined && data.append('image', image)
            data.append('conversation_id', conversation_id)
            data.append('sender_id', browsingUserID.toString())
            
            // Post the message to the existing conversation
            return axios.post(API_SERVER + `messages/`, data , {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            });
        } else {
            // If the conversation doesn't exist, create it
            const conversationResponse = await axios.post(API_SERVER + 'conversation/', {
                user1: browsingUserID,
                user2: RecipientID
            });

            // Get the conversation ID from the response
            const conversation_id = conversationResponse.data.id;
            const data = new FormData()
            messageContent !== undefined && data.append('text', messageContent)
            image !== undefined && data.append('image', image)
            data.append('conversation_id', conversation_id)
            data.append('sender_id', browsingUserID.toString())

            // Post the message to the newly created conversation
            return axios.post(API_SERVER + `messages/`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        // Handle errors here
        console.error(error);
    }
}

export const findConversationIdAPI = (BrowsingUserID:number, RecipientUserID:number, token:string) => {
    return axios.post(API_SERVER + 'find-conversation-id/', {BrowsingUserID, RecipientUserID}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const fetchUserConversationsAPI = (BrowsingUserID:number, token:string) => {
    return axios.get(API_SERVER + `find-user-conversations/?user_id=${BrowsingUserID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }) 
}

// <----------------------------------- Messages API ------------------------------------------>

export const fetchMessagesAPI = (conversation_id:number) => {
    return axios.get(API_SERVER + `page-messages/${conversation_id}/?page=1`)
}

export const fetchNextPageMessageAPI = (conversation_id:number, page:number ) => {
    return axios.get(API_SERVER + `page-messages/${conversation_id}/?page=${page}`)
}