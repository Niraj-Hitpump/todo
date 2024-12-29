import Home from './Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <div>
       <ToastContainer autoClose={1000} /> 
        <Home />
    </div>
  )
}

export default App