// SkeletonProfile.tsx


const SkeletonProfile = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="flex flex-row items-center mb-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full mr-6"></div>
        <div>
          <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-36"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-700 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-700 rounded w-48"></div>
      </div>
      <div className="flex flex-row space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="h-6 bg-gray-700 rounded w-12 mb-1"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-6 bg-gray-700 rounded w-12 mb-1"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
