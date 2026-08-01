import { FilePlus2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { HomePageButton } from '../components/HomePageButton'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.home}>
      <HomePageButton icon={<FilePlus2 size={24} strokeWidth={2} />} onClick={() => navigate('/editor')}>
        New invoice
      </HomePageButton>
    </div>
  )
}
