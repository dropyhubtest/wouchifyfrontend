import { useMediaQuery } from './hooks/useMediaQuery'
import { DesktopHomePage } from './components/desktop/DesktopHomePage'
import { MobileHomePage } from './components/mobile'

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return <MobileHomePage />
  }

  return <DesktopHomePage />
}
