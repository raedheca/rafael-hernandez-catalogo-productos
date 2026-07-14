import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/config.js'

const AuthContext = createContext(null)

const mensajes_error_firebase = {
  'auth/invalid-credential': 'Email o contrasena incorrectos.',
  'auth/invalid-email': 'El email ingresado no es valido.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'Email o contrasena incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta registrada con ese email.',
  'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta nuevamente mas tarde.',
  'auth/network-request-failed': 'Error de conexion. Revisa tu internet e intenta de nuevo.',
}

const traducir_error_firebase = (error) => {
  const codigo = error?.code ?? ''
  return mensajes_error_firebase[codigo] ?? 'Ocurrio un error inesperado. Intenta nuevamente.'
}

export const AuthProvider = ({ children }) => {
  const [usuario, set_usuario] = useState(null)
  const [cargando_auth, set_cargando_auth] = useState(true)

  useEffect(() => {
    const desuscribirse = onAuthStateChanged(auth, (usuario_actual) => {
      set_usuario(usuario_actual)
      set_cargando_auth(false)
    })

    return () => desuscribirse()
  }, [])

  const iniciar_sesion = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw new Error(traducir_error_firebase(error), { cause: error })
    }
  }

  const registrar_usuario = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw new Error(traducir_error_firebase(error), { cause: error })
    }
  }

  const cerrar_sesion = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(traducir_error_firebase(error), { cause: error })
    }
  }

  const valor = {
    usuario,
    cargando_auth,
    iniciar_sesion,
    registrar_usuario,
    cerrar_sesion,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return contexto
}
