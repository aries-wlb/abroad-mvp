/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Index from '@/pages/Index'

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login/Full'))
// const Index = lazy(() => import('@/pages/Index'))
const Match = lazy(() => import('@/pages/Match'))
const Personal = lazy(() => import('@/pages/Personal'))
const ErrorPage = lazy(() => import('@/pages/ErrorPage'))
const Admin = lazy(() => import('@/pages/Admin'))
const Student = lazy(() => import('@/pages/Student'))
const Article = lazy(() => import('@/pages/Article'))
const Application = lazy(() => import('@/pages/Admin/Application'))

export const routes = [
  {
    path: '/login',
    id: 'login',
    element: <Login />,
  },
  {
    path: '/',
    id: 'root',
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/admin',
        id: 'admin',
        loader: () => ({
          noEntity: true,
        }),
        element: <Admin />,
        children: [
          {
            path: '/admin/student',
            id: 'student',
            element: <Student />,
          },
          {
            path: '/admin/article',
            id: 'article',
            element: <Article />,
          },
          {
            path: '/admin/application',
            id: 'application',
            element: <Application />,
          },
        ],
      },
      {
        path: '/home',
        id: 'home',
        element: <Home />,
      },
      {
        path: '/personal/:tab?',
        id: 'personal',
        element: <Personal />,
      },
      {
        path: '/match',
        id: 'match',
        element: <Match />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
