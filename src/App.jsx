import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './Router'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'

function App() {

  return (
    <>
    <Navbar />
    <RouterProvider router = {router} />
    <Footer />
    </>
  )
}

export default App
