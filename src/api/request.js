import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance.get("/banner");
};

export const getRecommendListRequest = () => {
  return axiosInstance.get("/personalized");
};

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists/?offset=${count}`);
};

export const getSingerListRequest = (type, area, alpha, count) => {
  return axiosInstance.get(
    `/artist/list?type=${type}&area=${area}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

export const getRankListRequest = () => {
  return axiosInstance.get("/toplist/detail");
};

export const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = (id) => {
  return axiosInstance.get(`/artists?id=${id}`);
};

export const getSongUrl = (id) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};
