import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  
  &:hover {
    color: #764ba2;
  }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
  }

  &.active {
    background: #667eea;
    color: white;
  }
`

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <Nav>
      <NavContent>
        <Logo to={isAdmin ? "/admin" : "/dashboard"}>QRGen</Logo>

        <MobileMenuButton onClick={toggleMenu}>
          ☰
        </MobileMenuButton>

        <NavLinks isOpen={isMenuOpen}>
          {!isAdmin && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isAdmin && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
          <span style={{ color: '#667eea', fontWeight: '600' }}>
            Welcome, {user?.username}
          </span>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </NavLinks>
      </NavContent>
    </Nav>
  )
}

export default Navbar