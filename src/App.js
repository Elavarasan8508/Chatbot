import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</BrowserRouter>

    </div>
  );
}

export default App;
