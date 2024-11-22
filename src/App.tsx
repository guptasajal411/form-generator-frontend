import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import FormBuilder from "./components/FormBuilder";
import FormViewer from "./components/FormViewer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => (
    <DndProvider backend={HTML5Backend}>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/form/create" element={<FormBuilder />} />
                <Route path="/form/:id" element={<FormViewer />} />
                <Route path="/form/:id/edit" element={<FormBuilder isEditMode />} />
            </Routes>
        </Router>
    </DndProvider>
);

export default App;
