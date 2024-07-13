import React from 'react'
import OpenImage from '../../../shared/componets/OpenImage'


interface props {
    isRecipent?: boolean,
    isSender?: boolean,
    text?: string,
    image?: string
}

const ChatBubble: React.FC<props> = ({ isRecipent, isSender, image, text }) => {
    return (
        <div>
            {isSender ? (
                <div className="chat chat-end ">
                    <div className="chat-bubble p-2 text-white rounded-lg bg-blue-500">
                        {image !== null && (
                            <OpenImage image={image || ''} isProfile={false} />
                        )}
                        {text?.trim() !== "" && (
                            <p>{text}</p>
                        )}
                    </div>
                </div>
            ) : isRecipent && (
                <div className="chat chat-start">
                    <div className="chat-bubble bg-gray-400 p-2 rounded-lg text-white">
                        {image !== null && (
                            <OpenImage image={image || ''} isProfile={false} />
                        )}
                        {text?.trim() !== "" && (
                            <p>{text}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBubble