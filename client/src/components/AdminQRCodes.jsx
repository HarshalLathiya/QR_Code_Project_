import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const QRCodesContainer = styled.div`
  padding: 20px 0;
`

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
`

const QRCodesTable = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  background: #f8f9fa;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.3s ease;
  align-items: center;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
      "user name style"
      "data data data"
      "date color actions";
    gap: 10px;
    padding: 20px;
  }
`

const TableCell = styled.div`
  padding: 8px 0;
  color: #666;
  font-weight: ${props => props.bold ? '600' : '400'};
  color: ${props => props.highlight ? '#667eea' : '#666'};
  word-break: break-word;

  @media (max-width: 1024px) {
    &:nth-child(1) { grid-area: user; }
    &:nth-child(2) { grid-area: name; }
    &:nth-child(3) { grid-area: data; }
    &:nth-child(4) { grid-area: style; }
    &:nth-child(5) { grid-area: date; }
    &:nth-child(6) { grid-area: actions; }
  }
`

const StyleBadge = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
`

const ColorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 1px solid #ddd;
`

const ActionButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #667eea;
  font-size: 1.1rem;
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

const SearchBox = styled.div`
  margin-bottom: 20px;
  
  input {
    width: 100%;
    max-width: 400px;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
`

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`

const FilterButton = styled.button`
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 2px solid #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  }
`

const AdminQRCodes = () => {
  const [qrCodes, setQrCodes] = useState([])
  const [filteredQRCodes, setFilteredQRCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchQRCodes()
  }, [])

  useEffect(() => {
    let filtered = qrCodes

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(qr =>
        qr.qr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.qr_data.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.qr_style.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(qr => qr.qr_style === filter)
    }

    setFilteredQRCodes(filtered)
  }, [searchTerm, filter, qrCodes])

  const fetchQRCodes = async () => {
    try {
      const response = await axios.get('/api/admin/qr-codes')
      setQrCodes(response.data.qrCodes)
      setFilteredQRCodes(response.data.qrCodes)
    } catch (error) {
      console.error('Error fetching QR codes:', error)
      alert('Error loading QR codes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteQR = async (qrId, qrName) => {
    if (!window.confirm(`Are you sure you want to delete QR code "${qrName}"? This action cannot be undone.`)) {
      return
    }

    try {
      // Note: You'll need to implement this endpoint in your backend
      await axios.delete(`/api/admin/qr-codes/${qrId}`)
      alert('QR Code deleted successfully')
      fetchQRCodes() // Refresh the list
    } catch (error) {
      console.error('Error deleting QR code:', error)
      alert('Error deleting QR code')
    }
  }

  const styles = ['all', 'standard', 'rounded', 'dots', 'square', 'classy', 'extras']

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Loading QR codes...</div>
      </LoadingSpinner>
    )
  }

  return (
    <QRCodesContainer>
      <SectionTitle>QR Code Analytics</SectionTitle>

      <SearchBox>
        <input
          type="text"
          placeholder="Search QR codes by name, data, user, or style..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBox>

      <FilterBar>
        <span style={{ fontWeight: '600', color: '#333' }}>Filter by style:</span>
        {styles.map(style => (
          <FilterButton
            key={style}
            active={filter === style}
            onClick={() => setFilter(style)}
          >
            {style === 'all' ? 'All Styles' : style}
          </FilterButton>
        ))}
      </FilterBar>

      {filteredQRCodes.length === 0 ? (
        <EmptyState>
          <h3>No QR Codes Found</h3>
          <p>{searchTerm || filter !== 'all' ? 'No QR codes match your search criteria.' : 'No QR codes generated yet.'}</p>
        </EmptyState>
      ) : (
        <QRCodesTable>
          <TableHeader>
            <div>User</div>
            <div>QR Name</div>
            <div>QR Data</div>
            <div>Style</div>
            <div>Generated</div>
            <div>Actions</div>
          </TableHeader>
          
          {filteredQRCodes.map(qr => (
            <TableRow key={qr.id}>
              <TableCell>
                <div style={{ fontWeight: '600', color: '#667eea' }}>{qr.username}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{qr.email}</div>
              </TableCell>
              <TableCell bold>{qr.qr_name}</TableCell>
              <TableCell>
                <div style={{ 
                  maxWidth: '200px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {qr.qr_data}
                </div>
              </TableCell>
              <TableCell>
                <StyleBadge>{qr.qr_style}</StyleBadge>
                <ColorPreview>
                  <ColorDot color={qr.qr_color} />
                  <ColorDot color={qr.qr_bg_color} />
                </ColorPreview>
              </TableCell>
              <TableCell>{formatDate(qr.created_at)}</TableCell>
              <TableCell>
                <ActionButton 
                  onClick={() => handleDeleteQR(qr.id, qr.qr_name)}
                  title="Delete QR Code"
                >
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </QRCodesTable>
      )}

      <div style={{ 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        <div>
          Showing {filteredQRCodes.length} of {qrCodes.length} QR codes
        </div>
        <button 
          className="btn btn-secondary"
          onClick={fetchQRCodes}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          Refresh
        </button>
      </div>
    </QRCodesContainer>
  )
}

export default AdminQRCodes