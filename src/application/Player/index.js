import React, { memo, useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { getSongUrl } from "../../api/request";
import { isEmptyObject, shuffle, findIndex } from "../../api/utils";
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList,
} from "./store/actionCreators";
import MiniPlayer from "./miniPlayer/index";
import NormalPlayer from "./normalPlayer";
import Toast from "../../baseUI/Toast";
import { playMode } from "../../api/config";

function Player(props) {
  const {
    fullScreen,
    playing,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList,
  } = props;
  const {
    toggleFullSreenDispatch,
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
  } = props;
  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const songReady = useRef(true);

  const [modeTxt, setModeText] = useState("");
  const toastRef = useRef();

  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲总时长
  const [duration, setDurction] = useState(0);
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  // 绑定 audo 的ref
  const audioRef = useRef();
  // 记录当前歌曲，以便于下次重渲染时对比是否是一首歌
  const [preSong, setPreSong] = useState({});

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    state ? audioRef.current.play() : audioRef.current.pause();
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
  };

  // 一首歌循环
  const handleloop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
  };

  // 上一曲
  const handlePrev = () => {
    // 播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleloop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 下一曲
  const handleNext = () => {
    // 播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleloop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 修改播放模式
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序播放");
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current // 标记为false
    )
      return;
    let current = playList[currentIndex];
    setPreSong(current);
    songReady.current = false; // 把标记位置为 false， 表示现在新的资源没有缓冲完成不能切歌
    changeCurrentDispatch(current); // 赋值 currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      // 注意，play方法返回的是一个 promise 对象
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true);
    setCurrentTime(0); // 从头开始播放
    setDurction((current.dt / 1000) | 0); // 时长
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = () => {
    songReady.current = true;
    alert("播放出错！");
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // 歌曲播放结束
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleloop();
    } else {
      handleNext();
    }
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          clickPlaying={clickPlaying}
          percent={percent}
          toggleFullScreen={toggleFullSreenDispatch}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          percent={percent}
          toggleFullScreen={toggleFullSreenDispatch}
          onProgressChange={onProgressChange}
          clickPlaying={clickPlaying}
          handlePrev={handlePrev}
          handleNext={handleNext}
          changeMode={changeMode}
          mode={mode}
        />
      )}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeTxt} ref={toastRef}></Toast>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"]),
});

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullSreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(memo(Player));
