import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Top, Tab, TabItem } from './style'
function Home() {
  return (
    <div>
      <Top>
        <span className='iconfont menu'>&#xe65c;</span>
        <span className='title'>WebApp</span>
        <span className='iconfont search'>&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/" className="/"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="singers" className="/"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="rank" className="/"><TabItem><span>排行</span></TabItem></NavLink>
      </Tab>
      <Outlet />
    </div>
  )
}

export default React.memo(Home)