import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

// Unica capa de acceso a la coleccion 'cupones' en Firestore.
// Ningun componente debe importar firebase/firestore directamente: todo pasa por aqui.
const coleccion_cupones = collection(db, 'cupones')

const mapear_documento = (documento) => ({
  id_cupon: documento.id,
  ...documento.data(),
})

export const obtener_cupones = async () => {
  const instantanea = await getDocs(coleccion_cupones)
  return instantanea.docs.map(mapear_documento)
}

export const crear_cupon = async (datos_cupon) => {
  const datos_normalizados = {
    ...datos_cupon,
    codigo_cupon: datos_cupon.codigo_cupon.toUpperCase(),
  }
  const nuevo_documento = await addDoc(coleccion_cupones, datos_normalizados)
  return nuevo_documento.id
}

export const actualizar_cupon = async (id_cupon, datos_cupon) => {
  const datos_normalizados = {
    ...datos_cupon,
    codigo_cupon: datos_cupon.codigo_cupon.toUpperCase(),
  }
  const referencia_documento = doc(db, 'cupones', id_cupon)
  await updateDoc(referencia_documento, datos_normalizados)
}

export const eliminar_cupon = async (id_cupon) => {
  const referencia_documento = doc(db, 'cupones', id_cupon)
  await deleteDoc(referencia_documento)
}

export const validar_cupon = async (codigo) => {
  const codigo_normalizado = codigo.trim().toUpperCase()
  const instantanea = await getDocs(coleccion_cupones)
  const cupones = instantanea.docs.map(mapear_documento)

  const cupon_encontrado = cupones.find(
    (cupon) => cupon.codigo_cupon === codigo_normalizado
  )

  if (!cupon_encontrado) {
    throw new Error('El cupon ingresado no existe.')
  }

  if (!cupon_encontrado.activo) {
    throw new Error('El cupon ingresado no esta activo.')
  }

  if (cupon_encontrado.fecha_vencimiento) {
    const hoy = new Date().toISOString().slice(0, 10)
    if (cupon_encontrado.fecha_vencimiento < hoy) {
      throw new Error('El cupon ingresado esta vencido.')
    }
  }

  return cupon_encontrado
}
