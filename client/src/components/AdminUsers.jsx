import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const UsersContainer = styled.div`
  padding: 20px 0;
`

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
`

const UsersTable = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr 1fr;
  background: #f8f9fa;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr 1fr;
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "username role"
      "email date"
      "actions actions";
    gap: 10px;
    padding: 20px;
  }
`

const TableCell = styled.div`
  padding: 8px 0;
  color: #666;
  font-weight: ${props => props.bold ? '600' : '400'};
  color: ${props => props.highlight ? '#667eea' : '#666'};

  @media (max-width: 768px) {
    &:nth-child(1) { grid-area: username; }
    &:nth-child(2) { grid-area: email; }
    &:nth-child(3) { grid-area: role; }
    &:nth-child(4) { grid-area: date; }
    &:nth-child(5) { grid-area: actions; }
  }
`

const RoleBadge = styled.span`
  background: ${props => props.role === 'admin' ? '#dc3545' : '#28a745'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#6c757d'};
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users')
      setUsers(response.data.users)
      setFilteredUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Error loading users')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return
    }

    try {
      // Note: You'll need to implement this endpoint in your backend
      await axios.delete(`/api/admin/users/${userId}`)
      alert('User deleted successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Loading users...</div>
      </LoadingSpinner>
    )
  }

  return (
    <UsersContainer>
      <SectionTitle>User Management</SectionTitle>

      <SearchBox>
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBox>

      {filteredUsers.length === 0 ? (
        <EmptyState>
          <h3>No Users Found</h3>
          <p>{searchTerm ? 'No users match your search criteria.' : 'No users registered yet.'}</p>
        </EmptyState>
      ) : (
        <UsersTable>
          <TableHeader>
            <div>Username</div>
            <div>Email</div>
            <div>Role</div>
            <div>Joined</div>
            <div>Actions</div>
          </TableHeader>
          
          {filteredUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell bold highlight>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleBadge role={user.role}>
                  {user.role.toUpperCase()}
                </RoleBadge>
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                {user.role !== 'admin' && (
                  <ActionButton 
                    variant="danger"
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    title="Delete User"
                  >
                    Delete
                  </ActionButton>
                )}
                {user.role === 'admin' && (
                  <span style={{ color: '#999', fontSize: '12px' }}>Protected</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </UsersTable>
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <button 
          className="btn btn-secondary"
          onClick={fetchUsers}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          Refresh
        </button>
      </div>
    </UsersContainer>
  )
}

export default AdminUsers