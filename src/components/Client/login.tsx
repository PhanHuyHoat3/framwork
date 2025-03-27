import { Form, Input, Button, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchLogin } from '../../store/slice/login';

const { Title } = Typography;

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [loginAttempted, setLoginAttempted] = useState(false); // 🔥 Xử lý điều hướng an toàn

  useEffect(() => {
    if (user && loginAttempted) {
      message.success('🎉 Đăng nhập thành công!');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [user, navigate, loginAttempted]);

  const onFinish = (values: { email: string; password: string }) => {
    setLoginAttempted(true); // ✅ Đánh dấu đã thử đăng nhập
    dispatch(fetchLogin(values))
      .unwrap()
      .catch((err) => {
        message.error(err || '⚠️ Đăng nhập thất bại! Vui lòng kiểm tra lại.');
      });
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#fff',
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

        {/* 🔹 Quên mật khẩu & Đăng ký */}
        <div style={{ textAlign: 'center' }}>
          <a href="/forgot-password" style={{ marginRight: '10px' }}>
            Quên mật khẩu?
          </a>
          <a href="/register">Đăng ký</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
