import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import TestPage from './pages/TestPage';


function App() {
  return (
    <HashRouter>
      {/* определяем маршруты и сопоставляем их с компонентами (страницами) */}
      <Routes>
        <Route path="login" element={<LoginPage />} />
        {/* маршрут по умолчанию */}
        <Route path="*" element={<AdminPage />} />
        <Route path="test" element={<TestPage />} />
      </Routes>
    </HashRouter>
  );
  
}




export default App;
