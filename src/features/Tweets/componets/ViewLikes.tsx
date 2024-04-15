import React, { useEffect, useRef } from 'react'
import { fetchTweetLikesAsync, selectViewLikes } from '../slicer/tweetSlice'
import Button from '../../componets/Button'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { FollowListForm } from '../../profile/componets/FollowerListForm'
import CloseIcon from '@mui/icons-material/Close';

interface ViewLikesProps {
    setlikesViewFlag: React.Dispatch<React.SetStateAction<boolean>>
    tweet_id: number
}

export const ViewLikes: React.FC<ViewLikesProps> = ({ tweet_id, setlikesViewFlag }) => {
    const likesDataView = useAppSelector(selectViewLikes)
    const dispatch = useAppDispatch()
    const modalRef = useRef<HTMLDivElement>(null)


    const toggleLikesView = () => {
        setlikesViewFlag(false)
        document.body.classList.remove('overflow-hidden')
    }

    useEffect(() => {
        dispatch(fetchTweetLikesAsync(tweet_id))
    }, [])

    useEffect(() => {
      const handleClickOutside = ( event: MouseEvent ) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setlikesViewFlag(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])
    



    return (
        <div className="fixed inset-0 bg-zinc-700/20 h-screen bottom-40 flex flex-col items-center justify-center z-50">
            <div ref={modalRef} className="bg-black p-4 w-82 sm:w-97 min-h-[200px] h-fit">
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-xl font-semibold">Likes</h2>
                    <CloseIcon onClick={() => toggleLikesView()} className='cursor-pointer' />
                </div>
                {likesDataView.length > 0 ? (
                    <>
                        {likesDataView.map((data, index) => {
                            return (
                                <FollowListForm key={index} user_list_id={data['user_id']} />
                            )
                        })}
                    </>
                ) : (
                    <>
                        <p className='text-center'>No one has liked this tweet yet.</p>
                    </>
                )}
            </div>
        </div>
    )
}
