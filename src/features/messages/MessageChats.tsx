import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConversationList } from './ConversationList'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsers, selectUserData, selectUsers } from '../auth/Slicer/authSlice'
import { useEffect, useRef, useState } from 'react'
import Loader from '../componets/Loader'
import ProfilePic from '../profile/componets/ProfilePic'
import VerifiedIcon from '@mui/icons-material/Verified';
import SendIcon from '@mui/icons-material/Send';
import { fetchMessagesAsync, fetchNextPageMessageAsync, findConversationIDAsync, postCoverstaionMessageAsync, selectMessages } from './slicer/chatsSlicer'
import MessageForm from './MessageForm'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from 'emoji-picker-react';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../componets/Button'
import { ToastContainer, toast } from 'react-toastify';
import OpenImage from '../componets/OpenImage'


const MessageChats = () => {
  const { username } = useParams<{ username: string }>()
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const users = useAppSelector(selectUsers)
  const recipientCreds = users.find((user) => user.username === username)
  const RecipientUserID = recipientCreds?.id
  const [inputText, setInputText] = useState('')
  const historyMessages = useAppSelector(selectMessages)
  const tokenString = localStorage.getItem('token')
  const token = tokenString ? JSON.parse(tokenString) : null
  const [conversation_id, setConversation_id] = useState(0)
  const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation_id}/`);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setIsNextPage] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [emojiMode, setEmojiMode] = useState(false)
  const [recieveMessages, setrecieveMessages] = useState<{
    text: string,
    sender_id: number,
    timestamp: string
  }[]>([])

  const loadMoreMessages = () => {
    setIsLoadingBtn(true)
    try {
      setCurrentPage(currentPage + 1)
      setIsNextPage(true)
    } catch (error) {
      //BRING TOASTR
    } finally {
      setIsLoadingBtn(false)
    }
  }

  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null);
    }
  };

  // Function to trigger the hidden file input
  const triggerFileInput = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const postMessage = async () => {
    setEmojiMode(false)
    if (selectedFile !== null || inputText.trim() !== "") {
      if (selectedFile === null) {
        const data = { BrowsingUserID, RecipientUserID, inputText, token }
        const response = await dispatch(postCoverstaionMessageAsync(data))
        console.log(response);
        if (response.type === 'post/message/fulfilled') {
          const text = inputText
          const sender_id = BrowsingUserID
          const conversation_id = response.payload.conversation_id
          const recipient_id = RecipientUserID
          const timestamp = new Date().toISOString()
          chatSocket.send(JSON.stringify({ text, sender_id, conversation_id, timestamp, recipient_id, image: null }))
        }
      } else {
        const data = { BrowsingUserID, RecipientUserID, inputText, token, image: selectedFile }
        const response = await dispatch(postCoverstaionMessageAsync(data))
        console.log(response);
        if (response.type === 'post/message/fulfilled') {
          const text = inputText
          const sender_id = BrowsingUserID
          const conversation_id = response.payload.conversation_id
          const recipient_id = RecipientUserID
          const timestamp = new Date().toISOString();
          const image = response.payload.image
          chatSocket.send(JSON.stringify({ text, sender_id, conversation_id, timestamp, recipient_id, image: image }))
        }
      }

    }
    setSelectedFile(null)
    setInputText('')
  }

  const handleTextareaKeyPress = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      postMessage();
    }
  };

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setInputText((prevText) => prevText + emoji);
  };

  //useeffect for socket
  useEffect(() => {
    const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation_id}/`);


    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const text = data.text;
      const sender_id = data.sender_id;
      const timestamp = data.timestamp
      const conversation_id = data.conversation_id
      const image = data.image
      console.log(data);

      setrecieveMessages((prevMessages) => [
        ...prevMessages,
        { text, sender_id, timestamp, conversation_id, image }
      ]);
    };

    chatSocket.onclose = function (event) {
      console.log("Connection closed: code=" + event.code + ", reason=" + event.reason);
    };


    return () => {
      // Clean up the WebSocket connection when the component unmounts.
      chatSocket.close();
    };
  }, [conversation_id, username]);


  useEffect(() => {
    dispatch(getUsers());
    if (tokenString) {
      const token = JSON.parse(tokenString);
      dispatch(findConversationIDAsync({ BrowsingUserID, RecipientUserID, token })).then(
        (res: any) => {
          setConversation_id(res.payload.conversation_id);
          dispatch(fetchMessagesAsync(res.payload.conversation_id)); // Use the updated conversation_id
        }
      );
    }
  }, [username, BrowsingUserID]);



  useEffect(() => {
    if (!BrowsingUser.is_logged || BrowsingUser.id === RecipientUserID || RecipientUserID === 1) {
      navigate('/')
    }
  }, [BrowsingUser.is_logged, isLoading])

  useEffect(() => {
    setTimeout(() => { // giving a delay here using timeout so it'd finish fetching user data
      setIsLoading(false);
    }, 1000);
  }, [])

  useEffect(() => {
    // After rendering messages, scroll to the bottom of the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [historyMessages, recieveMessages]) // Add messages and recieveMessages as dependencies

  useEffect(() => {
    if (isNextPage) {
      setIsNextPage(false)
      dispatch(fetchNextPageMessageAsync({ conversation_id, currentPage }))
    }
  }, [isNextPage, currentPage])


  if (isLoading) {
    return <div className='relative left-50 sm:left-80 top-38 w-20 h-screen'><Loader isTextLoading={true} /></div>
  }



  return (
    <div className="message-container overflow-y-hidden">
      <ToastContainer theme='colored' />
      <div className='flex'>
        <ConversationList conversation_id={conversation_id} />
        {location.pathname.startsWith('/messages/') && (
          <div className='px-4 py-3 flex flex-col w-95 sm:w-full'> {/* i want to make here only when socke is oconnect o display all of it */}
            <div className='flex flex-row'>
              <OpenImage isProfile={true} image={recipientCreds?.profile_image || ''} width='45px' />
              <Link to={`/profile/${recipientCreds?.username}`}>
                <p className='mx-3 text-lg font-bold hover:underline'>{recipientCreds?.display_name}</p>
              </Link>
              {recipientCreds?.is_verified && (
                <VerifiedIcon className='relative right-2 text-blue-600' />
              )}
            </div>
            <div className='h-114 sm:h-screen xl:h-107 max-h-fit 3xl:h-125  overflow-y-scroll scroll-smooth scroll-into-view-bot scroll custom-scrollbar' ref={chatContainerRef}>
              {historyMessages.length > 0 && (
                <>
                  {historyMessages.length > 9 && (
                    <div className='flex flex-row justify-center'>
                      <Button onClick={() => loadMoreMessages()} text='Load more' isLoading={isLoadingBtn} />
                    </div>
                  )}
                  {historyMessages.slice().reverse().map((data: any, index: any) => {
                    return (
                      <MessageForm messages={data} key={index} />
                    );
                  })}
                </>
              )}
              {recieveMessages.length > 0 && (
                <>
                  {recieveMessages.map((data: any, index: any) => {
                    return (
                      <MessageForm messages={data} key={index} />
                    )
                  })}
                </>
              )}
            </div>
            <div className="sticky bottom-0 flex">
              <div className="relative w-full">
                <div className="relative">
                  {emojiMode && (
                    <div className='absolute bottom-[50px] right-0 z-10' >
                      <EmojiPicker
                        width={300}
                        height={350}
                        onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
                      />
                    </div>
                  )}
                </div>
                <div className='bg-black border-1 border-gray-600 rounded-full h-fit w-full pl-8 pr-16 pt-4 overflow-y-hidden'>
                  {selectedFile && (
                    <>
                      <CloseIcon onClick={() => setSelectedFile(null)} className="relative cursor-pointer" />
                      <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="relative h-14 w-14" />
                    </>
                  )}
                  <textarea
                    onKeyPress={(event) => handleTextareaKeyPress(event)}
                    onChange={(event) => handleInputText(event)}
                    value={inputText}
                    className="bg-black w-full focus:outline-none "
                    placeholder="Enter a message"
                  />
                </div>
                <div className='relative bottom-9 left-65 xl:left-102 sm:left-110 3xl:left-125  transform -translate-y-1/2 w-18'>
                  <ImageIcon onClick={triggerFileInput} className=' hover:text-gray-200 cursor-pointer' />
                  <SentimentSatisfiedAltIcon
                    onClick={() => toggleEmojis()}
                    className=' hover:text-gray-200 cursor-pointer'
                  />
                  <SendIcon
                    onClick={postMessage}
                    className=" hover:text-gray-200 cursor-pointer"
                  />
                  <input
                    onChange={handleFileInputChange}
                    className="hidden"
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

export default MessageChats