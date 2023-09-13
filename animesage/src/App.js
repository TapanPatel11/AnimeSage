import './App.css';
import AnimeFilterForm from './AnimeFilterForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Navbar';
import ViewRecommendations from './ViewRecommendations';


function App() {
  return (
    <BrowserRouter>
    <div className='app'>
      <Navbar/>
    <Routes>
    <Route  index path = "/" element = {<AnimeFilterForm />} />
    <Route  index path = "/recommendations" element = {<ViewRecommendations />} />

    </Routes>
    {/* <ToastContainer /> */}

    </div>
  </BrowserRouter>
  );
}

export default App;
