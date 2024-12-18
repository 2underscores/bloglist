import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import authService from '../services/auth';

function Login({ setAuth, pushNotif }) {
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
    <div style={{ display: 'flex', gap: '50px' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Login</h2>
        <label htmlFor='username-login'>Username:</label>
        <input id='username-login' type='text' name='UsernameLogin' value={username} onChange={(evt) => setUsername(evt.target.value)} />
        <label htmlFor='password-login'>Password:</label>
        <input id='password-login' type='password' name='PasswordLogin' value={password} onChange={(evt) => setPassword(evt.target.value)} />
        <br></br>
        <button type="submit">Login</button>
      </form>

      <form onSubmit={handleSignup} style={{ display: 'grid' }}>
        <h2>Signup</h2>
        <label htmlFor='name-signup'>Name:</label>
        <input id='name-signup' type='text' name='NameSignup' value={name} onChange={(evt) => setName(evt.target.value)} />
        <label htmlFor='username-signup'>Username:</label>
        <input id='username-signup' type='text' name='UsernameSignup' value={username} onChange={(evt) => setUsername(evt.target.value)} />
        <label htmlFor='password-signup'>Password:</label>
        <input id='password-signup' type='password' name='PasswordSignup' value={password} onChange={(evt) => setPassword(evt.target.value)} />
        <br></br>
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default Login