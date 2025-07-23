import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { changePassword } from '../../api/services/AuthService';

const { Title, Text } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await changePassword(values);
      if (response.success) {
        message.success(response.data?.message || 'Password changed successfully!');
        form.resetFields();
      } else {
        message.error(response.error || response.data?.message || 'Failed to change password');
      }
    } catch (error) {
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return requirements;
  };

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordRequirements(validatePassword(password));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={2}>Change Password</Title>
        <Text type="secondary">Update your account password to keep your account secure</Text>
      </div>

      {/* Security Alert */}
      <Alert
        message="Security Reminder"
        description="Choose a strong password that you haven't used elsewhere. A good password should be unique and hard to guess."
        type="info"
        icon={<SafetyOutlined />}
        showIcon
      />

      {/* Form */}
      <Card className="max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="current_password"
            label="Current Password"
            rules={[
              { required: true, message: 'Please enter your current password' },
            ]}
          >
            <Input.Password
              placeholder="Enter your current password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const requirements = validatePassword(value);
                  const isValid = Object.values(requirements).every(Boolean);
                  if (isValid) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password does not meet requirements'));
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your new password"
              prefix={<LockOutlined />}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          {/* Password Requirements */}
          <div className="mb-6">
            <Text strong>Password Requirements:</Text>
            <ul className="mt-2 space-y-1">
              <li className={`text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                ✓ At least 8 characters long
              </li>
              <li className={`text-sm ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                ✓ Contains uppercase letter
              </li>
              <li className={`text-sm ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                ✓ Contains lowercase letter
              </li>
              <li className={`text-sm ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                ✓ Contains number
              </li>
              <li className={`text-sm ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                ✓ Contains special character
              </li>
            </ul>
          </div>

          <Form.Item
            name="confirm_password"
            label="Confirm New Password"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your new password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SafetyOutlined />}
              size="large"
              className="sm:w-auto w-full"
            >
              Change Password
            </Button>
            <Button
              size="large"
              onClick={() => form.resetFields()}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      {/* Additional Security Tips */}
      <Card title="Security Tips" className="max-w-2xl">
        <ul className="space-y-2 text-gray-600">
          <li>• Use a unique password that you don't use for other accounts</li>
          <li>• Consider using a password manager to generate and store strong passwords</li>
          <li>• Enable two-factor authentication for additional security</li>
          <li>• Regularly update your password every 3-6 months</li>
          <li>• Never share your password with others</li>
        </ul>
      </Card>
    </div>
  );
};

export default ChangePassword;