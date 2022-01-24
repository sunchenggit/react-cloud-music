import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Container, ImgWrapper, CollectButton, BgLayer, SongListWrapper } from './style'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header'
import SongsList from '../../application/SongsList/index'
import Scroll from '../../baseUI/scroll/index'
import { HEADER_HEIGHT } from '../../api/config'
import { changeEnterLoading, getSingerInfo } from './store/actionCretaors'
import { connect } from 'react-redux'
import Loading from '../../baseUI/loading'

function Singer (props) {
  const [showStatus, setShowStatus] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()
  const handleExited = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const goBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  //图片初始化g高度
  const initalheight = useRef(0)
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  useEffect(() => {
    getSingerDataDispatch(id)
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h-OFFSET}px`
    initalheight.current = h;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h-OFFSET}px`
    songScroll.current.refresh()
    //eslint-disable-next-line
  }, [])

  const { artist: immutableArtist, songs: immutableSongs, loading} = props
  const { getSingerDataDispatch } = props
  const artist = immutableArtist.toJS()
  const songs = immutableSongs.toJS()
  
  const handleScroll = useCallback((pos) => {
    let height = initalheight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
    // 指的是滑动的距离占图片高度的百分比
    const percent = Math.abs(newY / height)
    // 1. 处理往下来的情况，效果图片放大，按钮跟着偏移
    if (newY > 0) {
      imageDOM.style['transform'] = `scale(${1 + percent})`;
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } else if (newY >= minScrollY) {
      // 2. 往上滑动免单税遮罩还没超过header 部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      // 这时候保证遮罩的层级有限级比图片高，不至于被图片遮住
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      // 按钮跟着移动且渐渐透明
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style["opacity"] = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      //3. 往上滑动但是遮罩超过Header部分
      // 往上滑动，但是超过header部分
      layerDOM.style.top = `{HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 放置溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99
    }
  }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames='fly'
      appear={true}
      unmountOnExit
      onExited={handleExited}
    >
      <Container>
        <Header title="头部" handleClick={goBack} ref={header}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className='filter'></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className='iconfont'>&#xe62d;</i>
          <span className='text'>收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList songs={songs} showCollect={false}></SongsList>
          </Scroll>
        </SongListWrapper>
        { loading ? <Loading></Loading> : null }
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(['singerInfo', 'artist']),
  songs: state.getIn(['singerInfo', 'songsOfArtist']),
  loading: state.getIn(['singerInfo', 'loading'])
})

const mapDispatchToProps = dispatch=>{
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Singer))