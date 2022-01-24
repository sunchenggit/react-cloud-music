import React, { useState, memo, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, TopDesc, Menu } from './style'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index'
import Scroll from '../../baseUI/scroll'
import style from '../../assets/global-style'
import { connect } from 'react-redux'
import { getAlbumList, changeEnterLoading } from './store/actionCreators'
import { isEmptyObject } from '../../api/utils'
import Loading from '../../baseUI/loading'
import SongsList from '../../application/SongsList/index'


export const HEADER_HEIGHT = 45

const Album = function(props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  const [isMarquee, setIsMarquee] = useState(false)
  const headerRef = useRef()
  const handleBack = useCallback(() => {
    setShowStatus(false)
    //eslint-disable-next-line
  }, [])
  const onExit = () => {
    navigate(-1)
  }
  const { currentAlbum:currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props

  useEffect(()=>{
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  let currentAlbum = currentAlbumImmutable.toJS()
  
  const handleScroll = useCallback(pos => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y/minScrollY)
    let headerDom = headerRef.current
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style['theme-color']
      headerDom.style.opacity = Math.min(1, (percent-1)/2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ""
      headerDom.style.opacity = 1
      setTitle('歌单')
      setIsMarquee(false)
    }
  }, [currentAlbum])

  const renderToDesc = () => {
    return (
      <TopDesc>
        <div className='background'>
          <div className='filter'></div>
        </div>
        <div className='img_wrapper'>
          <div className='decorate'></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className='play_count'>
            <i className='iconfont play'>&#xe885;</i>
            <span className='count'>{Math.floor(currentAlbum.subscribedCount/1000)/10}万</span>
          </div>
        </div>
        <div className='desc_wrapper'>
          <div className='title'>{currentAlbum.name}</div>
          <div className='person'>
            <div className='avatar'>
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className='name'>{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }

  const renderToMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={onExit}
    >
      <Container>
        <Header ref={headerRef} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll}>
              <div>
                { renderToDesc() }
                { renderToMenu() }
                <SongsList collectCount={currentAlbum.subscribedCount} showCollect={true} songs={currentAlbum.tracks}></SongsList>
              </div>
            </Scroll>
          ) : null
        }
        { enterLoading ? <Loading></Loading> : null }
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Album))