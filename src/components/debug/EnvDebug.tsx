/**
 * Componente de debug para verificar variables de entorno
 */

export default function EnvDebug() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const mapProvider = import.meta.env.VITE_MAP_PROVIDER
  
  return (
    <div className="fixed top-4 left-4 bg-white border rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-gray-800 mb-2">🔧 Debug Variables de Entorno</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>VITE_MAP_PROVIDER:</strong> 
          <span className={mapProvider ? 'text-green-600' : 'text-red-600'}>
            {mapProvider || 'NO DEFINIDO'}
          </span>
        </div>
        <div>
          <strong>VITE_GOOGLE_MAPS_API_KEY:</strong> 
          <span className={apiKey ? 'text-green-600' : 'text-red-600'}>
            {apiKey ? `${apiKey.substring(0, 10)}...` : 'NO DEFINIDO'}
          </span>
        </div>
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <strong>Solución si no aparecen:</strong><br/>
          1. Verifica que el archivo .env existe<br/>
          2. Reinicia el servidor: npm run dev<br/>
          3. Las variables deben empezar con VITE_
        </div>
      </div>
    </div>
  )
}
