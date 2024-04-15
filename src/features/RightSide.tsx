import React from 'react'
import Search from './componets/Search/Search'

export const RightSide = () => {
  return (
    <div className='sm:sticky sm:top-0 h-fit self-start z-40 hidden xl:block'>
      <div className="relative top-5">
        <Search />
      </div>
    </div>
  )
}

export default RightSide;