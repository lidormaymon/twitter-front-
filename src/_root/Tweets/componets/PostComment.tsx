import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import ProfilePic from "../../profile/componets/ProfilePic"
import { postCommentAsync } from "../slicer/tweetSlice"
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from 'emoji-picker-react';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom"
import { getUsers, selectUserData, selectUsers } from "../../../_auth/Slicer/authSlice";
import Button from "../../../shared/componets/Button";


interface CommentProps {
  tweet_id: number
  comments: number
  className: string
  setNewComment: React.Dispatch<React.SetStateAction<boolean>>
}

const PostComment: React.FC<CommentProps> = ({ className, tweet_id, comments, setNewComment }) => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const users = useAppSelector(selectUsers)
  const BrowsingUserCreds = users.find((user) => user.id === BrowsingUser.id)
  const [commentText, setCommentText] = useState('')
  const [emojiMode, setEmojiMode] = useState(false)
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null);
    }
  };


  const triggerFileInput = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const isButtonDisabled = () => {
    if (commentText.trim() === "" && selectedFile === null) {
      return true
    }
  };

  const commentTweet = (text: string) => {
    if (BrowsingUser.email_verified) {
      if (selectedFile === null) {
        const data = { text, user_id: BrowsingUser.id, tweet_id, comments }
        dispatch(postCommentAsync(data))
      } else {
        const data = { text, user_id: BrowsingUser.id, tweet_id, comments, image: selectedFile }
        dispatch(postCommentAsync(data))
      }
    } else navigate('/email-verify')
    setNewComment(true)
    setSelectedFile(null)
    setCommentText('')
  }

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setCommentText((prevText) => prevText + emoji);
  }

  useEffect(() => {
    dispatch(getUsers())
  }, [])


  return (
    <div className={`container border-t border-gray-600 ${className}`}>
      <div className="border-b border-gray-600 p-5 w-full">
        <div className='flex flex-row'>
          <ProfilePic image={BrowsingUserCreds?.profile_image || ''} className="w-11 sm:w-14" />
          <div className="relative">
            {emojiMode && (
              <div className="absolute bottom-10 z-10 left-0 sm:left-60" >
                <EmojiPicker
                  width={300}
                  height={350}
                  onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
                />
              </div>
            )}
          </div>
          <textarea
            className="bg-black mx-5 relative bottom-1 outline-none w-full"
            placeholder="Post your reply!"
            value={commentText}
            onChange={handleTextInput}
          />
        </div>
        <SentimentSatisfiedAltIcon
          onClick={() => toggleEmojis()}
          className='relative left-60 top-7 sm:left-102 hover:text-gray-200 cursor-pointer'
        />
        <ImageIcon onClick={triggerFileInput} className="relative top-7 left-10 cursor-pointer" />
        <input
          ref={hiddenFileInput}
          className="hidden"
          type="file"
          onChange={handleFileInputChange}
          accept="image/jpg, image/jpeg, image/png"
        />
        {selectedFile && (
          <div className="relative bottom-29">
            <CloseIcon onClick={() => setSelectedFile(null)} className="absolute top-18 left-44 cursor-pointer" />
            <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="absolute top-18 left-28 h-14 w-14" />
          </div>
        )}
        <Button
          isLoading={false}
          text="Post"
          className={`h-8 w-20 relative left-67 md:h-10 md:w-20 md:left-105 ${isButtonDisabled() ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
          disabled={isButtonDisabled()}
          onClick={() => commentTweet(commentText)}
        />
      </div>
    </div>
  )
}

export default PostComment