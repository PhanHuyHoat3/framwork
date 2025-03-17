import { Form, Input, Button, Typography, message } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchRegister, resetRegister } from '../../store/slice/register';
const { Title } = Typography;

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.register
  );

  useEffect(() => {
    if (user) {
      message.success('🎉 Đăng ký thành công! Chuyển hướng...');
      setTimeout(() => {
        dispatch(resetRegister());
      }, 2000);
    }
  }, [user, navigate, dispatch]);

  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await dispatch(fetchRegister({ ...values, role: 'user' })).unwrap();
      navigate('/login');
      // Gán role mặc định
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
        Đăng Ký
      </Title>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
