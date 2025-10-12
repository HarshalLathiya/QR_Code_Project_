import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import styled from 'styled-components'

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 20px 0;
`

const Layout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <Main>
        <div className="container">
          <Outlet />
        </div>
      </Main>
    </LayoutContainer>
  )
}

export default Layout