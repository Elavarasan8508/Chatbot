import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <RouteDebugger /> {/* ✅ Move this inside HashRouter */}
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

function RouteDebugger() {
  const location = useLocation();
  console.log("📍 Current route:", location.pathname);
  return null;
}

export default App;
