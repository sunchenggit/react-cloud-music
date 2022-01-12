import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState()
  const scrollContainerRef = useRef()
  const { direction, click, refresh, bounceTop, bounceBottom } = props
  const { pullUp, pullDown, onScroll } = props

  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return() => {
      setBScroll(null)
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!bScroll | !onScroll) return
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if(!bScroll || !pullUp) return
    bScroll.on('scrollEnd', () => {
      // 判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUp()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, bScroll])

  useEffect(() => {
    if (!bScroll || !pullDown) return
    bScroll.on('touchEnd', (pos) => {
      // 判断用户下拉动作
      if (pos.y > 50) {
        pullDown()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [bScroll, pullDown])

  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if(bScroll) {
        return bScroll
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

Scroll.proTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  click: PropTypes.bool,
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  bounceTop: PropTypes.bool,
  bounceBottom: PropTypes.bool
}

export default Scroll