import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useAuth from './hooks/useAuth';

import Home from './pages/home';
import Test from './pages/test';
import News from "./pages/User/News.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import ProductsPage from "./pages/Hub/Panier.jsx";
import Navbar from "./components/Navbar";
import NavbarHub from "./components/HubNavbar.jsx";
import AdminNavbar from "./components/AdminNavbar.jsx";
import CreateInformationPage from "./pages/Admin/CreateInformation.jsx";
import GestionStockPage from "./pages/Admin/GestionStock.jsx";
import SuiviClientPage from "./pages/Admin/SuiviClient.jsx";
import UserSelectionPage from "./pages/Hub/UserSelection.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap-icons/font/bootstrap-icons.css';

function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
    const { user } = useAuth();

    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            {user?.role === 'CLIENT' && <Navbar />}
            {user?.role === 'HUB' && <NavbarHub />}
            {user?.role === 'ADMIN' && <AdminNavbar />}


            <main className="flex-grow-1" style={{ paddingTop: '70px' }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/test" element={<PrivateRoute><Test /></PrivateRoute>} />
                    <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
                    <Route path="/hub/panier" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
                    <Route path="/create-product" element={<PrivateRoute><CreateProduct /></PrivateRoute>} />
                    <Route path="/create-inforamtion" element={<PrivateRoute><CreateInformationPage /></PrivateRoute>} />
                    <Route path="/stock" element={<PrivateRoute><GestionStockPage /></PrivateRoute>} />
                    <Route path="/suivi-client" element={<PrivateRoute><SuiviClientPage /></PrivateRoute>} />
                    <Route path="/hub/user-selecte" element={<PrivateRoute><UserSelectionPage /></PrivateRoute>} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
