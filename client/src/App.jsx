import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react'
import Callback from './Callback'
import Login from './Login'
import Layout from './Layout'

// Ensures cookie is sent
axios.defaults.withCredentials = true

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user }
      } = await axios.get(`http://localhost:5000/auth/logged_in`)
      setLoggedIn(logged_in)
      user && setUser(user)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    checkLoginState()
  }, [checkLoginState])

  return <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</AuthContext.Provider>
}

const Home = () => {  
  const { loggedIn } = useContext(AuthContext)  
  if (loggedIn === true) return <Layout AuthContext={AuthContext} />
  if (loggedIn === false) return <Login />
  return <></>
}

const router = createBrowserRouter([
  {
    path: '/*',
    element: <Home />,
  },
  {
    path: '/callback', // google will redirect here
    element: <Callback AuthContext={AuthContext} />,
  },
])


function App() {

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  )
}

export default App
