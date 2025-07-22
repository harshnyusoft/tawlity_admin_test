import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Result, Progress, message } from 'antd';
import { LockOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import FrameLogo from '../../../public/images/Frame.png';

const { Title, Text, Paragraph } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        // Simulate API call to validate token
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, consider token valid if it exists
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#ff4d4f';
    if (passwordStrength < 80) return '#faad14';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 80) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Password reset:', { token, ...values });
      setResetSuccess(true);
      message.success('Password reset successfully!');
    } catch (error) {
      message.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg border-0">
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <Text>Validating reset link...</Text>
          </div>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 text-center">
            <Result
              icon={<ExclamationCircleOutlined className="text-red-500" />}
              title="Invalid Reset Link"
              subTitle={
                <div className="space-y-4">
                  <Paragraph className="text-gray-600">
                    This password reset link is invalid or has expired.
                  </Paragraph>
                  <Paragraph className="text-gray-600 text-sm">
                    Password reset links are only valid for 24 hours for security reasons.
                  </Paragraph>
                </div>
              }
              extra={[
                <Button
                  key="forgot"
                  type="primary"
                  onClick={() => navigate('/auth/forgot-password')}
                  className="rounded-lg"
                >
                  Request New Link
                </Button>,
                <Button
                  key="login"
                  onClick={() => navigate('/auth/login')}
                  className="rounded-lg"
                >
                  Back to Sign In
                </Button>,
              ]}
            />
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 text-center">
            <Result
              icon={<CheckCircleOutlined className="text-green-500" />}
              title="Password Reset Successful!"
              subTitle={
                <div className="space-y-4">
                  <Paragraph className="text-gray-600">
                    Your password has been successfully reset.
                  </Paragraph>
                  <Paragraph className="text-gray-600 text-sm">
                    You can now sign in with your new password.
                  </Paragraph>
                </div>
              }
              extra={[
                <Button
                  key="login"
                  type="primary"
                  onClick={() => navigate('/auth/login')}
                  className="rounded-lg"
                >
                  Sign In Now
                </Button>,
              ]}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-16 mb-4">
            <img src={FrameLogo} alt="Tawlity Logo" className="h-full object-contain" />
          </div>
          <Title level={2} className="!mb-2">Reset Password</Title>
          <Text type="secondary">
            Enter your new password below to complete the reset process.
          </Text>
        </div>

        {/* Reset Password Form */}
        <Card className="shadow-lg border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const strength = calculatePasswordStrength(value);
                    if (strength >= 60) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password is too weak'));
                  },
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your new password"
                className="rounded-lg"
                onChange={handlePasswordChange}
              />
            </Form.Item>

            {/* Password Strength Indicator */}
            {passwordStrength > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <Text className="text-sm">Password Strength</Text>
                  <Text className="text-sm" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </Text>
                </div>
                <Progress
                  percent={passwordStrength}
                  strokeColor={getPasswordStrengthColor()}
                  showInfo={false}
                  size="small"
                />
              </div>
            )}

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm your new password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="!mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="rounded-lg h-12 font-medium"
              >
                Reset Password
              </Button>
            </Form.Item>

            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700"
              >
                Back to Sign In
              </Link>
            </div>
          </Form>
        </Card>

        {/* Security Notice */}
        <Card className="mt-4 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <Text type="secondary" className="text-sm">
              <strong>Security Tip:</strong><br />
              Choose a strong password that you haven't used elsewhere.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;