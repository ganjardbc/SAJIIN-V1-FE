import routeAuth from './modules/auth'
import routeAdmin from './modules/admin'
import routeOwner from './modules/owner'
import routeShop from './modules/shop'
import routeScanner from './modules/scanner'
import routeVisitor from './modules/visitor'

export const routes = [
  { ...routeAuth },
  { ...routeAdmin },
  { ...routeOwner },
  { ...routeShop },
  { ...routeScanner },
  { ...routeVisitor },
]
