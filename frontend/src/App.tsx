import { Route, Routes } from "react-router";
import "./App.css";
import { NavigationBar } from "./NavigationBar";
import { CanvasPage } from "./pages/CanvasPage";
import { DashboardPage } from "./pages/DashboardPage";

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
