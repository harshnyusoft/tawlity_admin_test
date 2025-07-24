import React, { useEffect, useState } from 'react';
import { Card, Avatar, Tag, Typography, Row, Col, Descriptions, Table, Spin, Button, Space, Popconfirm, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { removeUser, blockUnblockUser } from '../../api/services/UserService';

const { Title } = Typography;

const columns = [
  { title: 'Booking ID', dataIndex: 'id', key: 'id' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Completed' ? 'green' : 'blue'}>{status}</Tag> },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

const mockBookings = [
  { id: 1, date: '2025-07-22', status: 'Completed', amount: '$100' },
  { id: 2, date: '2025-07-23', status: 'Pending', amount: '$50' },
];

const UserDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(state?.user || null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // If user is not in state, fetch by id (not implemented here)
    setBookings(mockBookings); // Replace with API call
  }, [id]);

  const handleEdit = () => {
    setEditLoading(true);
    navigate(`/user-management/edit/${user?.id}`, { state: { user } });
    setEditLoading(false);
  };

  const handleDeactivate = async () => {
    setDeactivateLoading(true);
    try {
      const response = await blockUnblockUser({ userId: user.id, isActive: !user.is_active });
      if (response.success) {
        setUser(prev => ({ ...prev, is_active: !prev.is_active }));
        message.success(`${user.is_active ? 'Deactivated' : 'Activated'} user: ${user.full_name}`);
      } else {
        message.error(response.error || 'Failed to update user status');
      }
    } catch (error) {
      message.error('Failed to update user status');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await removeUser({ userId: user.id });
      if (response.success) {
        message.success((response.data && response.data.message) || 'User deleted successfully');
        navigate('/user-management/list');
      } else {
        message.error(response.error || (response.data && response.data.message) || 'Failed to delete user');
      }
    } catch (error) {
      message.error((error.response && error.response.data && error.response.data.message) || error.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return <Spin className="flex justify-center items-center h-96" />;
  }

  return (
    <div className="max-w-4xl  py-8 space-y-6">
      <Card className="shadow-md">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} className="flex justify-center">
            <Avatar size={100} src={user.profile_image} icon={<UserOutlined />} />
          </Col>
          <Col xs={24} sm={16}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <Title level={3} className="!mb-1">{user.full_name}</Title>
              <Space size="small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="small"
                  loading={editLoading}
                >
                  Edit
                </Button>
                <Popconfirm
                  title={user.is_active ? 'Deactivate user' : 'Activate user'}
                  description={`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`}
                  onConfirm={handleDeactivate}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    danger={user.is_active}
                    size="small"
                    loading={deactivateLoading}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Delete user"
                  description="Are you sure you want to delete this user?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                    loading={deleteLoading}
                  >
                    Remove
                  </Button>
                </Popconfirm>
              </Space>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MailOutlined /> <span>{user.email || 'N/A'}</span>
              <PhoneOutlined className="ml-4" /> <span>{user.phone_number || 'N/A'}</span>
            </div>
            <div className="flex gap-2 mb-2">
              <Tag color={user.is_active ? 'success' : 'default'}>{user.is_active ? 'Active' : 'Inactive'}</Tag>
              <Tag color={user.is_verify ? 'blue' : 'default'}>{user.is_verify ? 'Verified' : 'Not Verified'}</Tag>
              <Tag color={user.is_online ? 'cyan' : 'default'}>{user.is_online ? 'Online' : 'Offline'}</Tag>
            </div>
            <div className="text-gray-400 text-xs">Joined: {user.joining_date}</div>
          </Col>
        </Row>
        <Descriptions bordered column={1} size="small" className="mt-6">
          <Descriptions.Item label="Gender">{user.gender || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Address">{user.address || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="City">{user.city || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="State">{user.state || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Country">{user.country || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{user.postal_code || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Latitude">{user.latitude ?? 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Longitude">{user.longitude ?? 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="No. of Bookings">{user._count?.bookings ?? 0}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card className="shadow-md">
        <Title level={4} className="mb-4">Bookings</Title>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
          className="[&_.ant-table]:text-xs [&_.ant-table]:sm:text-sm"
        />
      </Card>
    </div>
  );
};

export default UserDetails; 