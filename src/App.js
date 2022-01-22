import React from 'react'
import { Provider } from 'react-redux'
import store from './store/index'
import { Routes, Route } from 'react-router-dom'
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'
import Home from './application/Home/index'
import Recommend from './application/Recommend/index'
import Singers from './application/Singers/index'
import Rank from './application/Rank/index'
import Album from './application/Album/index'

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Recommend />} />
          <Route path="recommend" element={<Recommend />}>
            <Route path=":id" element={<Album />}></Route>
          </Route>
          <Route path="Singers" element={<Singers />}></Route>
          <Route path="Rank" element={<Rank />}></Route>
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
