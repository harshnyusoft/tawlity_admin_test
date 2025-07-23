import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Row, Col, Upload, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { useRef } from 'react';
import { getConfig } from '../../utils/config';
import { editUser } from '../../api/services/UserService';


const { Title } = Typography;
const { Option } = Select;

const EditUser = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef(null);


  const location = useLocation();
  const userData = location.state?.user;

  // Address fields (to be auto-filled)
  const [addressFields, setAddressFields] = useState({
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // New state for file

  useEffect(() => {
    if (userData) {
      console.log(userData);

      // Set form fields
      form.setFieldsValue({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        gender: userData.gender || '',
        language: userData.language || 'en', // fallback if not present
      });

      // Set avatar and address fields
      setAvatarUrl(userData.profile_image || '');
      setAvatarFile(null); // Reset file state on load
      setAddressFields({
        latitude: userData.latitude || '',
        longitude: userData.longitude || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
        postal_code: userData.postal_code || '',
      });
    }
  }, [userData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        ...addressFields,
        user_id: userData.id, // Assuming userData contains the ID of the user being edited
      };
      // Only add profile_image if a new file is uploaded
      if (avatarFile) {
        payload.profile_image = avatarFile;
      }
      // Optionally, if no new file, you may want to send the existing URL for backend reference
      // else if (avatarUrl) {
      //   payload.profile_image_url = avatarUrl;
      // }
      const response = await editUser(payload);
      if (response.success) {
        message.success('User updated successfully!');
        navigate('/user-management/list');
      } else {
        message.error(response.error || 'Failed to update user');
      }
    } catch (error) {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Add back avatar upload logic
  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // If your upload returns a file object, use it. Otherwise, use originFileObj
      setAvatarFile(info.file.originFileObj || null);
      // Optionally update preview
      if (info.file.response?.url) {
        setAvatarUrl(info.file.response.url);
      } else {
        // For preview, create a local URL
        setAvatarUrl(info.file.originFileObj ? URL.createObjectURL(info.file.originFileObj) : '');
      }
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

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const addressComponents = place.address_components || [];
      const getComponent = (type) =>
        addressComponents.find((comp) => comp.types.includes(type))?.long_name || '';

      setAddressFields({
        address: place.formatted_address || '',
        city: getComponent('locality') || getComponent('sublocality_level_1') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        country: getComponent('country'),
        postal_code: getComponent('postal_code'),
        latitude: place.geometry?.location?.lat() || '',
        longitude: place.geometry?.location?.lng() || '',
      });

    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/user-management/list')}
        >
          Back to Users
        </Button>
        <div>
          <div className="text-gray-500">Edit account</div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          className="max-w-4xl"
        >
          <Row gutter={24}>
            {/* Profile Image Upload */}
            <Col xs={24} className="text-center mb-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  size={100}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  className="border-4 border-gray-200"
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleAvatarChange}
                >
                  <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
                </Upload>
              </div>
            </Col>
            {/* Full Name */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please enter full name' },
                  { min: 2, message: 'Full name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>

            {/* Phone Number */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                  { pattern: /^\+?[0-9]{7,15}$/, message: 'Please enter a valid phone number' },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>

            {/* Gender */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Language */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: 'Please select language' }]}
              >
                <Select placeholder="Select language">
                  <Option value="en">English</Option>
                  <Option value="ar">Arabic</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item label="Address">
                <LoadScript
                  googleMapsApiKey={getConfig().GOOGLE_API_KEY}
                  libraries={['places']} // this is required for autocomplete
                >

                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <Input
                      value={addressFields.address}
                      onChange={(e) => setAddressFields({ ...addressFields, address: e.target.value })}
                      placeholder="Start typing address"
                    />
                  </Autocomplete>
                </LoadScript>
              </Form.Item>

            </Col>

            {/* Actions */}
            <Col xs={24}>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="sm:w-auto w-full"
                >
                  Update User
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate('/user-management/list')}
                  className="sm:w-auto w-full"
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default EditUser;