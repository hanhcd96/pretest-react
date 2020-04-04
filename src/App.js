import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'
import Loading from './components/Loading'
import Layout from './components/Layout'
import './App.scss'

toast.configure({
  autoClose: 5000,
  transition: Slide,
  draggable: false
})
const TruckSearch = lazy(() => import('./routes/truck/search/TruckSearch'))
const TruckView = lazy(() => import('./routes/truck/details/TruckView'))

const App = () => (
  <Router>
    <Layout>
      <Suspense fallback={<Loading fullScreen />}>
        <Switch>
          <Route exact path="/" component={TruckSearch} />
          <Route path="/truck/:id" component={TruckView} />
        </Switch>
      </Suspense>
    </Layout>
  </Router>
)
export default App
ReactDOM.render(<App />, document.getElementById('app'))
