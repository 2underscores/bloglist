import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import authService from '../services/auth';

function Login({ auth, setAuth, pushNotif }) {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (evt) => {
    evt.preventDefault()
    console.log(`Attempting login of "${username}"`)
    try {
      const loginResult = await authService.login(username, password)
      const tokenStr = loginResult.data.token
      const decodedToken = jwtDecode(tokenStr)
      const newAuth = {
        'tokenEncoded': tokenStr,
        'token': decodedToken,
      }
      console.log('New Auth: ', newAuth)
      setAuth(newAuth)
      setName('')
      setUsername('')
      setPassword('')
      pushNotif({ type: 'success', message: `Logged in ${newAuth.token.name}` })
    } catch (e) {
      console.error(e)
      pushNotif({ type: 'error', message: e.response.data.error })
    }
  }

  const handleLogout = async (evt) => {
    evt.preventDefault()
    setAuth(null)
    pushNotif({ type: 'success', message: `Logged out ${auth.token.name}` })
  }

  const handleSignup = async (evt) => {
    try {
      evt.preventDefault()
      console.log('Creating User: ', username, name);
      const user = await authService.createUser(username, name, password)
      console.log('New user: ', user);
      pushNotif({ type: 'success', message: `Created ${user.data.name}` })
      await handleLogin(evt)
    } catch (e) {
      console.error(e)
      pushNotif({ type: 'error', message: e.response.data.error })
    }
  }

  return (
    auth ?
      <div>
        <span>User: {auth.token.name} <button onClick={handleLogout}>Logout</button></span>
      </div>
      :
      <div style={{ 'display': 'flex', 'gap': '50px' }}>
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