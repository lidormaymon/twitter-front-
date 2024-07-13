import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ProfilePic from './componets/ProfilePic'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from 'emoji-picker-react';
import { editUserAsync, getUsers, selectUserData, selectUsers } from '../../_auth/Slicer/authSlice';
import BackButton from '../../shared/componets/BackButton';
import Button from '../../shared/componets/Button';



const EditProfile = () => {
  const [isLoadingEdit, setisLoadingEdit] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [profile_pic, setprofile_pic] = useState('')
  const BrowsingUser = useAppSelector(selectUserData)
  const [emojiMode, setEmojiMode] = useState(false)
  const users = useAppSelector(selectUsers)
  const BrowsingUserCreds = users.find((user: any) => user.id === BrowsingUser.id)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nameInput, setNameInput] = useState('')
  const [bioInput, setBioInput] = useState('')
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [nameError, setNameError] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)


  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value)
  }

  const handleBioInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioInput(event.target.value)
  }

  // Function to cpture the input text with the line break
  const handleBioKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13) {


      const updatedBio = event.currentTarget.value;

      setBioInput(updatedBio);
    }
  };


  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setprofile_pic(URL.createObjectURL(file));
    } else {
      // If no file is selected, set selectedFile to null
      setSelectedFile(null);
    }
  }

  // Function to trigger the hidden file input
  const triggerFileInput = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const sumbitEdit = async () => {
    const bio = bioInput
    const display_name = nameInput
    const image = selectedFile
    const user_id = BrowsingUser.id

    if (display_name.trim() !== '') {
      setisLoadingEdit(true)
      try {
        const response = await dispatch(editUserAsync({ user_id, display_name, bio, image }))
        if (response.type === 'edit/user/fulfilled') {
          navigate(`/profile/${BrowsingUser.username}`)
        }
      } catch (error) {
        console.log(error);

      } finally {
        setisLoadingEdit(false)
      }
    } else setNameError(true)
  }

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setBioInput((prevText) => prevText + emoji);
  }


  useEffect(() => {
    dispatch(getUsers())
    if (BrowsingUser.is_logged) {
      setprofile_pic(BrowsingUserCreds?.profile_image || '')
      setNameInput(BrowsingUserCreds?.display_name || '')
      setBioInput(BrowsingUserCreds?.bio || '')
    } else {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = ( event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setEmojiMode(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)


  }, [])
  




  return (
    <div className='mx-5'>
      <div className='flex flex-col relative top-6'>
        <div className='relative bottom-3'>
          <BackButton />
        </div>
        <h1 className='text-3xl font-bold font-seirf'>Edit Profile</h1>
        <Link to='change-password'>
          <p
            className='flex flex-row justify-end relative bottom-7 text-sm text-gray-500 hover:text-gray-400 font-medium underline'>
            Change password
          </p>
        </Link>
      </div>
      <div className='relative top-8 flex flex-col  '>
        <div className='flex '>
          <p className='text-sm font-serif font-medium'>Edit your information down below</p>
          <div className='relative left-3 sm:left-36 bottom-3 flex flex-row gap-x-3 sm:gap-x-10'>
            <Button
              text='Cancel'
              className='h-9 rounded-sm'
              isLoading={false}
              onClick={() => navigate(`/profile/${BrowsingUser.username}`)}
            />
            <Button
              text='Done'
              className='h-9 rounded-sm'
              isLoading={isLoadingEdit}
              onClick={() => sumbitEdit()}
            />
          </div>
        </div>
        <div className='flex flex-col self-center relative top-10'>
          <p>Profile Photo</p>
          <div className='flex flex-row'>
            <ProfilePic
              image={profile_pic}
              selectedFile={selectedFile}
              className='relative top-1'
              width='60px'
              height='60px'
            />
            <Button
              text='Change'
              isLoading={false}
              className='rounded-sm h-7 w-11 relative left-3 top-4'
              onClick={triggerFileInput}
            />
            <input
              type="file"
              accept="image/jpg, image/jpeg, image/png"
              ref={hiddenFileInput}
              className='hidden'
              onChange={handleFileInputChange}
            />
          </div>
          <div className='relative top-8'>
            <p>Display name</p>
            <input
              type="text"
              value={nameInput}
              className='relative top-2 bg-gray-800 outline-none rounded-md h-8'
              onChange={handleNameInput}
            />
            {nameError && (
              <p className='text-red-500 text-sm relative top-3'>Must fill display name field!</p>
            )}
            <div className='relative top-9'>
              <p className='='>Bio:</p>
              <textarea
                style={{ whiteSpace: 'pre-wrap' }}
                className='bg-gray-800 outline-none rounded-md w-72 h-31'
                value={bioInput.split('/n')}
                onChange={handleBioInput}
                onKeyDown={handleBioKeyPress}
              />
              <SentimentSatisfiedAltIcon
                onClick={() => toggleEmojis()}
                className='relative right-8 bottom-3 hover:text-gray-200 cursor-pointer'
              />
            </div>
            <div>
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
      </div>
    </div>
  )
}

export default EditProfile