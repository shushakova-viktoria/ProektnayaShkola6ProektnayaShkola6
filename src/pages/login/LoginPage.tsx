import LoginForm from './components/LoginForm';

function LoginPage() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: '10px',
        backgroundColor: 'gray',
      }}
    >
      <LoginForm />
    </div>
  );
}

export default LoginPage;
