import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsers, selectUserData, selectUsers } from '../auth/Slicer/authSlice'
import { fetchUserConversationsAsync, selectConverstaionsAR, updateConversation } from './slicer/chatsSlicer'
import ProfilePic from '../profile/componets/ProfilePic'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns';
import ImageIcon from '@mui/icons-material/Image';
import Loader from '../componets/Loader'


interface ConversationListFormsProps {
  data: {
    conversation: {
      id: number,
      user1: number,
      user2: number,
      created_at: string
    }, last_message: {
      id: number,
      sender_id: number,
      text: string,
      timestamp: string,
      conversation_id: number,
      image: string
    }

  }
}

const ConversationsListForm: React.FC<ConversationListFormsProps> = ({ data }) => {
  const conversation = data.conversation
  const last_message = data.last_message
  const users = useAppSelector(selectUsers)
  const BrowsingUser = useAppSelector(selectUserData)
  const dispatch = useAppDispatch()
  const RecipientUserID = BrowsingUser.id !== conversation.user1 && conversation.user1 || BrowsingUser.id !== conversation.user2 && conversation.user2
  const RecipientUserCreds = users.find((user) => user.id === RecipientUserID)
  const parsedDate = parseISO(last_message.timestamp)
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()



  useEffect(() => {
    dispatch(getUsers())
  }, [])


  return (
    <div>
      <Link to={`/messages/${RecipientUserCreds?.username}`}>
        <div className='flex relative top-5 h-20 sm:w-65'>
          <div className='flex mx-3'>
            <ProfilePic image={RecipientUserCreds?.profile_image || ''} width={'50px'} />
            <div className='flex flex-col w-auto'>
              <div className='flex flex-row'>
                <p className='mx-4 font-bold text-lg'>{RecipientUserCreds?.display_name}</p>
                <p className='flex justify-end text-xs text-gray-400'>{formattedDate}</p>
              </div>
              <p className='mx-4 font-serif'>{last_message.sender_id === BrowsingUser.id ? (
                <p className='flex gap-x-1'><p className='text-gray-400 font-semibold'>You:</p>
                  {last_message.image !== null ? (
                    <>
                      <p><ImageIcon />Image</p>
                    </>
                  ) : (
                    <>
                      {last_message.text}
                    </>
                  )}
                </p>
              ) : (
                <>
                  {last_message.image !== null ? (
                    <>
                      <p><ImageIcon />Image</p>
                    </>
                  ) : (
                    <>
                      {last_message.text}
                    </>
                  )}
                </>
              )}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

interface ConversationListProps {
  conversation_id: number
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversation_id }) => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id
  const tokenString = localStorage.getItem('token')
  const conversations = useAppSelector(selectConverstaionsAR)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation_id}/`)

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data)
      const text = data.text
      const sender_id = data.sender_id
      const timestamp = data.timestamp
      const conversation_id = data.conversation_id
      const image = data.image
      const recipient_id = data.recipient_id
      // Dispatch the updateConversation action to update or add the conversation
      dispatch(updateConversation({ conversation_id, text, timestamp, sender_id, recipient_id, image }))
    };

    chatSocket.onclose = function (event) {
      console.log("Connection closed: code=" + event.code + ", reason=" + event.reason)
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts.
      chatSocket.close();
    };
  }, [conversation_id, dispatch]);


  const fetchConversationsAsync = async () => {
    setIsLoading(true)
    try {
      if (tokenString) {
        const token = JSON.parse(tokenString)
        await dispatch(fetchUserConversationsAsync({ BrowsingUserID, token }))
      }
    } catch (error) {
      console.log('Error has been occured!', error);
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchConversationsAsync()
  }, [BrowsingUserID])


  if (isLoading) {
    return <div className='relative left-20 top-20'><Loader isTextLoading={true} /></div>
  }



  return (
    <div className={`${location.pathname === '/messages' ? `flex border-none sm:border-solid` : 'hidden'} xl:flex flex-row border-r  border-gray-600 sm:min-h-screen h-fit w-69 3xl:w-70`}>
      <div>
        <h1 className="px-5 py-5 text-2xl font-bold font-serif">Inbox</h1>
        <div className='py-3'>
          {conversations.length > 0 ? (
            <>
              {conversations
                .slice() // Create a shallow copy of the array to avoid mutating the original
                .sort((a, b) => {
                  const timestampA = parseISO(a.last_message.timestamp);
                  const timestampB = parseISO(b.last_message.timestamp);
                  return timestampB.getTime() - timestampA.getTime(); // Sort in descending order (most recent first)
                })
                .map((data: any, index: any) => {
                  return (
                    <ConversationsListForm data={data} key={index} />
                  )
                })}
            </>
          ) : (
            <div>
              <p>No active chats yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
