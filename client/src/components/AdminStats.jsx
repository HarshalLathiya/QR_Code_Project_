import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const StatsContainer = styled.div`
  padding: 20px 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`

const StatCard = styled.div`
  background: ${props => props.color || 'linear-gradient(135deg, #667eea, #764ba2)'};
  color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
`

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
`

const ActivityTable = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f8f9fa;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`

const TableCell = styled.div`
  padding: 8px 0;
  color: ${props => props.highlight ? '#667eea' : '#666'};
  font-weight: ${props => props.highlight ? '600' : '400'};
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #667eea;
  font-size: 1.1rem;
`

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin: 20px 0;
`

const AdminStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Loading dashboard statistics...</div>
      </LoadingSpinner>
    )
  }

  if (error) {
    return (
      <ErrorMessage>
        <h3>Error Loading Statistics</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={fetchStats}
          style={{ marginTop: '15px' }}
        >
          Try Again
        </button>
      </ErrorMessage>
    )
  }

  return (
    <StatsContainer>
      <StatsGrid>
        <StatCard color="linear-gradient(135deg, #667eea, #764ba2)">
          <StatNumber>{stats?.total_qr_codes || 0}</StatNumber>
          <StatLabel>Total QR Codes Generated</StatLabel>
        </StatCard>

        <StatCard color="linear-gradient(135deg, #f093fb, #f5576c)">
          <StatNumber>{stats?.total_users || 0}</StatNumber>
          <StatLabel>Registered Users</StatLabel>
        </StatCard>

        <StatCard color="linear-gradient(135deg, #4facfe, #00f2fe)">
          <StatNumber>
            {stats?.recent_activity?.length > 0 ? stats.recent_activity[0].daily_count : 0}
          </StatNumber>
          <StatLabel>QR Codes Today</StatLabel>
        </StatCard>

        <StatCard color="linear-gradient(135deg, #43e97b, #38f9d7)">
          <StatNumber>
            {stats?.recent_activity?.reduce((sum, day) => sum + day.daily_count, 0) || 0}
          </StatNumber>
          <StatLabel>Last 7 Days Total</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle>Recent Activity (Last 7 Days)</SectionTitle>
      
      {stats?.recent_activity?.length > 0 ? (
        <ActivityTable>
          <TableHeader>
            <div>Date</div>
            <div>QR Codes Generated</div>
          </TableHeader>
          
          {stats.recent_activity.map((day, index) => (
            <TableRow key={index}>
              <TableCell highlight>{formatDate(day.date)}</TableCell>
              <TableCell>{day.daily_count} QR Codes</TableCell>
            </TableRow>
          ))}
        </ActivityTable>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>No Recent Activity</h3>
          <p>QR code generation activity will appear here.</p>
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        borderRadius: '15px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '10px' }}>📈 Platform Insights</h3>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Monitor your QR code generation platform's growth and user engagement.
        </p>
      </div>
    </StatsContainer>
  )
}

export default AdminStats