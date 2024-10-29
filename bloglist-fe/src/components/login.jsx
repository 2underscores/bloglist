import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import auth from '../services/auth';

function Login({ user, setUser }) {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (evt) => {
    evt.preventDefault()
    console.log('Logging in: ', username)
    const loginResult = await auth.login(username, password)
    console.log('Logged in: ', loginResult)
    const token = loginResult.data.token
    if (token) {
      const decoded = jwtDecode(token); // Unverified for client
      console.log('Decoded token: ', decoded)
      setUser({
        'token': token,
        'id': decoded.id,
        'name': decoded.name,
        'username': decoded.username,
      })
      setName('')
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = async (evt) => {
    evt.preventDefault()
    setUser(null)
    console.log('User logged out');

  }

  const handleSignup = async (evt) => {
    evt.preventDefault()
    console.log('Creating User: ', username, name);
    const user = await auth.createUser(username, name, password)
    console.log('New user: ', user);
    const loginResult = await handleLogin(evt)
  }

  return (
    user ?
      <div>
        <span>User: {user.name} <button onClick={handleLogout}>Logout</button></span>
      </div>
      :
      <div>
        <form onSubmit={handleLogin} style={{ 'display': 'grid' }}>
          <h2>Login</h2>
          <span>Username: <input type='text' name='UsernameLogin' value={username} onChange={(evt) => setUsername(evt.target.value)}></input></span>
          <span>Password: <input type='text' name='PasswordLogin' value={password} onChange={(evt) => setPassword(evt.target.value)}></input></span>
          <span><button type="submit">Login</button></span>
        </form>
        <form onSubmit={handleSignup} style={{ 'display': 'grid' }}>
          <h2>Signup</h2>
          <span>Name: <input type='text' name='NameSignup' value={name} onChange={(evt) => setName(evt.target.value)}></input></span>
          <span> Username: <input type='text' name='UsernameSignup' value={username} onChange={(evt) => setUsername(evt.target.value)}></input></span>
          <span>Password: <input type='text' name='PasswordSignup' value={password} onChange={(evt) => setPassword(evt.target.value)}></input></span>
          <span><button type="submit">Signup</button></span>
        </form>
      </div>
  )
}

export default Login