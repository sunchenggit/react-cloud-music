import React, { useState, useEffect } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { useNavigate, Outlet } from 'react-router-dom'
import { categoryTypes, alphaTypes, categoryAreas } from '../../api/config'
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
  let [category, setCategory] = useState('-1')
  let [area, setArea] = useState('-1')
  let [alpha, setAlpha] = useState('')
  const { singerList, enterLoading, pullDownLoading, pullUpLoading, pageCount } = props
  const { updateDispatch, getHotSingerDispatch, pullupRefreshDispatch, pullDownRefreshDispatch } = props
  const navigate = useNavigate()

  useEffect(() => {
    if(!singerList.size) {
      getHotSingerDispatch()
    }
    //eslint-disable-next-line
  }, [])

  let handleUpdateAlpha = (val) => {
    setAlpha(val)
    updateDispatch(category, area, val)
  }

  let handleUpdateCategory = (val) => {
    setCategory(val)
    updateDispatch(val, area, alpha)
  }

  let handleUpdateArea = (val) => {
    setArea(val)
    updateDispatch(category, val, alpha)
  }

  const handlePullUp = () => {
    pullupRefreshDispatch(category, area, alpha, pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, area, alpha)
  }

  const enterDetial = id => {
    navigate(`/singers/${id}`)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.id+''+index} onClick={() => enterDetial(item.id)}>
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
          title={"?????? (????????????)"}
          handleClick={handleUpdateCategory}
          oldVal={category}
        ></Horizen>

        <Horizen
          list={categoryAreas}
          title={"?????? (????????????)"}
          handleClick={handleUpdateArea}
          oldVal={area}
        ></Horizen>
        
        <Horizen
          list={alphaTypes}
          title={"?????????:"}
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

        <Outlet />
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
    updateDispatch(category, area, alpha) {
      dispatch(changePageCount(0))
      dispatch(changeEeterLoading(true))
      dispatch(getSingerList(category, area, alpha))
    },
    pullupRefreshDispatch(category, area, alpha, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count+1))
      if (category === '' && alpha === '') {
        dispatch(refreshmoreHotSingerList())
      } else {
        dispatch(refreshmoreSingerList(category, area, alpha))
      }
    },
    pullDownRefreshDispatch(category, area, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, area, alpha))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))