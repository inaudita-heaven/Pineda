/**
 * Listado de las 12 paradas de la Ruta Expo.
 * Los campos marcados como TODO deben completarse con los datos reales.
 *
 * sector: usado para agrupar paradas y calcular elegibilidad del cupón.
 *   Valores posibles (pendiente lista real): 'centro', 'juderia', 'axerquia'
 */
export const PARADAS = [
  {
    id: 1,
    slug: 'palacio-de-viana',
    nombre: 'Palacio de Viana',
    ubicacion: 'Plaza de Don Gome, 2',
    sector: 'centro',
    descripcion: 'Inicio de la ruta. El Palacio de Viana, conocido como el museo de los patios, acoge la primera obra de la exposición.', // TODO: descripción real
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 37.8916, lng: -4.7743 }, // TODO: verificar
    imagen: null, // TODO: '/images/parada-01.jpg'
  },
  {
    id: 2,
    slug: 'parada-02',
    nombre: 'TODO: Parada 2',
    ubicacion: 'TODO: dirección',
    sector: 'centro',
    descripcion: 'TODO: descripción de la parada 2.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 3,
    slug: 'parada-03',
    nombre: 'TODO: Parada 3',
    ubicacion: 'TODO: dirección',
    sector: 'centro',
    descripcion: 'TODO: descripción de la parada 3.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 4,
    slug: 'parada-04',
    nombre: 'TODO: Parada 4',
    ubicacion: 'TODO: dirección',
    sector: 'juderia',
    descripcion: 'TODO: descripción de la parada 4.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 5,
    slug: 'parada-05',
    nombre: 'TODO: Parada 5',
    ubicacion: 'TODO: dirección',
    sector: 'juderia',
    descripcion: 'TODO: descripción de la parada 5.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 6,
    slug: 'parada-06',
    nombre: 'TODO: Parada 6',
    ubicacion: 'TODO: dirección',
    sector: 'juderia',
    descripcion: 'TODO: descripción de la parada 6.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 7,
    slug: 'parada-07',
    nombre: 'TODO: Parada 7',
    ubicacion: 'TODO: dirección',
    sector: 'axerquia',
    descripcion: 'TODO: descripción de la parada 7.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 8,
    slug: 'parada-08',
    nombre: 'TODO: Parada 8',
    ubicacion: 'TODO: dirección',
    sector: 'axerquia',
    descripcion: 'TODO: descripción de la parada 8.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 9,
    slug: 'parada-09',
    nombre: 'TODO: Parada 9',
    ubicacion: 'TODO: dirección',
    sector: 'axerquia',
    descripcion: 'TODO: descripción de la parada 9.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 10,
    slug: 'parada-10',
    nombre: 'TODO: Parada 10',
    ubicacion: 'TODO: dirección',
    sector: 'axerquia',
    descripcion: 'TODO: descripción de la parada 10.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 11,
    slug: 'parada-11',
    nombre: 'TODO: Parada 11',
    ubicacion: 'TODO: dirección',
    sector: 'axerquia',
    descripcion: 'TODO: descripción de la parada 11.',
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 },
    imagen: null,
  },
  {
    id: 12,
    slug: 'la-inaudita',
    nombre: 'La Inaudita',
    ubicacion: 'TODO: dirección La Inaudita',
    sector: 'axerquia',
    descripcion: 'Parada final de la ruta. La Inaudita cierra el recorrido con la última obra de la exposición. Aquí podrás canjear tu descuento.', // TODO: descripción real
    artista: 'TODO: nombre artista',
    obra: 'TODO: título obra',
    coordenadas: { lat: 0, lng: 0 }, // TODO
    imagen: null,
    esFinal: true,
  },
]

export function getParadaById(id) {
  return PARADAS.find(p => p.id === Number(id))
}

export function getParadaBySlug(slug) {
  return PARADAS.find(p => p.slug === slug)
}

export const TOTAL_PARADAS = PARADAS.length
