import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import AdminRoutes from './routes/AdminRoutes';
import CitizenRoutes from './routes/CitizenRoutes';
import WorkerRoutes from './routes/WorkerRoutes';
import AssistantButton from './components/assistant/AssistantButton';
import { initAssistantEngine } from './components/assistant/AssistantEngine';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  // Initialize assistant engine with navigate function
  useEffect(() => {
    initAssistantEngine(navigate);
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminRoutes />} />
        <Route path="/citizen" element={<CitizenRoutes />} />
        <Route path="/worker" element={<WorkerRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AssistantButton />
    </>
  );
}

export default App;
