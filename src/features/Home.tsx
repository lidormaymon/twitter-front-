import { useEffect, useState } from "react";
import FollowingTweets from "./Tweets/FollowingTweets";
import RecentTweets from "./Tweets/RecentTweets";
import { getUsers, selectLoggedStatus } from "./auth/Slicer/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {  selectNewTweet } from "./Tweets/slicer/tweetSlice";
import { PostTweet } from "./Tweets/componets/PostTweet";


interface HeaderProps {
  activeTab: string;
  handleTabClick: any;
}

const Header = ({ activeTab, handleTabClick }: HeaderProps) => {
  const isLogged = useAppSelector(selectLoggedStatus)
  return (
    <div className={`sticky top-9 sm:top-0 h-fit self-start z-[45] bg-black sm:border-r-1 border-gray-600 container  w-full sm:w-105 3xl:w-108`}>
      <div className="sticky top-0 ">
        <div className="border-b border-gray-600">
          <h1 className="font-bold font- text-xl mx-2 px-2 py-4">Home</h1>
          <div className="container flex flex-row">
            <div
              className={`${isLogged === true ? 'w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600' : 'w-full p-4 py-5 cursor-pointer hover:bg-gray-600'} `}
              onClick={() => handleTabClick("forYou")}
            >
              <div className="flex flex-col">
                <p className={`text-center ${activeTab === 'forYou' ? "text-white relative" : "text-gray-400"}`}>For you</p>
                <div className="flex flex-row w-full justify-center ">
                  <div className={`${activeTab === 'forYou' && "w-14 h-2 rounded-full bg-blue-500 center relative top-5  sm:top-5 "}
                  ${!isLogged && 'w-14 h-2 rounded-full bg-blue-500  relative top-5 sm:top-5'}`}></div> {/* this div */}
                </div>
              </div>
            </div>
            {isLogged && (
              <div
                className={`w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600 `}
                onClick={() => handleTabClick("following")}
              >
                <div>
                  <p className={`text-center ${activeTab !== 'forYou' ? "text-white" : "text-gray-400"}`}>Following</p>
                  <div className="flex flex-row self w-full justify-center">
                    <div className={`${activeTab !== 'forYou' && "w-14 h-2 rounded-full bg-blue-500  relative top-5 sm:top-5"}`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useAppDispatch()
  const newTweet = useAppSelector(selectNewTweet)
  const isLogged = useAppSelector(selectLoggedStatus)
  const [activeTab, setActiveTab] = useState("forYou")
  


  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  };


  useEffect(() => {
    dispatch(getUsers())
  }, [])




  return (
    <div>
      <Header activeTab={activeTab} handleTabClick={handleTabClick} />
      {isLogged && (
        <PostTweet underline={true} />
      )}
      <div className="relative top-5">
        {activeTab === "forYou" ? <RecentTweets  /> : <FollowingTweets  />}
      </div>
    </div>
  );
};

export default Home;