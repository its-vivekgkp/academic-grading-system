import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import GradeCalculator from "./GradeCalculator";
import SGPACalculator from "./SGPACalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/absolute" element={<GradeCalculator />} />
        <Route path="/relative" element={<SGPACalculator />} />
      </Routes>
    </Router>
  );
}

export default App;