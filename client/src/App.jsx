import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CollegeApiTestPage from "./pages/AddCollege";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/college" element={<CollegeApiTestPage />} />
      </Routes>
    </div>
  )
}

export default App