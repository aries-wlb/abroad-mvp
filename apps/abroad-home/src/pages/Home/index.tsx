import { Button } from 'antd'
import './style.less'
import { Link } from 'react-router-dom'
import Articles from './Articles'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="section">
        <div className="slogan">
          Soar High Abroad, Independent & Unstoppable!
        </div>
        <div className="link-row">
          <Link to="/match">
            <Button type="primary">Match School</Button>
          </Link>
          <Link to="/personal/my">
            <Button type="primary">Apply</Button>
          </Link>
        </div>
      </div>
      <div className="section">
        <Articles />
      </div>
    </div>
  )
}
export default Home
