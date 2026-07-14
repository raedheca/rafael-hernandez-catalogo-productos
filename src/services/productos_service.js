import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

// Unica capa de acceso a la coleccion 'productos' en Firestore.
// Ningun componente debe importar firebase/firestore directamente: todo pasa por aqui.
const coleccion_productos = collection(db, 'productos')

const mapear_documento = (documento) => ({
  id_producto: documento.id,
  ...documento.data(),
})

export const obtener_productos = async () => {
  const instantanea = await getDocs(coleccion_productos)
  return instantanea.docs.map(mapear_documento)
}

export const obtener_producto_por_id = async (id_producto) => {
  const referencia_documento = doc(db, 'productos', id_producto)
  const instantanea = await getDoc(referencia_documento)

  if (!instantanea.exists()) {
    throw new Error('Producto no encontrado')
  }

  return mapear_documento(instantanea)
}

export const crear_producto = async (datos_producto) => {
  const nuevo_documento = await addDoc(coleccion_productos, datos_producto)
  return nuevo_documento.id
}

export const actualizar_producto = async (id_producto, datos_producto) => {
  const referencia_documento = doc(db, 'productos', id_producto)
  await updateDoc(referencia_documento, datos_producto)
}

export const eliminar_producto = async (id_producto) => {
  const referencia_documento = doc(db, 'productos', id_producto)
  await deleteDoc(referencia_documento)
}
