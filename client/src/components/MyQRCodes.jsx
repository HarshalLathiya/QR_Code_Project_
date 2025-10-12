import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const CodesContainer = styled.div`
  padding: 20px 0;
`

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
`

const CodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`

const CodeCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`

const CodeHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 15px;
`

const CodeName = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.2rem;
  flex: 1;
`

const CodeStyle = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`

const CodeData = styled.p`
  color: #666;
  margin-bottom: 15px;
  word-break: break-all;
  font-size: 14px;
`

const CodeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
`

const CodeDate = styled.span`
  color: #999;
  font-size: 12px;
`

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`

const ColorDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #667eea;
`

const MyQRCodes = () => {
  const [qrCodes, setQrCodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyQRCodes()
  }, [])

  const fetchMyQRCodes = async () => {
    try {
      const response = await axios.get('/api/qr/my-codes')
      setQrCodes(response.data.qrCodes)
    } catch (error) {
      console.error('Error fetching QR codes:', error)
      alert('Error loading your QR codes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Loading your QR codes...</div>
      </LoadingSpinner>
    )
  }

  return (
    <CodesContainer>
      <SectionTitle>My Generated QR Codes</SectionTitle>
      
      {qrCodes.length === 0 ? (
        <EmptyState>
          <h3>No QR Codes Yet</h3>
          <p>Generate your first QR code to see it here!</p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
            All your generated QR codes will be saved here for future reference.
          </p>
        </EmptyState>
      ) : (
        <CodesGrid>
          {qrCodes.map(qr => (
            <CodeCard key={qr.id}>
              <CodeHeader>
                <CodeName>{qr.qr_name}</CodeName>
                <CodeStyle>{qr.qr_style}</CodeStyle>
              </CodeHeader>
              
              <CodeData>
                <strong>Data:</strong> {qr.qr_data}
              </CodeData>

              <ColorPreview>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ColorDot color={qr.qr_color} />
                  <span style={{ fontSize: '12px' }}>QR Color</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ColorDot color={qr.qr_bg_color} />
                  <span style={{ fontSize: '12px' }}>Background</span>
                </div>
              </ColorPreview>

              <CodeMeta>
                <CodeDate>Created: {formatDate(qr.created_at)}</CodeDate>
              </CodeMeta>
            </CodeCard>
          ))}
        </CodesGrid>
      )}
    </CodesContainer>
  )
}

export default MyQRCodes