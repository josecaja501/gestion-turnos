'use client'

export default function BotonEliminarUsuario() {
  return (
    <button 
      type="submit" 
      className="bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-900 font-semibold text-sm"
      onClick={(e) => {
        if(!confirm('¿Seguro que quieres eliminar este usuario?')) {
          e.preventDefault()
        }
      }}
    >
      🗑️ Eliminar
    </button>
  )
}