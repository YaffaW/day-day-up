import { Link } from 'react-router';
import './App.css';
import profile from './assets/profile.jpeg';

function App() {
  const options = [
    { label: 'Schedule', URL: '/Schedule' },
    { label: 'Projects', URL: '/Projects' },
    { label: 'Blog', URL: '/Blog' }
  ]
  return (
    <div className="app">
      <header>
        <h1>🥳 Welcome to Yaffa's website 🥳</h1>
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
  )
}

export default App;
