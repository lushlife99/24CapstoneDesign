import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosApi, { aixosSpotify } from "../api";
import axios from "axios";
import { transcode } from "buffer";

function Callback() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error");
  const code = queryParams.get("code");
  const nav = useNavigate();

  // spotify 내 로컬에 device 설치
  const transferDevice = async (devcieId: string, player: Spotify.Player) => {
    localStorage.setItem("deviceId", devcieId);
    const response = await aixosSpotify.put(`/me/player`, {
      device_ids: [devcieId],
      play: true,
    });
  };

  // access_token으로 유저 정보 조회
  const fetchProfile = async (token: string) => {
    const res = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { id } = res.data;
    console.log("아이디 연동", res.status);
    const script = document.createElement("script");
    script.src = "https:/sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: "MelLearn",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });
      player.addListener("ready", ({ device_id }) => {
        transferDevice(device_id, player);
      });
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("인증", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.connect().then((success) => {
        if (success) {
          console.log(success);
          // dispatch(setSpotifyPlayer(player));
        }
      });
    };

    const response = await axiosApi.post("/api/member/spotifyAccount", null, {
      params: {
        accountId: id,
      },
    });
    if (response.status === 200) {
      //여기서 spotify 장치 추가 코드 하기

      nav("/home");
    }
  };

  // 유저의 access_token 가져오기
  const getToken = async (code: string) => {
    const clientId = "f7d3088794d14901af7c8bf354326039"; //env 파일로
    const codeVerifier = localStorage.getItem("code_verifier");
    const params = new URLSearchParams();

    params.set("client_id", clientId);
    params.set("grant_type", "authorization_code");
    params.set("code", code);
    params.set("redirect_uri", "http://localhost:3000/callback");
    // @ts-ignore
    params.set("code_verifier", codeVerifier);

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    };
    // member access token 가져오기
    const res = await fetch("https://accounts.spotify.com/api/token", payload);
    const { access_token } = await res.json();
    localStorage.setItem("spotify_access_token", access_token);
    // member access_token으로 spotify 프로필 조회
    fetchProfile(access_token);
  };

  useEffect(() => {
    if (error === "access_denied") {
      nav("/");
      return;
    }
    //code가 존재할 시
    // access 토큰 받고 , spotify userID 요청 한 후
    // access 토큰 받아오는 로직
    if (code) {
      getToken(code);
    }
  }, []);

  return <></>;
}

export default Callback;
