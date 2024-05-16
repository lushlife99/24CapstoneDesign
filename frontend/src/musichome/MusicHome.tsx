import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../css/slider.css";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { fetchArtistData } from "../redux/artist/artistAction";
import { useQuery } from "react-query";
import { setArtistData } from "../redux/artist/artistSlice";
import { fetchChartData } from "../redux/chart/chartAction";
import { setChartData } from "../redux/chart/chartSlice";
import { fetchMetaData } from "../redux/trackMeta/trackMetaAction";
import { setTrackMetaData } from "../redux/trackMeta/trackMetaSlice";
import { fetchRecommendData } from "../redux/recommend/recommendAction";
import { setRecommendData } from "../redux/recommend/recommendSlice";
import axiosApi from "../api";

interface Member {
  id: number;
  langType: string;
  level: string;
  levelPoint: number;
  memberId: string;
  name: string;
}
interface Artist {
  id: string;
  type: string;
  name: string;
  shareUrl: string;
  visuals: {
    avatar: {
      url: string;
    }[];
  };
}

function MusicHome() {
  const [page, setPage] = useState(0);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [member, setMember] = useState<Member>(); //멤버 정보 데이터
  const [langType, setLangType] = useState();

  const getMember = async () => {
    const res = await axiosApi.get("/api/member/info");
    if (res.status === 200) {
      setMember(res.data);
      setLangType(res.data.langType);
    }
  };

  useEffect(() => {
    getMember();
  }, []);
  useEffect(() => {}, [langType]);

  const { data: chartData, isLoading: chartLoading } = useQuery(
    ["chart", langType],
    () => fetchChartData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setChartData(data));
      },
    }
  );

  const { data: artistData, isLoading: artistLoading } = useQuery(
    ["artists", langType],
    () => fetchArtistData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setArtistData(data));
      },
    }
  );
  const { data: recommendData, isLoading: recommendLoading } = useQuery(
    ["recommends", langType],
    () => fetchRecommendData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setRecommendData(data));
      },
      staleTime: 1800000,
    }
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(newValue);
    switch (newValue) {
      case 0:
        //home
        navigation("/home");
        break;
      case 1:
        //모의고사
        navigation("/compQuiz");
        break;
      case 2:
        //히스토리
        navigation("/history");
        break;
      case 3:
        //설정
        navigation("/setting");
        break;
      default:
        break;
    }
  };

  const goDetailArtist = (artist: Artist) => {
    navigation(`/main4?artistId=${artist.id}`, {
      state: { artist },
    });
  };

  const goPlayMusic = async (track: any) => {
    const metaData = await fetchMetaData(track.id);
    dispatch(setTrackMetaData(metaData));

    navigation("/playMusic", {
      state: {
        track,
      },
    });
  };
  if (chartLoading || artistLoading || recommendLoading) {
    return (
      <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen">
        <div className="relative bg-[black] overflow-hidden w-full max-w-[450px] h-screen  flex flex-col ">
          <div className="flex items-center justify-center h-[300%]">
            <Spinner className="border" variant="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[white] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="relative bg-black overflow-hidden w-full sm:max-w-[450px] h-screen flex sm:flex-col ">
        <BottomNavigation
          className="bg-black  sm:fixed sm:bottom-0 sm:w-full"
          showLabels
          value={page}
          onChange={handleChange}
        >
          <BottomNavigationAction
            className="text-white hover:opacity-60 "
            label="홈"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            className="text-white hover:opacity-60"
            label="모의고사"
            icon={<MenuBookIcon />}
          />
          <BottomNavigationAction
            className="text-white hover:opacity-60"
            label="히스토리"
            icon={<HistoryIcon />}
          />
          <BottomNavigationAction
            className="text-white hover:opacity-60"
            label="설정"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>

        {/* 타이틀*/}
        <div className="flex items-center justify-between h-16 px-3 mb-2 bg-black ">
          <span className="px-2 text-3xl font-bold text-white">MelLearn</span>
          <FaMagnifyingGlass
            onClick={() => navigation("/home/main5")}
            className="w-5 h-5 hover:opacity-60 fill-white"
          />
        </div>
        <div className="h-[85%] overflow-y-auto scrollbar">
          {/* 사용자 추천 음악*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between">
              <span className="px-2 text-xl font-extrabold text-white">
                사용자 추천 음악
              </span>
              <Link
                to={"/home/main6"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none"
              >
                모두 보기
              </Link>
            </div>
            <Swiper
              spaceBetween={10}
              slidesPerView={1.6}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {recommendData?.recommends.slice(0, 10).map((track, index) => (
                <SwiperSlide
                  key={index}
                  className="bg-black swiper-slide-mid hover:opacity-60"
                  onClick={() => {
                    goPlayMusic(track);
                  }}
                >
                  <img
                    src={track.album.images[0].url}
                    className="p-2 "
                    alt="Album Cover"
                  />
                  <span className="px-3 overflow-hidden text-lg font-extrabold text-white whitespace-nowrap overflow-ellipsis">
                    {track.name}
                  </span>
                  <div className="flex px-3 overflow-hidden overflow-ellipsis">
                    {track.artists.length < 3 ? (
                      track.artists.map((artist, index) => (
                        <span
                          key={index}
                          className=" text-[#93989D] font-semibold text-sm whitespace-nowrap "
                        >
                          {artist.name}
                          {index !== track.artists.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className=" text-[#93989D] font-semibold text-sm">
                        Various Artists
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 인기 가수*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between ">
              <span className="px-2 text-xl font-extrabold text-white">
                인기 가수
              </span>

              <Link
                to={"/home/main3"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none "
              >
                모두 보기
              </Link>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={3.3}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {artistData?.artists.slice(0, 10).map((artist, index) => (
                <SwiperSlide
                  key={index}
                  className="bg-black swiper-slide-mini hover:opacity-60 "
                  onClick={() => goDetailArtist(artist)}
                >
                  <img
                    src={artist.visuals.avatar[0].url}
                    alt="Artist Cover"
                    className="p-2 "
                  />
                  <span className="pb-3 text-sm font-extrabold text-white">
                    {artist.name}
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 인기 음악*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between ">
              <span className="px-2 text-xl font-extrabold text-white">
                인기 음악
              </span>

              <Link
                to={"/home/main2"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none"
              >
                모두 보기
              </Link>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={2.1}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {chartData?.tracks.slice(0, 10).map((track, index) => (
                <SwiperSlide
                  key={index}
                  className="bg-black swiper-slide-mid hover:opacity-60"
                  onClick={() => {
                    goPlayMusic(track);
                  }}
                >
                  <img
                    src={track.album.images[0]?.url}
                    className="p-2"
                    alt="Album Cover"
                  />
                  <span className="px-3 overflow-hidden text-lg font-extrabold text-white whitespace-nowrap overflow-ellipsis">
                    {track.name}
                  </span>
                  <div className="flex px-3 overflow-hidden overflow-ellipsis">
                    {track.artists.length < 3 ? (
                      track.artists.map((artist, index) => (
                        <span
                          key={index}
                          className=" text-[#93989D] font-semibold text-sm whitespace-nowrap "
                        >
                          {artist.name}
                          {index !== track.artists.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className=" text-[#93989D] font-semibold text-sm">
                        Various Artists
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* <div className="bottom-0 left-0 right-0 z-10 w-full "> */}

        {/* </div> */}
      </div>
    </div>
  );
}

export default MusicHome;
