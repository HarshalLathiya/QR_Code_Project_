import React, { useState, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import axios from 'axios'
import styled from 'styled-components'

const GeneratorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const QRPreview = styled.div`
  background: white;
  border: 2px dashed #e9ecef;
  border-radius: 15px;
  padding: 20px;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  canvas {
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
`

const StyleOption = styled.button`
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e9ecef'};
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }

  &.standard {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }

  &.rounded {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    border-radius: 20px;
  }

  &.dots {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
  }

  &.square {
    background: linear-gradient(135deg, #43e97b, #38f9d7);
    color: white;
  }

  &.classy {
    background: linear-gradient(135deg, #fa709a, #fee140);
    color: white;
  }

  &.extras {
    background: linear-gradient(135deg, #a8edea, #fed6e3);
    color: #333;
  }
`

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const QRGenerator = () => {
  const [formData, setFormData] = useState({
    qr_name: '',
    qr_data: '',
    qr_style: 'standard',
    qr_color: '#000000',
    qr_bg_color: '#FFFFFF'
  })
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const qrRef = useRef()

  const styles = [
    { id: 'standard', label: 'Standard', className: 'standard' },
    { id: 'rounded', label: 'Rounded', className: 'rounded' },
    { id: 'dots', label: 'Dots', className: 'dots' },
    { id: 'square', label: 'Square', className: 'square' },
    { id: 'classy', label: 'Classy', className: 'classy' },
    { id: 'extras', label: 'Extras', className: 'extras' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleStyleChange = (style) => {
    setFormData({
      ...formData,
      qr_style: style
    })
  }

  const generateQRCode = async () => {
    if (!formData.qr_name || !formData.qr_data) {
      alert('Please enter QR name and data')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/qr/generate', formData, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      setQrCode(url)
    } catch (error) {
      console.error('QR generation error:', error)
      alert('Error generating QR code')
    }

    setLoading(false)
  }

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a')
      link.href = qrCode
      link.download = `${formData.qr_name || 'qr-code'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const saveQRCode = async () => {
    if (!formData.qr_name || !formData.qr_data) {
      alert('Please enter QR name and data')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/qr/save', formData)
      alert('QR Code saved successfully!')
      
      // Reset form
      setFormData({
        qr_name: '',
        qr_data: '',
        qr_style: 'standard',
        qr_color: '#000000',
        qr_bg_color: '#FFFFFF'
      })
      setQrCode(null)
      if (qrRef.current) {
        qrRef.current.innerHTML = ''
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving QR code')
    }

    setLoading(false)
  }

  return (
    <GeneratorContainer>
      <FormSection>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Create QR Code</h2>
        
        <div className="form-group">
          <label>QR Code Name *</label>
          <input
            type="text"
            name="qr_name"
            value={formData.qr_name}
            onChange={handleChange}
            placeholder="e.g., My Website QR"
            required
          />
        </div>

        <div className="form-group">
          <label>QR Code Data *</label>
          <textarea
            name="qr_data"
            value={formData.qr_data}
            onChange={handleChange}
            placeholder="Enter URL, text, or any data..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>QR Code Style</label>
          <StyleGrid>
            {styles.map(style => (
              <StyleOption
                key={style.id}
                selected={formData.qr_style === style.id}
                className={style.className}
                onClick={() => handleStyleChange(style.id)}
              >
                {style.label}
              </StyleOption>
            ))}
          </StyleGrid>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>QR Color</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ColorInput
                type="color"
                name="qr_color"
                value={formData.qr_color}
                onChange={handleChange}
              />
              <span style={{ marginLeft: '10px' }}>{formData.qr_color}</span>
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Background Color</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ColorInput
                type="color"
                name="qr_bg_color"
                value={formData.qr_bg_color}
                onChange={handleChange}
              />
              <span style={{ marginLeft: '10px' }}>{formData.qr_bg_color}</span>
            </div>
          </div>
        </div>

        <ActionButtons>
          <button 
            className="btn btn-primary"
            onClick={generateQRCode}
            disabled={loading || !formData.qr_name || !formData.qr_data}
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
          
          {qrCode && (
            <>
              <button 
                className="btn btn-success"
                onClick={downloadQRCode}
                disabled={!qrCode}
              >
                Download QR
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={saveQRCode}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save to History'}
              </button>
            </>
          )}
        </ActionButtons>
      </FormSection>

      <PreviewSection>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>QR Code Preview</h3>
        <QRPreview>
          <div ref={qrRef} style={{ textAlign: 'center' }}>
            {!qrCode && (
              <div style={{ color: '#666', fontSize: '16px' }}>
                Your QR code will appear here
              </div>
            )}
            {qrCode && (
              <img src={qrCode} alt="Generated QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
          </div>
        </QRPreview>
        
        {qrCode && (
          <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            Click "Download QR" to save to your device
          </div>
        )}
      </PreviewSection>
    </GeneratorContainer>
  )
}

export default QRGenerator