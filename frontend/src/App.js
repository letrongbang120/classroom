import { Routes, Route } from "react-router-dom";


import Home from './pages/Home'
import Login from './components/Login'
import Register from './components/Register'
import CoursePage from "./pages/CoursePage/CoursePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path='/c/:courseId' element={<CoursePage />} />
      </Routes>
    </div>
  );
}

export default App;
