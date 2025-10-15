import routeAuth from './modules/auth'
import routeAdmin from './modules/admin'
import routeShop from './modules/shop'
import routeProfile from './modules/profile'
import routeScanner from './modules/scanner'
import routeVisitor from './modules/visitor'

export const routes = [
  { ...routeAuth },
  { ...routeAdmin },
  { ...routeShop },
  { ...routeProfile },
  { ...routeScanner },
  { ...routeVisitor },
]
