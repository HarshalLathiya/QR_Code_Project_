import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.8rem;
`

const SectionDescription = styled.p`
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
`

const ContactFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #c3e6cb;
  margin-bottom: 20px;
`

const ContactForm = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://formspree.io/f/mnnggeql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user.username,
          email: user.email,
          message: `Subject: ${formData.subject}\nPriority: ${formData.priority}\n\n${formData.message}`
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          subject: '',
          message: '',
          priority: 'medium'
        })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <ContactContainer>
        <SuccessMessage>
          <h3>✅ Message Sent Successfully!</h3>
          <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setSubmitted(false)}
            style={{ marginTop: '15px' }}
          >
            Send Another Message
          </button>
        </SuccessMessage>
      </ContactContainer>
    )
  }

  return (
    <ContactContainer>
      <SectionTitle>Contact Admin</SectionTitle>
      <SectionDescription>
        Have questions, feedback, or need assistance? Send a message to our admin team. 
        We're here to help you!
      </SectionDescription>

      <ContactFormStyled onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            value={user?.username}
            disabled
            style={{ background: '#f8f9fa', color: '#666' }}
          />
        </div>

        <div className="form-group">
          <label>Your Email</label>
          <input
            type="email"
            value={user?.email}
            disabled
            style={{ background: '#f8f9fa', color: '#666' }}
          />
        </div>

        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this regarding?"
            required
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please describe your issue or question in detail..."
            rows="6"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.subject || !formData.message}
        >
          {loading ? 'Sending...' : 'Send Message to Admin'}
        </button>
      </ContactFormStyled>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>💡 Quick Tips</h4>
        <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
          <li>Be specific about your issue or question</li>
          <li>Include relevant details about QR code problems</li>
          <li>We typically respond within 24 hours</li>
          <li>For urgent matters, select "Urgent" priority</li>
        </ul>
      </div>
    </ContactContainer>
  )
}

export default ContactForm