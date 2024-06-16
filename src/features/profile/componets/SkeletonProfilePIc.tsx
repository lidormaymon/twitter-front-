// SkeletonProfilePic.tsx
import React from 'react';

const SkeletonProfilePic = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="flex flex-row items-center mb-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full mr-6"></div>

      </div>

    </div>
  );
};

export default SkeletonProfilePic;