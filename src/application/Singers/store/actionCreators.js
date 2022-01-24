import { getSingerListRequest, getHotSingerListRequest } from '../../../api/request'
import * as actionTypes from './constants'
import { fromJS } from 'immutable'

export const changeSingerList = data => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changePageCount = data => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data
})

export const changeEeterLoading = data =>({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const changePullUpLoading = data =>({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
})

export const changePullDownLoading = data =>({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data
})

// 第一次加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
       const data = res.artists
       dispatch(changeSingerList(data))
       dispatch(changeEeterLoading(false))
       dispatch(changePullDownLoading(false))
     }).catch(() => {
       console.log('热门歌手数据获取失败');
     })
  }
}

// 加载更多热门歌手
export const refreshmoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()
    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('热门歌手数据获取失败');
    })
  }
}

// 第一次加载对应类别的歌手
export const getSingerList = (category, area, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, area, alpha, 0).then(res => {
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeEeterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(() => {
      console.log('歌手数据获取失败');
    })
  }
}

// 加载更多歌手
export const refreshmoreSingerList = (category, area, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()
    getSingerListRequest(category, area, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('歌手数据获取失败');
    })
  }
}