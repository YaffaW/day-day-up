import { useState } from 'react';
import { authApi } from '../api';
import { useNavigate } from 'react-router';

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await authApi.login(username, password);
      onLogin();
      navigate('/schedule'); // 登录后重定向到日程页面
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">登录</button>
        </form>
        <div className="register-link">
          <p>还没有账户？</p>
          <button 
            onClick={async () => {
              try {
                // 创建默认用户
                await authApi.register({
                  username: 'default',
                  email: 'default@example.com',
                  password: 'password123'
                });
                // 然后自动登录
                await authApi.login('default', 'password123');
                onLogin();
                navigate('/schedule');
              } catch (err) {
                setError('创建默认账户失败');
                console.error('Register error:', err);
              }
            }}
            className="register-button"
          >
            使用默认账户
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;