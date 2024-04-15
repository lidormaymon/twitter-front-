import React, { useEffect, useState } from 'react'
import BackButton from '../componets/BackButton'
import Button from '../componets/Button'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { changePwdAsync, selectUserData } from './Slicer/authSlice'
import { useNavigate } from 'react-router-dom'
import * as icons from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ChangePWD = () => {
  const BrowsingUser = useAppSelector(selectUserData)
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [errorFlag, seterrorFlag] = useState(false)
  const [errorMSG, seterrorMSG] = useState('')
  const [oldPWDInputType, setOldPWDInput] = useState("password")
  const [inputPWD, setinputPWD] = useState("password")
  const [formData, setformData] = useState({
    oldPWD: "",
    newPWD: "",
    conPWD: ""
  })

  const handleFormaDataInput = (event: any) => {
    const { name, value } = event.target
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const toggleOldPWD = () => {
    oldPWDInputType === 'password' ? setOldPWDInput('text') : setOldPWDInput('password')
  }

  const togglePWD = () => {
    inputPWD === 'password' ? setinputPWD('text') : setinputPWD('password')
  }

  useEffect(() => {
    if (!BrowsingUser.is_logged) {
      navigate('/')
    }
  }, [])


  const sumbitEditPWD = async () => {
    seterrorFlag(false)
    if (formData.conPWD.trim() !== '' &&
      formData.newPWD.trim() !== '' &&
      formData.oldPWD.trim() !== '') {
      if (formData.newPWD.valueOf() === formData.conPWD.valueOf()) {
        const oldPWD = formData.oldPWD
        const newPWD = formData.newPWD
        const user_id = BrowsingUser.id
        const username = BrowsingUser.username
        const response = await dispatch(changePwdAsync({ oldPWD, newPWD, user_id, username }))
        if (response.type === 'change/pwd/fulfilled') {
          toast.success('Password has been changed successfully!')
          setTimeout(() => {
          navigate(`/profile/${BrowsingUser.username}`)
          }, 1000)
        } else {
          toast.error("Wrong old password!"),seterrorFlag(true),seterrorMSG('Wrong old password')
        }
      }else seterrorFlag(true), seterrorMSG('New password, and confirm password don\'t match'), toast.error("New password, and confirm password don\'t match")
    } else seterrorFlag(true), seterrorMSG('Must fill all the fields'), toast.error("Must fill all the fields")
  }

  return (
    <div className='mx-5 '>
      <ToastContainer theme='colored' />
      <div className='relative top-6'>
        <BackButton />
      </div>
      <div className='relative top-10 flex flex-col text-center items-center space-y-5 w-full'>
        <h1 className='text-center mt-5 text-lg font-semibold underline'>Change Password</h1>
        <div>
          <p>Old password</p>
          <input
            type={oldPWDInputType}
            className='mt-3 bg-gray-800 rounded-sm h-8 w-50 outline-none'
            name='oldPWD'
            value={formData.oldPWD}
            onChange={handleFormaDataInput}
          />
          {oldPWDInputType === 'password' ? (
            <icons.AiFillEye onClick={() => toggleOldPWD()} className='relative bottom-6 left-44 cursor-pointer' />
          ) : (
            <icons.AiFillEyeInvisible onClick={() => toggleOldPWD()} className='relative bottom-6 left-44 cursor-pointer' />
          )}
        </div>
        <div>
          <p>New password</p>
          <input
            name='newPWD'
            type={inputPWD}
            onChange={handleFormaDataInput}
            value={formData.newPWD}
            className='mt-3 bg-gray-800 rounded-sm h-8 w-50 outline-none'
          />
          {inputPWD === 'password' ? (
            <icons.AiFillEye onClick={() => togglePWD()} className='relative bottom-6 left-44 cursor-pointer' />
          ) : (
            <icons.AiFillEyeInvisible onClick={() => togglePWD()} className='relative bottom-6 left-44 cursor-pointer' />
          )}
        </div>
        <div>
          <p>Confirm password</p>
          <input
            type={inputPWD}
            name='conPWD'
            onChange={handleFormaDataInput}
            value={formData.conPWD}
            className='mt-3 bg-gray-800 rounded-sm h-8 w-50 outline-none'
          />
          {inputPWD === 'password' ? (
            <icons.AiFillEye onClick={() => togglePWD()} className='relative bottom-6 left-44 cursor-pointer' />
          ) : (
            <icons.AiFillEyeInvisible onClick={() => togglePWD()} className='relative bottom-6 left-44 cursor-pointer' />
          )}
        </div>
        <div className='relative bottom-3'>
          {errorFlag && (<p className='text-sm text-red-500 relative bottom-3'>{errorMSG}</p>)}
          <Button
            isLoading={isLoading}
            className='rounded-sm'
            text='Done'
            onClick={() => sumbitEditPWD()}
          />
        </div>
      </div>
    </div>
  )
}
