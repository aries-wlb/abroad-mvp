import './style.less'
import { useMemoizedFn } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import facebook from '@/assets/images/facebook.svg'
import google from '@/assets/images/google.svg'
import linkedin from '@/assets/images/linkedin.svg'
import { useGlobalStore } from '@/store'
import { LocalStorage } from '@/shared/storage'

const APP_NAME = 'Partrick Abroad'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [login, setLogin] = useState(false)
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })

  const globalStore = useGlobalStore(state => ({
    open: state.loginOpen,
    setOpen: state.setOpen,
    isLogin: state.isLogin,
  }))

  useEffect(() => {
    const token = LocalStorage.token.get()
    if (globalStore.isLogin || !!token) navigate('home')
  }, [globalStore.isLogin])

  const signUp = useMemoizedFn(() => {
    setSignUpForm({
      name: '',
      password: '',
      email: '',
    })
  })

  const signIn = useMemoizedFn(() => {
    navigate('home')
    setSignInForm({
      password: '',
      email: '',
    })
  })
  return (
    <div className="login">
      <div
        className={`colored-container ${login ? 'active' : 'inactive'}`}
      ></div>
      <div className={`welcome-back ${login ? 'active' : 'inactive'}`}>
        <div className="logo-container">{APP_NAME}</div>
        <div className="main-container">
          <div className="text-container">
            <span className="title">Welcome Back!</span>
            <span className="secondary">
              To keep sharing your work with us, please log in.
            </span>
          </div>
          <div
            onClick={() => {
              setLogin(!login)
            }}
            className="button-container"
          >
            Sign In
          </div>
        </div>
      </div>
      <div className={`create-container ${login ? 'active' : 'inactive'}`}>
        Create Account
        <div className="social-container">
          <img className="facebook-icon" src={facebook} alt="" />
          <img className="google-icon" src={google} alt="" />
          <img className="linkedin-icon" src={linkedin} alt="" />
        </div>
        <span className="info-text">or use email for your registration</span>
        <div className="form-container">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault()
              signUp()
            }}
          >
            <input
              className="name"
              type="text"
              placeholder="Name"
              value={signUpForm.name}
              onChange={value =>
                setSignUpForm({
                  ...signUpForm,
                  name: value.target.value,
                })
              }
              required
            />
            <input
              className="email"
              type="email"
              placeholder="Email"
              value={signUpForm.email}
              onChange={value =>
                setSignUpForm({
                  ...signUpForm,
                  email: value.target.value,
                })
              }
              required
            />
            <input
              className="password"
              type="password"
              placeholder="Password"
              value={signUpForm.password}
              onChange={value =>
                setSignUpForm({
                  ...signUpForm,
                  password: value.target.value,
                })
              }
              required
            />
            <button className="submit">Sign Up</button>
          </form>
        </div>
      </div>
      <div className={`login-container ${!login ? 'active' : 'inactive'}`}>
        <div className="logo-container">{APP_NAME}</div>
        <div className="main-container">
          <div className="social-container">
            <img className="facebook-icon" src={facebook} alt="" />
            <img className="google-icon" src={google} alt="" />
            <img className="linkedin-icon" src={linkedin} alt="" />
          </div>
          <span className="info-text">or use email for your login</span>
          <div className="form-container">
            <form
              className="form"
              onSubmit={e => {
                e.preventDefault()
                signIn()
              }}
            >
              <input
                className="email"
                type="email"
                placeholder="Email"
                value={signInForm.email}
                onChange={value =>
                  setSignInForm({
                    ...signInForm,
                    email: value.target.value,
                  })
                }
                required
              />
              <input
                className="password"
                type="password"
                placeholder="Password"
                value={signInForm.password}
                onChange={value =>
                  setSignInForm({
                    ...signInForm,
                    password: value.target.value,
                  })
                }
                required
              />
              <button className="submit">Sign In</button>
            </form>
          </div>
        </div>
      </div>
      <div className={`hello-container ${!login ? 'active' : 'inactive'}`}>
        <div className="text-container">
          <span className="title">Hello, stranger!</span>
          <span className="secondary">
            Enter your personal details and start your own portfolio!
          </span>
        </div>
        <div
          onClick={() => {
            setLogin(!login)
          }}
          className="button-container"
        >
          Sign Up
        </div>
      </div>
    </div>
  )
}

export default Login
