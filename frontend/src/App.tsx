// import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes } from "react-router";
import "./App.css";
import { CanvasPage } from "./pages/CanvasPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NavigationBar } from "./components/NavigationBar";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<CanvasPage />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
