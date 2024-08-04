import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const APIURL = 'https://api.github.com/users/';

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  const getUser = async (username) => {
    try {
      const { data } = await axios(APIURL + username);
      setUser(data);
      getRepos(username);
    } catch (err) {
      if (err.response.status === 404) {
        setError('No profile with this username');
      }
    }
  };

  const getRepos = async (username) => {
    try {
      const { data } = await axios(APIURL + username + '/repos?sort=created');
      setRepos(data.slice(0, 5));
    } catch (err) {
      setError('Problem fetching repos');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    if (username) {
      getUser(username);
      e.target.elements.username.value = '';
      setError(null);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="user-form">
        <input type="text" name="username" id="search" placeholder="Search a Github User" />
      </form>
      <main id="main">
        {error && <div className="card"><h1>{error}</h1></div>}
        {user && (
          <div className="card">
            <div>
              <img src={user.avatar_url} alt={user.name} className="avatar" />
            </div>
            <div className="user-info">
              <h2>{user.name || user.login}</h2>
              <p>{user.bio}</p>
              <ul>
                <li>{user.followers} <strong>Followers</strong></li>
                <li>{user.following} <strong>Following</strong></li>
                <li>{user.public_repos} <strong>Repos</strong></li>
              </ul>
              <div id="repos">
                {repos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo">
                    {repo.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
