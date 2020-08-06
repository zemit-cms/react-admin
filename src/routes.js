import App, { routes as appRoutes } from './routes/App'
import Restricted, { routes as restrictedRoutes } from './routes/Restricted'

let Component = Restricted
let routes = restrictedRoutes

if (true) {
	Component = App
	routes = appRoutes
}

export {
	routes
}
export default Component
