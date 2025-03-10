import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MappingEditor from "./MappingEditor";
import React from 'react';
import {
  ReactFlowProvider,
} from '@xyflow/react';


// import "@mantine/code-highlight/styles.css";
// import "@mantine/core/styles.css";
// import "@mantine/notifications/styles.css";
// import '@xyflow/react/dist/style.css';
import { MantineProvider } from "@mantine/core";
// Sample JSON with preloaded nodes and edges

export default function App() {
  return (
    <ReactFlowProvider>
      <MantineProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<MappingEditor />} />
      </Routes>
    </Router>
    </MantineProvider>
    </ReactFlowProvider>
 
  );
}
