import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Upload, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { editProfile } from '../../api/services/AuthService';
import masterStore from '../../store/masterStore';

const { Title } = Typography;

const EditProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');


  const currentUser = masterStore((state) => state.user)


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await editProfile(values);
      if (response.success) {
        if (response.data) {
          masterStore.getState().setUser(response.data?.data);
          localStorage.setItem('user', JSON.stringify(response.data?.data));
        }
        message.success('Profile updated successfully!');
      } else {
        message.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url || '');
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={2}>Edit Profile</Title>
        <div className="text-gray-500">Update your personal information</div>
      </div>

      {/* Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={currentUser}
          size="large"
          className="max-w-2xl"
        >
          <Row gutter={24}>
            {/* Avatar Section */}
            <Col xs={24} className="text-center mb-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  className="border-4 border-gray-200"
                />
              </div>
            </Col>

            {/* Basic Information */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[
                  { required: true, message: 'Please enter your first name' },
                  { min: 2, message: 'First name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please enter your last name' },
                  { min: 2, message: 'Last name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>
            </Col>

            {/* Actions */}
            <Col xs={24}>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  className="sm:w-auto w-full"
                >
                  Save Changes
                </Button>
                <Button
                  size="large"
                  onClick={() => form.resetFields()}
                  className="sm:w-auto w-full"
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;