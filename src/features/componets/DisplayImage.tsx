import React, { ImgHTMLAttributes, useEffect, useState } from 'react'
import { API_SERVER_IMAGES } from '../../lib/api';

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
    image: string,
}

const DisplayImage: React.FC<ImageComponentProps> = ({ image }) => {

    const [imageUrl, setImageUrl] = useState<string>('');

    const getImageUrl = (imagePath: string) => {
        return `${API_SERVER_IMAGES}${imagePath}`;
    }
    
    useEffect(() => {
        if (image) {
            setImageUrl(image)
        } else setImageUrl('')
    }, [image])
    return (
        <>
            {imageUrl && (
                <img src={getImageUrl(imageUrl)} className="h-30" />
            )}
        </>
    )
}

export default DisplayImage