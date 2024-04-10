import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../css/scroll.css";
import { useQuery } from "react-query";
import { FaPlay } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import Spinner from "react-bootstrap/Spinner";
import { IoIosArrowDown } from "react-icons/io";
import { Menu } from "antd";
interface SearchTrack {
  items: {
    album: {
      images: {
        url: string;
      }[];
    };
    artists: {
      id: string;
      name: string;
    }[];
    is_playable: boolean;
    name: string;
    type: string;
    uri: string;
    duration_ms: number;
  }[];
}

interface Category {
  name: string;
  value: boolean;
}

export const SearchMusic = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTrack, setSelectedTrack] = useState();

  const getArtistAlbum = async (search: string) => {
    const response = await axiosSpotify.get(`/search?q=${search}&type=track`);
    return response.data.tracks;
  };
  const {
    data: tracks,
    isLoading,
    refetch,
  } = useQuery<SearchTrack>(
    ["artistAlbums", search],
    () => getArtistAlbum(search),
    {
      enabled: false, // 초기에는 비활성화
    }
  );
  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 동작 중지
    // Search 요청 을 보낸다.
    refetch();
  };

  const goPlayMusic = (track: any) => {
    navigate("/playMusic", {
      state: {
        track,
      },
    });
  };
  const goStudy = async (track: any) => {
    setSelectedTrack(track);
    setIsCategory(true);
    /* 서버에 가사 전송 하기 위함 */
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    const res2 = await axiosApi.post(`/api/support/quiz/category`, res.data);
    const categoriesArray: Category[] = Object.entries(res2.data).map(
      ([name, value]) => ({
        name,
        value: value as boolean,
      })
    );
    setCategories(categoriesArray);
  };
  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "speaking":
        navigate("/speaking", {
          state: {
            track: selectedTrack,
          },
        });
        break;
      case "listening":
        break;
      case "reading":
        break;
      case "vocabulary":
        break;
      case "grammar":
        break;
    }
  };

  return (
    <div className="flex justify-center w-full h-screen">
      {isCategory && (
        <div className="absolute bottom-0 w-[450px] z-10 bg-black rounded-t-2xl">
          <IoIosArrowDown
            onClick={() => setIsCategory(false)}
            className="w-6 h-6 mt-2 ml-4 fill-[#B3B3B3] hover:fill-white"
          />
          <Menu
            theme="dark"
            mode="vertical"
            className="text-lg font-bold bg-black"
            onSelect={handleMenuClick}
            items={categories.map((category, index) => ({
              key: category.name,
              label: `${index + 1}. ${category.name}`,
              disabled: !category.value,
            }))}
          />
        </div>
      )}
      <div
        className={`flex flex-col items-center w-full bg-[black] max-w-[450px] px-8 py-12 ${
          isCategory ? "opacity-45" : "opacity-100"
        }`}
      >
        {/* 검색 창 */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between w-full px-2"
        >
          <div className="relative flex items-center rounded-md">
            <input
              value={search}
              onChange={onChangeInput}
              className="bg-[#282828] rounded-md h-10 p-3 w-72 text-[white]"
            />
            <button type="submit">
              <FaMagnifyingGlass className="w-5 h-5 fill-[white] hover:opacity-60 absolute right-2 bottom-2" />
            </button>
          </div>
          <Link to={"/home"} className="text-decoration-none">
            <span className="text-lg text-white hover:opacity-60">취소</span>
          </Link>
        </form>

        {/* 검색한 가수 앨범 목록*/}
        <div className="w-full px-2 mt-8 overflow-y-auto scrollbar">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center w-full bg-black max-w-[450px] h-full px-3 py-4">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            tracks?.items
              .filter((track) => track.is_playable)
              .map((track, index) => (
                <div
                  key={index}
                  className=" rounded-2xl bg-[#282828]  h-40 mb-4"
                >
                  <div className="flex items-center p-4">
                    <img
                      src={track.album.images[2].url}
                      alt="Album Cover"
                      className="rounded-md"
                    />
                    <div className="flex flex-col justify-between ml-4 ">
                      <span className="text-bold text-[white] ">
                        {track.name.length > 30
                          ? `${track.name.slice(0, 25)}...`
                          : track.name}
                      </span>
                      <span className="text-[#B3B3B3] text-sm font-semibold">
                        {track.artists[0].name}
                      </span>
                      <span className="text-[#B3B3B3] text-sm">
                        {Math.floor(track.duration_ms / 1000 / 60)}:
                        {Math.floor((track.duration_ms / 1000) % 60) < 10
                          ? `0${Math.floor((track.duration_ms / 1000) % 60)}`
                          : Math.floor((track.duration_ms / 1000) % 60)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between px-4">
                    <button
                      onClick={() => goPlayMusic(track)}
                      className="bg-[white] w-32 rounded-2xl h-8 hover:opacity-60 flex items-center justify-center"
                    >
                      <FaPlay className="mr-2" />
                      <span className="font-bold">재생</span>
                    </button>
                    <button
                      onClick={() => goStudy(track)}
                      className="bg-[white] w-32 rounded-2xl h-8 hover:opacity-60 flex items-center justify-center"
                    >
                      <LuPencilLine className="mr-2 fill-black" />
                      <span className="font-bold">공부</span>
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
