import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import FormBuilder from "./components/FormBuilder";
import FormViewer from "./components/FormViewer";

const App: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form/create" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormViewer />} />
            <Route path="/form/:id/edit" element={<FormBuilder isEditMode />} />
        </Routes>
    </Router>
);

export default App;
