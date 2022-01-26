import React, {  forwardRef, memo } from "react";
import styled, { keyframes } from "styled-components";
import style from "../../assets/global-style"
import PropTypes from 'prop-types'

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`

const marquee = keyframes`
  from {
    left: 100%;
    transform: translateX(100%);
  }
  to {
    left: -100%;
    transform: translateX(-100%);
  }
`

const Marquee = styled.div`
 width: 100%;
 height: 35px; 
 overflow: hidden; 
 position: relative; 
 white-space: nowrap;
 .text { 
   position: absolute; 
   animation: ${marquee} 10s linear infinite; 
  }
`

// 处理函数拿不到 ref 的问题，所以用forwardRef
const Header = forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back"  onClick={handleClick}>&#xe655;</i>
      { isMarquee ? <Marquee><h1>{title}</h1></Marquee> : <h1>{title}</h1> }
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => {},
  title: '标题',
  isMarquee: false
}

Headers.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool
}

export default memo(Header)