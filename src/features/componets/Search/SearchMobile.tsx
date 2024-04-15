import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getUsers, searchUsers, selectUsers } from '../../auth/Slicer/authSlice';
import Profile from '../../profile/Profile';
import ProfilePic from '../../profile/componets/ProfilePic';
import { Link } from 'react-router-dom';

const SearchMobile = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useAppDispatch();
    const modalRef = useRef<HTMLDivElement>(null)
    const [queryUsers, setQueryUsers] = useState([])
    const users = useAppSelector(selectUsers)
    const [isClicked, setIsClicked] = useState(false)

    const handleSearchInput = (event: any) => {
        const query = event.target.value
        setSearchQuery(query);
        dispatch(searchUsers(query)).then((res: any) => setQueryUsers(res.payload.usernames))
    };

    useEffect(() => {
      const clickOutside = ( event: MouseEvent ) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setSearchQuery('')
        }
      }

      document.addEventListener('mousedown', clickOutside);
      return () => {
          document.removeEventListener('mousedown', clickOutside);
      };
    }, [])
    

    useEffect(() => {
        dispatch(getUsers())
        if (isClicked) {
            setIsClicked(false)
        }
    }, [queryUsers])
    return (
        <div className='my-container'>
            <div className='relative top-5 left-2 sm:left-0 w-10 sm:w-full'>
                <input
                    id='search-input'
                    className='pl-12 w-82 sm:w-full h-10  rounded-full bg-gray-800 outline-none'
                    placeholder='Search'
                    value={isClicked ? '' : searchQuery}
                    onChange={handleSearchInput}
                />
                <SearchIcon className='absolute top-2 left-3 text-gray-500' />
            </div>

            {/* Display the matching users */}
            <div>
                {searchQuery.trim() !== '' && (
                    <div ref={modalRef}>
                        {queryUsers.length > 0 && (
                            <div  className='relative top-5 left-4  bg-gray-900 rounded-3xl w-68'>
                                {queryUsers.map((id: number) => {
                                    const user = users.find((user) => user.id === id);
                                    if (user) {
                                        return (
                                            <div key={user.id} className='flex items-center my-5 '>
                                                <Link
                                                    to={`/profile/${user.username}`}
                                                    className='hover:bg-gray-600 w-full rounded-3xl'
                                                    onClick={() => setIsClicked(true)}>
                                                    <div className='flex flex-row mx-2 bg'>
                                                        <ProfilePic
                                                            width={'45px'}
                                                            image={user.profile_image}
                                                            alt={`${user.username}'s profile`}
                                                        />
                                                        <p className='relative left-2 top-2'>{user.username}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchMobile