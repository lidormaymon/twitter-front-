import { useEffect, useRef, useState } from "react";
import { getUsers, selectLoggedStatus, selectUserData, selectUsers } from "../../auth/Slicer/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { postTweetData, selectNewTweet, setNewTweetTrue } from "../slicer/tweetSlice";
import ProfilePic from "../../profile/componets/ProfilePic";
import EmojiPicker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import Button from "../../componets/Button";


interface props { 
  underline:boolean
  setPostTweetFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PostTweet: React.FC<props> = ({underline, setPostTweetFlag }) => {
    const BrowsingUser = useAppSelector(selectUserData)
    const dispatch = useAppDispatch()
    const users = useAppSelector(selectUsers)
    const BrowsingUserCreds = users.find((user) => user.id === BrowsingUser.id)
    const [tweetText, setTweetText] = useState('')
    const [emojiMode, setEmojiMode] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const hiddenFileInput = useRef<HTMLInputElement | null>(null)
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const navigate = useNavigate()
    const modalRef = useRef<HTMLDivElement>(null)
  
    const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTweetText(event.target.value);
    };
  

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
  
    const postTweet = async (text: string) => {
      const data = { user_id: BrowsingUser.id, text: text }
      setIsLoading(true)
      try {
        if (BrowsingUser.email_verified) {
          if (selectedFile !== null) { //checking if image was selected to know if to attach it
            const data = { user_id: BrowsingUser.id, text: text, image: selectedFile }
            await dispatch(postTweetData(data))
          } else await dispatch(postTweetData(data))
        } else navigate('/email-verify')
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
        dispatch(setNewTweetTrue())
        setTweetText('')
        setSelectedFile(null)
        setEmojiMode(false)
        setPostTweetFlag && setPostTweetFlag(false)
        document.body.classList.remove('overflow-hidden')
      }
    };
  
    const toggleEmojis = () => {
      emojiMode ? setEmojiMode(false) : setEmojiMode(true)
    }
  
    const handleEmojiClick = (emoji: any) => {
      setTweetText((prevText) => prevText + emoji);
    }
  
    const isButtonDisabled = () => {
      if (tweetText.trim() === "" && selectedFile === null) {
        return true
      }
    };

    const handleFetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        await dispatch(getUsers)
      } catch (error) {
        console.log(error);
      } finally{
        setIsLoadingUsers(false)
      }
    }
  
    useEffect(() => {
      dispatch(getUsers())
    }, [])
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setEmojiMode(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)

    }, [])
  return (
    <div className={`relative top-2 ${underline && 'border-b-2 border-gray-600'}  h-44`}>
    <div className="relative bottom-4">
      <ProfilePic image={BrowsingUserCreds?.profile_image || ''} className="relative top-10 left-4" />
      <div className="relative">
        {selectedFile && (
          <>
            <CloseIcon onClick={() => setSelectedFile(null)} className="absolute top-18 left-44 cursor-pointer" />
            <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="absolute top-18 left-28 h-14 w-14" />
          </>
        )}
        <div className="flex flex-row">
          <textarea
            className="bg-black border-b-1 border-gray-600 h-14 w-75 sm:w-[30rem] md:w-98 3xl:w-102 pl-5 relative left-20 top-2  focus:outline-none"
            placeholder="What's happening today?!"
            onChange={handleTextInput}
            value={tweetText}
          />
          <div className="w-fit z-30">
            <SentimentSatisfiedAltIcon
              onClick={() => toggleEmojis()}
              className='flex flex-row flex-end hover:text-gray-200 cursor-pointer'
            />
          </div>
        </div>
      </div>



      <div className="flex">
        <Button
          isLoading={isLoading}
          text="Post"
          loaderClass="relative left-8"
          className={`relative top-4 left-72 md:left-105 3xl:left-110 font-semibol hover:bg-blue-800
             ${isButtonDisabled() ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
          disabled={isButtonDisabled()}
          onClick={() => postTweet(tweetText)}
        />
        <ImageIcon className="relative top-7 right-5 cursor-pointer" onClick={triggerFileInput} />
        <input
          onChange={handleFileInputChange}
          className="hidden"
          ref={hiddenFileInput}
          type="file"
          accept="image/jpg, image/jpeg, image/png"
        />
      </div>

      <div className="relative top-96">
        {emojiMode && (
          <div ref={modalRef} className="absolute bottom-0 right-0 z-10">
            <EmojiPicker
              width={300}
              height={350}
              onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
  
            />
          </div>
        )}
      </div>
    </div>
  </div>
)}
