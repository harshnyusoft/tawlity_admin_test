import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FrameLogo from '../../../public/images/Frame.png';
import { loginUser } from '../../api/services/AuthService';
import masterStore from '../../store/masterStore';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        message.success(t('auth.loginSuccessful'));
        navigate('/');
      } else {
        message.error(result.error || t('auth.invalidCredentials'));
      }
    } catch (error) {
      message.error(t('messages.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-16 mb-4">
            <img src={FrameLogo} alt="Tawlity Logo" className="h-full object-contain" />
          </div>
          <Title level={2} className="!mb-2">{t('auth.welcomeBack')}</Title>
          <Text type="secondary">{t('auth.signInToAccount')}</Text>
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
              label={t('auth.emailAddress')}
              rules={[
                { required: true, message: t('validation.enterEmail') },
                { type: 'email', message: t('validation.emailInvalid') },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder={t('auth.emailAddress')}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('auth.password')}
              rules={[
                { required: true, message: t('validation.enterPassword') },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t('auth.password')}
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                <Checkbox>{t('auth.rememberMe')}</Checkbox>
              </Form.Item>
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {t('auth.forgotPassword')}
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
                {t('auth.signIn')}
              </Button>
            </Form.Item>

            <Divider className="!my-6">
              <Text type="secondary" className="text-sm">{t('common.or')}</Text>
            </Divider>

            <div className="text-center">
              <Text type="secondary">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('auth.signUp')}
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