import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/Login";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
