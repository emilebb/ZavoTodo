import { useState } from 'react'
import { Star, MapPin, Clock, Leaf, TrendingUp, Package, ShoppingBag } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const DemoPage = () => {
  const [selectedTab, setSelectedTab] = useState('packs')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Leaf className="w-12 h-12 text-primary-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              ZAVO
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Rescata comida deliciosa con hasta 
            <span className="text-primary-600"> 70% de descuento</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a la revolución contra el desperdicio alimentario. Encuentra packs sorpresa 
            de tus restaurantes favoritos y ayuda a salvar el planeta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Explorar Packs
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Ver en Mapa
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2,500+</div>
              <div className="text-gray-600">Packs rescatados</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Ahorro promedio</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-teal-600 mb-2">150+</div>
              <div className="text-gray-600">Negocios aliados</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2.1 kg</div>
              <div className="text-gray-600">CO₂ ahorrado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Explora nuestras funcionalidades
            </h3>
            <p className="text-gray-600 text-lg">
              Descubre cómo ZAVO está transformando la forma de combatir el desperdicio alimentario
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedTab('packs')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedTab === 'packs'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Packs Sorpresa
              </button>
              <button
                onClick={() => setSelectedTab('business')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedTab === 'business'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Para Negocios
              </button>
              <button
                onClick={() => setSelectedTab('impact')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedTab === 'impact'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Impacto Ambiental
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {selectedTab === 'packs' && (
              <>
                {/* Pack Cards */}
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 relative">
                      <div className="absolute top-3 right-3">
                        <Badge variant="error" size="sm">-47%</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="warning" size="sm">¡Últimas 3!</Badge>
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-primary-700 font-bold text-xl">🥖</span>
                          </div>
                          <p className="text-sm text-gray-600">Panadería El Buen Pan</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">4.8</span>
                        </div>
                        <span className="text-sm text-gray-600">Panadería El Buen Pan</span>
                      </div>

                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        Pack Sorpresa de Panadería
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        Deliciosos panes, pasteles y productos de panadería del día anterior. 
                        Perfectos para el desayuno o merienda.
                      </p>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">Calle 85 #15-20, Bogotá</span>
                        </div>
                        <div className="flex items-center text-sm text-orange-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Retiro: 17:00 - 20:00</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 line-through">$15,000</div>
                          <div className="text-xl font-bold text-primary-600">$8,000</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Ahorro</div>
                          <div className="text-lg font-bold text-green-600">$7,000</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {selectedTab === 'business' && (
              <div className="lg:col-span-3">
                <Card className="p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-primary-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      ¿Tienes un negocio de comida?
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg">
                      Únete a ZAVO y convierte tu exceso de comida en ingresos adicionales 
                      mientras ayudas al medio ambiente.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <div className="text-3xl mb-2">💰</div>
                        <h5 className="font-semibold mb-2">Ingresos Extra</h5>
                        <p className="text-sm text-gray-600">
                          Monetiza tu exceso de comida en lugar de desecharlo
                        </p>
                      </div>
                      <div>
                        <div className="text-3xl mb-2">🌍</div>
                        <h5 className="font-semibold mb-2">Impacto Positivo</h5>
                        <p className="text-sm text-gray-600">
                          Contribuye activamente a la reducción del desperdicio
                        </p>
                      </div>
                      <div>
                        <div className="text-3xl mb-2">👥</div>
                        <h5 className="font-semibold mb-2">Nuevos Clientes</h5>
                        <p className="text-sm text-gray-600">
                          Atrae nuevos clientes que descubran tu negocio
                        </p>
                      </div>
                    </div>
                    <Button size="lg">Registrar mi negocio</Button>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'impact' && (
              <div className="lg:col-span-3">
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      Nuestro Impacto Ambiental
                    </h4>
                    <p className="text-gray-600 text-lg">
                      Cada pack que rescatas tiene un impacto positivo directo en el planeta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">2.1 kg</div>
                      <div className="text-sm text-gray-600">CO₂ ahorrado por pack</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">1.5 L</div>
                      <div className="text-sm text-gray-600">Agua conservada</div>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-xl">
                      <div className="text-3xl font-bold text-orange-600 mb-2">0.8 m²</div>
                      <div className="text-sm text-gray-600">Tierra preservada</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">1 kg</div>
                      <div className="text-sm text-gray-600">Comida rescatada</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para hacer la diferencia?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de usuarios que ya están rescatando comida y salvando el planeta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
              Descargar App
            </Button>
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white">
              Explorar Web
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DemoPage
