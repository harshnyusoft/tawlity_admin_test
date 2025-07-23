import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import FrameLogo from '../../../public/images/Frame.png';
import { loginUser } from '../../api/services/AuthService';
import masterStore from '../../store/masterStore';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await loginUser(values);
      if (result.success) {
        // Store token and user info in localStorage
        const { token, ...user } = result.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Update global store
        masterStore.getState().setToken(token);
        masterStore.getState().setUser(user);
        message.success('Login successful!');
        navigate('/');
      } else {
        message.error(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-16 mb-4">
            <img src={FrameLogo} alt="Tawlity Logo" className="h-full object-contain" />
          </div>
          <Title level={2} className="!mb-2">Welcome Back</Title>
          <Text type="secondary">Sign in to your account to continue</Text>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="rounded-lg h-12 font-medium"
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider className="!my-6">
              <Text type="secondary" className="text-sm">or</Text>
            </Divider>

            <div className="text-center">
              <Text type="secondary">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </Text>
            </div>
          </Form>
        </Card>


      </div>
    </div>
  );
};

export default Login;