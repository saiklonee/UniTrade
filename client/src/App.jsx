import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CollegeApiTestPage from "./pages/AddCollege";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Home />} />
        <Route path="/college" element={<CollegeApiTestPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App