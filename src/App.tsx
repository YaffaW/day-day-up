import { useState, useEffect } from 'react';
import './App.css';
import profile from './assets/profile.jpeg';
import Login from './views/Login';
import { authApi } from './api';
import { Link } from 'react-router';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 检查是否有有效的token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  // if (checkingAuth) {
  //   return <div>加载中...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Login onLogin={handleLogin} />;
  // }

  const options = [
    { label: 'Schedule', URL: '/Schedule' },
    { label: 'Projects', URL: '/Projects' },
    { label: 'Blog', URL: '/Blog' }
  ]
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>🥳 Welcome to Yaffa's website 🥳</h1>
          <button onClick={handleLogout} className="logout-button">退出</button>
        </div>
      </header>
      <div className="content">
        <aside>
          <img src={profile} alt="Yaffa" className='profile-image' />
          <div>
            <h2>Yaffa</h2>
            <p>Web Developer</p>
            <p>Passionate about creating beautiful and functional web applications.</p>
            <p>Contact: <a href="mailto:yaffa@example.com">yaffa@example.com</a></p>
          </div>
        </aside>
        <main>
          {
            options.map((option, index) => (
              <Link to={option.URL} key={index} className="option">
                <div className={`option-block block-${index % 2}`}>
                  <span className="label">{option.label}</span>
                </div>
              </Link>
            ))
          }
        </main>
      </div>
    </div>
  );
}

export default App;
