import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CarritoContext = createContext(null)

const CLAVE_LOCALSTORAGE = 'carrito_talento_lab'

const leer_carrito_inicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export const CarritoProvider = ({ children }) => {
  const [items_carrito, set_items_carrito] = useState(leer_carrito_inicial)

  useEffect(() => {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(items_carrito))
  }, [items_carrito])

  const agregar_al_carrito = (producto, cantidad = 1) => {
    set_items_carrito((items_actuales) => {
      const item_existente = items_actuales.find(
        (item) => item.producto.id_producto === producto.id_producto
      )

      if (item_existente) {
        return items_actuales.map((item) =>
          item.producto.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }

      return [...items_actuales, { producto, cantidad }]
    })
  }

  const eliminar_del_carrito = (id_producto) => {
    set_items_carrito((items_actuales) =>
      items_actuales.filter((item) => item.producto.id_producto !== id_producto)
    )
  }

  const vaciar_carrito = () => {
    set_items_carrito([])
  }

  const cantidad_total = useMemo(
    () => items_carrito.reduce((total, item) => total + item.cantidad, 0),
    [items_carrito]
  )

  const precio_total = useMemo(
    () =>
      items_carrito.reduce(
        (total, item) => total + item.producto.precio_producto * item.cantidad,
        0
      ),
    [items_carrito]
  )

  const valor = {
    items_carrito,
    agregar_al_carrito,
    eliminar_del_carrito,
    vaciar_carrito,
    cantidad_total,
    precio_total,
  }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => {
  const contexto = useContext(CarritoContext)
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider')
  }
  return contexto
}
