import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./pages/class";
import RecordPage from "./pages/record";
import TablePage from "./pages/table";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecordPage />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/class" element={<ClassPage />} />
      </Routes>
    </Router>
  );
}

export default App;
