import { useContext, useEffect, useState } from "react"
import axios from 'axios'

const Profile = ({ AuthContext }) => {
  const { user, loggedIn, checkLoginState } = useContext(AuthContext)
  
  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:5000/auth/logout`)
      // Check login state again
      checkLoginState()
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <>
      <div>
        <h1 className='welcome-title'>
          Profile
        </h1>
        <div className="card" style={{ margin: 'auto' }}>
          <img
            src={user.picture}
            alt={`${user.given_name}'s profile`}
            className="profile-pic"
          />
          <p>Welcome</p>
          <h1 className="name">{user.name}</h1>
          <p className="email">{user.email}</p>
          <button className="logout-btn" onClick={handleLogout} >Logout</button>
        </div>
      </div>

    </>
  )
}

export default Profile