import { Form, Input, Button, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchLogin } from '../../store/slice/login';

const { Title } = Typography;

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (user) {
      message.success('🎉 Đăng nhập thành công!');
      setTimeout(() => navigate('/'), 1500);
    }
  }, [user, navigate]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(fetchLogin(values)).unwrap();
    } catch (error) {
      message.error(`⚠️ ${error}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
      }}
    >
      <Title level={2} className="text-center">
        Đăng Nhập
      </Title>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Vui lòng nhập đúng email!',
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
