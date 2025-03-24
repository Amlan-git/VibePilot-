import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Field, 
  FormElement
} from '@progress/kendo-react-form';
import { 
  Input, 
  Checkbox 
} from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { login } from '../services/authService';

// Form validation functions
const emailValidator = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    return 'Email is required';
  }
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email';
  }
  return '';
};

const passwordValidator = (value: string) => {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

const SimpleLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { [name: string]: any }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loginData = {
        email: values.email as string,
        password: values.password as string,
        rememberMe: values.rememberMe as boolean
      };
      
      const response = await login(loginData);
      
      if (response.success) {
        // Navigate to dashboard on successful login
        navigate('/');
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 600, 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Sign in to VibePilot
        </h1>

        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FFF5F5',
            color: '#E53E3E',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(66, 153, 225, 0.1)',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#3182CE'
        }}>
          Demo credentials are pre-filled. Click "Sign In" to explore the dashboard.
        </div>

        <Form
          onSubmit={handleSubmit}
          initialValues={{
            email: 'demo@vibepilot.com',
            password: 'demo1234',
            rememberMe: true
          }}
          render={(formRenderProps) => (
            <FormElement>
              <Field
                id="email"
                name="email"
                label="Email"
                component={Input}
                validator={emailValidator}
              />

              <div style={{ marginTop: '16px' }}>
                <Field
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  component={Input}
                  validator={passwordValidator}
                />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                <Field
                  id="rememberMe"
                  name="rememberMe"
                  component={Checkbox}
                  label="Remember me"
                />
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={!formRenderProps.valid || isLoading}
                  style={{ width: '100%' }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </FormElement>
          )}
        />
      </div>
    </div>
  );
};

export default SimpleLoginPage; 