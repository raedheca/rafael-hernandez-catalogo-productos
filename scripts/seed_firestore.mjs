// Script one-shot para migrar public/productos.json a la coleccion 'productos'
// de Firestore. Se ejecuta una unica vez con: node scripts/seed_firestore.mjs
//
// Lee las credenciales del archivo .env de la raiz del proyecto (formato
// VITE_FIREBASE_*) sin depender de ninguna libreria extra para parsearlo.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

const __dirname = dirname(fileURLToPath(import.meta.url))
const raiz_proyecto = join(__dirname, '..')

const leer_env = (ruta_archivo) => {
  const variables = {}
  const contenido = readFileSync(ruta_archivo, 'utf-8')

  for (const linea of contenido.split(/\r?\n/)) {
    const linea_limpia = linea.trim()
    if (!linea_limpia || linea_limpia.startsWith('#')) continue

    const indice_igual = linea_limpia.indexOf('=')
    if (indice_igual === -1) continue

    const clave = linea_limpia.slice(0, indice_igual).trim()
    let valor = linea_limpia.slice(indice_igual + 1).trim()

    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1)
    }

    variables[clave] = valor
  }

  return variables
}

const ejecutar_seed = async () => {
  console.log('Leyendo variables de entorno desde .env...')

  let variables_env
  try {
    variables_env = leer_env(join(raiz_proyecto, '.env'))
  } catch {
    console.error(
      'No se encontro el archivo .env en la raiz del proyecto. Copia .env.example a .env y completa las credenciales de Firebase.'
    )
    process.exit(1)
  }

  const firebase_config = {
    apiKey: variables_env.VITE_FIREBASE_API_KEY,
    authDomain: variables_env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: variables_env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: variables_env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: variables_env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: variables_env.VITE_FIREBASE_APP_ID,
  }

  const falta_alguna_variable = Object.values(firebase_config).some((valor) => !valor)
  if (falta_alguna_variable) {
    console.error(
      'Faltan variables VITE_FIREBASE_* en el .env. Revisa .env.example para ver cuales son necesarias.'
    )
    process.exit(1)
  }

  // Las reglas de Firestore solo permiten escribir a usuarios autenticados,
  // por eso el seed necesita iniciar sesion antes de subir los productos.
  const seed_email = variables_env.SEED_EMAIL
  const seed_password = variables_env.SEED_PASSWORD
  if (!seed_email || !seed_password) {
    console.error(
      'Faltan SEED_EMAIL y SEED_PASSWORD en el .env. Son las credenciales del usuario administrador con el que se sube el catalogo (si la cuenta no existe, el seed la crea).'
    )
    process.exit(1)
  }

  console.log('Inicializando Firebase...')
  const app = initializeApp(firebase_config)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const coleccion_productos = collection(db, 'productos')

  console.log(`Iniciando sesion como ${seed_email}...`)
  try {
    await signInWithEmailAndPassword(auth, seed_email, seed_password)
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      console.log('La cuenta no existe todavia, creandola...')
      await createUserWithEmailAndPassword(auth, seed_email, seed_password)
    } else {
      throw error
    }
  }

  console.log('Leyendo public/productos.json...')
  const productos = JSON.parse(
    readFileSync(join(raiz_proyecto, 'public', 'productos.json'), 'utf-8')
  )

  console.log(`Subiendo ${productos.length} productos a Firestore...`)

  for (const producto of productos) {
    const { id_producto: _id_producto, ...datos_producto } = producto
    const nuevo_documento = await addDoc(coleccion_productos, datos_producto)
    console.log(`  - "${datos_producto.nombre_producto}" creado con id ${nuevo_documento.id}`)
  }

  console.log('Listo. Todos los productos fueron cargados a Firestore.')
  process.exit(0)
}

ejecutar_seed().catch((error) => {
  console.error('Error al ejecutar el seed:', error.message)
  process.exit(1)
})
