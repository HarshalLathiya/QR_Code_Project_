import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import QRGenerator from '../components/QRGenerator'
import ContactForm from '../components/ContactForm'
import MyQRCodes from '../components/MyQRCodes'
import styled from 'styled-components'

const DashboardContainer = styled.div`
  padding: 20px 0;
`

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`

const TabContainer = styled.div`
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

  @media (max-width: 768px) {
    padding: 20px;
  }
`

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('generate')

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  const tabs = [
    { id: 'generate', label: 'Generate QR Code' },
    { id: 'my-codes', label: 'My QR Codes' },
    { id: 'contact', label: 'Contact Admin' }
  ]

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user?.username}! 👋</WelcomeTitle>
        <WelcomeSubtitle>
          Create beautiful QR codes for your websites, contacts, and more
        </WelcomeSubtitle>
      </WelcomeSection>

      <TabContainer>
        <TabHeader>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabHeader>

        <TabContent>
          {activeTab === 'generate' && <QRGenerator />}
          {activeTab === 'my-codes' && <MyQRCodes />}
          {activeTab === 'contact' && <ContactForm />}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  )
}

export default Dashboard