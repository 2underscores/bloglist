function Logout({ auth, setAuth, pushNotif }) {

  const handleLogout = async (evt) => {
    evt.preventDefault()
    setAuth(null)
    pushNotif({ type: 'success', message: `Logged out ${auth.token.name}` })
  }

  return (
    <div>
      <span>User: {auth.token.name} <button onClick={handleLogout}>Logout</button></span>
    </div>
  )

}

export default Logout