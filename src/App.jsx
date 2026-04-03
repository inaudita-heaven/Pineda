import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StopPage from './pages/StopPage'
import CouponPage from './pages/CouponPage'
import ScanLanding from './pages/ScanLanding'
import NotFound from './pages/NotFound'

// BASE_URL = '/Pineda/' en prod (GitHub Pages), '/' en dev local
const basename = import.meta.env.BASE_URL

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<ScanLanding />} />
        <Route path="/parada/:id" element={<StopPage />} />
        <Route path="/cupon" element={<CouponPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
