import React, { useState, useEffect } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer, List, ListItem, ListContainer } from './style'
import Scroll from '../../baseUI/scroll'
import { connect } from 'react-redux'
import {
  getSingerList,
  getHotSingerList,
  changeEeterLoading,
  changePullUpLoading,
  refreshmoreSingerList,
  refreshmoreHotSingerList,
  changePullDownLoading,
  changePageCount
} from './store/actionCreators'
import Loading from '../../baseUI/loading/index'
import LazyLoad, {forceCheck} from 'react-lazyload'

function Singers(props) {
  let [category, setCategory] = useState('')
  let [alpha, setAlpha] = useState('')
  const { singerList, enterLoading, pullDownLoading, pullUpLoading, pageCount } = props
  const { updateDispatch, getHotSingerDispatch, pullupRefreshDispatch, pullDownRefreshDispatch } = props

  useEffect(() => {
    if(!singerList.size) {
      getHotSingerDispatch()
    }
    //eslint-disable-next-line
  }, [])

  let handleUpdateAlpha = (val) => {
    setAlpha(val)
    updateDispatch(category, val)
  }
  let handleUpdateCategory = (val) => {
    setCategory(val)
    updateDispatch(val, alpha)
  }

  const handlePullUp = () => {
    pullupRefreshDispatch(category, alpha , category === '', pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.id+''+index}>
                <div className='img_wrapper'>
                  <LazyLoad placeholder={<img src={require('./singer.png')} width='100%' height="100%" alt="nusic" />}>
                    <img src={`${item.picUrl}?param=300*300`} width='100%' height="100%" alt="nusic" />
                  </LazyLoad>
                </div>
                <span className='name'>{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  return (
    <div>
      <NavContainer>
        <Horizen
        list={categoryTypes}
        title={"分类 (默认热门)"}
        handleClick={handleUpdateCategory}
        oldVal={category}
        ></Horizen>
        <Horizen
        list={alphaTypes}
        title={"首字母:"}
        handleClick={val => handleUpdateAlpha(val)}
        oldVal={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullDownLoading={pullDownLoading}
          pullUpLoading={pullUpLoading}
          onScrol={forceCheck}
        >
          { renderSingerList() }
        </Scroll>
        <Loading show={enterLoading}></Loading> 
      </ListContainer>
    </div>
  )
}

const mapStateToProps = state => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
})

const mapDispatchToProps = dispatch => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList())
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0))
      dispatch(changeEeterLoading(true))
      dispatch(getSingerList(category, alpha))
    },
    pullupRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count+1))
      if (hot) {
        dispatch(refreshmoreHotSingerList())
      } else {
        dispatch(refreshmoreSingerList(category, alpha))
      }
    },
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, alpha))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))