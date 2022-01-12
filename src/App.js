import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'

function App() {
  return (
    <div className="App">
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <i className="iconfont">&#xe62b;</i>
      <header className="App-header">
        hello react
      </header>
    </div>
  );
}

export default App;
