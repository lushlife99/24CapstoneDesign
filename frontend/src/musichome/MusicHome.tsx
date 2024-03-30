import React, { useState } from "react";

import BgCircle from "../components/BgCircle";
import { FaMagnifyingGlass } from "react-icons/fa6";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";

function MusicHome() {
  const [value, setValue] = useState(0);
  const navigation = useNavigate();
  const settings = {
    //dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <></>,
    nextArrow: <></>,
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigation("/home");
        break;
      case 1:
        //navigation("/word");
        break;
      case 2:
        //navigation("/history");
        break;
      case 3:
        navigation("/setting");
        break;
      default:
        break;
    }
  };
  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen">
      <div className="bg-[#9bd1e5] overflow-hidden w-full max-w-[450px] h-screen relative flex flex-col  border border-black">
        <BgCircle />

        {/* 타이틀*/}
        <div className="z-10 flex items-center justify-between h-16 px-4 bg-white">
          <span className="text-[22px] font-bold">MelLearn</span>
          <FaMagnifyingGlass className="w-6 h-6 hover:text-gray-300" />
        </div>

        {/* 사용자 추천 음악*/}
        <div className="z-10 px-4 mt-8">
          <div className="flex justify-between">
            <span className="text-[20px] font-extrabold">사용자 추천 음악</span>
            <span className="text-[#4B8E96] hover:text-[#6BC2B9]">See all</span>
          </div>
          <div className="slider-container">
            {/* <Slider {...settings}>
              <div className="flex items-center justify-center h-40 mr-4 bg-white">
                <h3>1</h3>
              </div>
              <div>
                <h3>2</h3>
              </div>
              <div>
                <h3>3</h3>
              </div>
              <div>
                <h3>4</h3>
              </div>
              <div>
                <h3>5</h3>
              </div>
              <div>
                <h3>6</h3>
              </div>
            </Slider> */}
          </div>
        </div>

        {/* 인기 가수*/}
        <div className="z-10 flex justify-between px-4 mt-8">
          <span className="text-[20px] font-extrabold">인기 가수</span>
          <span className="text-[#4B8E96] hover:text-[#6BC2B9]"> See all</span>
        </div>

        {/* 인기 음악*/}
        <div className="z-10 flex justify-between px-4 mt-8">
          <span className="text-[20px] font-extrabold">인기 음악</span>
          <span className="text-[#4B8E96] hover:text-[#6BC2B9]"> See all</span>
        </div>

        <div className="bottom-0 left-0 right-0 z-10 w-full ">
          <BottomNavigation showLabels value={value} onChange={handleChange}>
            <BottomNavigationAction label="홈" icon={<HomeIcon />} />
            <BottomNavigationAction label="단어장" icon={<MenuBookIcon />} />
            <BottomNavigationAction label="히스토리" icon={<HistoryIcon />} />
            <BottomNavigationAction label="설정" icon={<SettingsIcon />} />;
          </BottomNavigation>
        </div>
      </div>
    </div>
  );
}

export default MusicHome;
