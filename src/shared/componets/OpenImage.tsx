import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import TweetImage from "./DisplayImage";
import ProfilePic from '../../_root/profile/componets/ProfilePic';

interface OpenImageProps {
    image: string
    isProfile: boolean,
    width?:string
}

const OpenImage: React.FC<OpenImageProps> = ({ image, isProfile, width }) => {
    const [togglePic, setTogglePic] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)


    const openPic = () => {
        if (togglePic) {
            setTogglePic(false)
            document.body.classList.remove('overflow-hidden')
        } else {
            setTogglePic(true)
            document.body.classList.add('overflow-hidden')
        }
    }

    useEffect(() => {
        const handleOutsideClick = ( event: MouseEvent ) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setTogglePic(false)
                document.body.classList.remove('overflow-hidden')
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])
    

    return (
        <div>
            {isProfile ?
                <button onClick={() => openPic()}>
                    <ProfilePic className="w-18 sm:w-24" image={image} width={width} />
                </button> :
                <button onClick={()=> openPic()}>
                    <TweetImage className="relative w-[200px] sm:w-[300px] top-24" image={image} />
                </button>
            }
            {togglePic && (
                <div className="fixed inset-0 bg-zinc-700/20  z-50">
                    <div ref={modalRef} className="absolute left-18 top-24  xl:left-[650px] ">
                        <CloseIcon onClick={() => openPic()} className="cursor-pointer fixed right-16 " />
                        {isProfile ?
                            <ProfilePic className="relative w-[200px] sm:w-[300px] top-24" image={image} /> :
                            <TweetImage className="relative w-[200px] sm:w-[300px] top-24" image={image} />
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default OpenImage