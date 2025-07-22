import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Result, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FrameLogo from '../../../public/images/Frame.png';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Password reset request:', values);
      setEmail(values.email);
      setEmailSent(true);
      message.success('Password reset email sent successfully!');
    } catch (error) {
      message.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Reset email sent again!');
    } catch (error) {
      message.error('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 text-center">
            <Result
              icon={<CheckCircleOutlined className="text-green-500" />}
              title="Check Your Email"
              subTitle={
                <div className="space-y-4">
                  <Paragraph className="text-gray-600">
                    We've sent a password reset link to:
                  </Paragraph>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Text strong className="text-blue-600">{email}</Text>
                  </div>
                  <Paragraph className="text-gray-600 text-sm">
                    Click the link in the email to reset your password. 
                    If you don't see the email, check your spam folder.
                  </Paragraph>
                </div>
              }
              extra={[
                <Button
                  key="resend"
                  type="primary"
                  loading={loading}
                  onClick={handleResendEmail}
                  className="rounded-lg"
                >
                  Resend Email
                </Button>,
                <Button
                  key="back"
                  onClick={() => setEmailSent(false)}
                  className="rounded-lg"
                >
                  Try Different Email
                </Button>,
              ]}
            />
            
            <div className="mt-6 pt-6 border-t">
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <ArrowLeftOutlined />
                Back to Sign In
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-16 mb-4">
            <img src={FrameLogo} alt="Tawlity Logo" className="h-full object-contain" />
          </div>
          <Title level={2} className="!mb-2">Forgot Password?</Title>
          <Text type="secondary">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </Text>
        </div>

        {/* Forgot Password Form */}
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
                placeholder="Enter your email address"
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
                Send Reset Link
              </Button>
            </Form.Item>

            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <ArrowLeftOutlined />
                Back to Sign In
              </Link>
            </div>
          </Form>
        </Card>

        {/* Help Text */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <Text type="secondary" className="text-sm">
              <strong>Need help?</strong><br />
              Contact our support team at{' '}
              <Link to="mailto:support@example.com" className="text-blue-600">
                support@example.com
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;