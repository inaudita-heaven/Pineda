/**
 * Dispatcher de contenido por parada.
 * Cada parada tiene su propio componente; si no existe, usa el genérico.
 * Props: paradaId (number), parada (object from data/paradas.js)
 */
import Parada01 from './Parada01_Viana'
import Parada02 from './Parada02'
import Parada03 from './Parada03'
import Parada04 from './Parada04'
import Parada05 from './Parada05'
import Parada06 from './Parada06'
import Parada07 from './Parada07'
import Parada08 from './Parada08'
import Parada09 from './Parada09'
import Parada10 from './Parada10'
import Parada11 from './Parada11'
import Parada12 from './Parada12_LaInaudita'

const MAP = {
  1:  Parada01,
  2:  Parada02,
  3:  Parada03,
  4:  Parada04,
  5:  Parada05,
  6:  Parada06,
  7:  Parada07,
  8:  Parada08,
  9:  Parada09,
  10: Parada10,
  11: Parada11,
  12: Parada12,
}

export default function ParadaContent({ paradaId, parada }) {
  const Component = MAP[paradaId]
  if (!Component) return null
  return <Component parada={parada} />
}
