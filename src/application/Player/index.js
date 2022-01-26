import React, { memo } from 'react'
import { connect } from 'react-redux'
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList
} from './store/actionCreators'
import MiniPlayer from './miniPlayer/index'
import NormalPlayer from './normalPlayer'

function Player (props) {
  const { fullScreen } = props
  const { toggleFullSreenDispatch } = props
  const currentSong = {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }
  return (
    <div>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullSreenDispatch}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullSreenDispatch}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    },
    toggleFullSreenDispatch(data) {
      dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data))
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(Player))