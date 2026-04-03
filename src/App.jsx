import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StopPage from './pages/StopPage'
import CouponPage from './pages/CouponPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parada/:id" element={<StopPage />} />
        <Route path="/cupon" element={<CouponPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
