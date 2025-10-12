import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  #root {
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin: 20px 0;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    &-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    &-secondary {
      background: #f8f9fa;
      color: #333;
      border: 2px solid #e9ecef;
    }

    &-danger {
      background: #dc3545;
      color: white;
    }

    &-success {
      background: #28a745;
      color: white;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      font-size: 16px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    .error {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 15px;
    }
    
    .card {
      padding: 20px;
      margin: 10px 0;
    }
  }
`

export default GlobalStyles