import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
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
        <NavLink to="/" activeClassName="/"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="singers" activeClassName="/"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="rank" activeClassName="/"><TabItem><span>排行</span></TabItem></NavLink>
      </Tab>
      <Outlet />
    </div>
  )
}

export default React.memo(Home)