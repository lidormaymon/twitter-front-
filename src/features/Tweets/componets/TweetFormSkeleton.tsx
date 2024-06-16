import React from 'react'

const TweetFormSkeleton = () => {
    return (
        <div className="border-b-2 border-gray-600 h-fit w-full shrink relative sm:bottom-5 p-6 animate-pulse">
          <div className="flex flex-row">
            <div className="w-10 h-10 bg-gray-700 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="ml-14 mt-4">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      );
    };

export default TweetFormSkeleton