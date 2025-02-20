import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { supabase } from '../../../shared/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

type FieldType = {
  email: string;
  password: string;
};

function LoginForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    console.log(error);
    if (error) {
      alert('Invalid login or password!');
    } else {
      navigate('/');
    }
  };

  return (
    <Form
      name="login"
      style={{
        minWidth: 500,
        background: 'white',
        padding: '30px',
        borderRadius: '30px',
      }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Enter your email address' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Enter your password' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            columnGap: '5px',
          }}
        >
          <Button style={{ width: '50%' }} type="primary" htmlType="submit">
            Login
          </Button>
          <Button style={{ width: '50%' }} type="primary">
          Password reset
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
