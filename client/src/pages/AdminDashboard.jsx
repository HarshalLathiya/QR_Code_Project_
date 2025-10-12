import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminUsers from '../components/AdminUsers'
import AdminQRCodes from '../components/AdminQRCodes'
import AdminStats from '../components/AdminStats'
import styled from 'styled-components'

const AdminContainer = styled.div`
  padding: 20px 0;
`

const AdminHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`

const AdminSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`

const AdminTabs = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`

const TabHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Tab = styled.button`
  flex: 1;
  padding: 20px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid ${props => props.active ? '#667eea' : 'transparent'};

  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(102, 126, 234, 0.1)'};
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`

const TabContent = styled.div`
  padding: 30px;
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`

const AccessDenied = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
  
  h2 {
    margin-bottom: 20px;
    font-size: 2rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')

  const tabs = [
    { id: 'stats', label: '📊 Dashboard Stats', icon: '📊' },
    { id: 'users', label: '👥 User Management', icon: '👥' },
    { id: 'qrcodes', label: '🔗 QR Code Analytics', icon: '🔗' }
  ]

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <AdminContainer>
        <AccessDenied>
          <h2>🚫 Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <p>This area is restricted to administrators only.</p>
        </AccessDenied>
      </AdminContainer>
    )
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Admin Dashboard 👑</AdminTitle>
        <AdminSubtitle>
          Welcome, {user?.username}! Manage your QR Code Generator platform
        </AdminSubtitle>
      </AdminHeader>

      <AdminTabs>
        <TabHeader>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </Tab>
          ))}
        </TabHeader>

        <TabContent>
          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'qrcodes' && <AdminQRCodes />}
        </TabContent>
      </AdminTabs>
    </AdminContainer>
  )
}

export default AdminDashboard