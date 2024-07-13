import { ImgHTMLAttributes, useEffect, useState } from 'react';
import { API_SERVER_IMAGES } from '../../../lib/api';

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  image: string,
  selectedFile?: File | null
  height?:string,
  width?:string
}

const ProfilePic: React.FC<ImageComponentProps> = ({ image, selectedFile, width, height, className, ...rest }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const getImageUrl = (imagePath: string) => {
    return `${API_SERVER_IMAGES}${imagePath}`;
  };

  useEffect(() => {
    if (selectedFile) {
      // If a new file is selected, display itj
      setImageUrl(URL.createObjectURL(selectedFile));
    } else if (image) {
      // If no new file is selected but an image prop is provided, display the image
      setImageUrl(getImageUrl(image));
    } else {
      setImageUrl(''); // Set to an empty string if no image is provided
    }
  }, [image, selectedFile]);

  return (
    <div>
      <img 
        src={imageUrl} 
        className={`rounded-full ${className}`} 
        width={height ? width : '50px'}
        style={{width:width, height:height}} 
        alt='profile_image' {...rest} 
      />
    </div>
  );
};

export default ProfilePic;
