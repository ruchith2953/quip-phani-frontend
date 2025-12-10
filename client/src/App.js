import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../src/Components/Home';
import Settings from '../src/Components/Setting';
import UpdateAem from "./Components/UpdateAem";
import DataPreview from "./Components/DataPreview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/home/datapreview" element={<DataPreview/>}/>
        <Route path="/home/datapreview/update-aem" element={<UpdateAem />} />
      </Routes>
    </Router>
  );
}

export default App;