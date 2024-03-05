import { Button } from 'antd'
import { Link, useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError() as Record<string, string>

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button type="primary">
        <Link to="home">Return Home</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
