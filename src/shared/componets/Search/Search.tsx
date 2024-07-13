import { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Link } from 'react-router-dom';
import { getUsers, searchUsers, selectUsers } from '../../../_auth/Slicer/authSlice';
import ProfilePic from '../../../_root/profile/componets/ProfilePic';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch();
  const [queryUsers, setQueryUsers] = useState([])
  const users = useAppSelector(selectUsers)
  const [isClicked, setIsClicked] = useState(false)


  const handleSearchInput = (event: any) => {
    const query = event.target.value
    setSearchQuery(query);
    dispatch(searchUsers(query)).then((res: any) => setQueryUsers(res.payload.usernames))
    console.log(queryUsers);
    
  };

  const navigateProfile = () => {
    setIsClicked(true)
    setSearchQuery('')
  }

  useEffect(() => {
    const clickOutside = ( event: MouseEvent) => {
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
    <div className='sticky top-0 hidden sm:flex'>
      <div className='relative left-5 top-5'>
        <input
          className='pl-12 w-69 h-10 rounded-full bg-gray-800 outline-none'
          placeholder='Search'
          value={isClicked ? '' : searchQuery}
          onChange={handleSearchInput}
        />
        <SearchIcon className='absolute top-2 left-3 text-gray-500' />
      </div>
      
      {/* Display the matching users */}
      <div className=''>
        {searchQuery.trim() !== ''  && (
          <div ref={modalRef} className={`relative top-10 right-[16.8rem] bg-gray-900 rounded-3xl w-68  ${queryUsers.length > 5 && 'overflow-y-scroll h-72 top-14'}`}>
            {queryUsers.map((id: number) => {
              const user = users.find((user) => user.id === id);
              if (user) {
                return (
                  <div key={user.id} className='flex items-center my-5'>
                    <Link
                      to={`profile/${user.username}`}
                      className='hover:bg-gray-600 w-full rounded-3xl'
                      onClick={() => navigateProfile()}>
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
    </div>
  );
}

export default Search;
