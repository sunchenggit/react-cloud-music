import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getRankList } from './store/index'
import { filterIndex } from '../../api/utils'
import {
  Container,
  List,
  ListItem,
  SongList
} from './style'
import { EnterLoading } from '../Singers/style'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading/index'
import { useNavigate, Outlet } from 'react-router-dom'

function Rank(props) {
  const { rankList:list, loading} = props
  const { getRankListDispatch } = props
  let rankList = list ? list.toJS() : []
  const navigate = useNavigate()

  useEffect(() => {
    if(rankList.length === 0) {
      getRankListDispatch()
    }
    //eslint-disable-next-line
  }, [])

  let globalStartindex= filterIndex(rankList)
  let officicalList = rankList.slice(0, globalStartindex)
  let globalList = rankList.slice(globalStartindex)

  const enterDetail = id => {
    navigate(`/rank/${id}`)
  }

  // 这里是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item,index) => {
            return (
              <ListItem key={`${item.coverImgId}_${index}`} tracks={item.tracks} onClick={() => enterDetail(item.id)}>
                <div className='img_wrapper'>
                  <img src={item.coverImgUrl} alt="" />
                  <div className='decorate'></div>
                  <span className='update_frequecy'>{item.updateFrequency}</span>
                </div>
                { renderSongList(item.tracks) }
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = list => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return (
              <li key={`${item.coverImgId}_${index}`}>{index+1}.{item.first}-{item.second}</li>
            )
          })
        }
      </SongList>
    ) : null
  }

  let displayStyle = loading ? {"display": "none"} : { "display": "" }

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className='offical' style={displayStyle}>官方榜</h1>
          { renderRankList(officicalList) }
          <h1 className='offical' style={displayStyle}>全球榜</h1>
          { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
        </div>
      </Scroll>
      <Outlet />
    </Container>
  )
}

const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getRankListDispatch() {
      dispatch(getRankList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))