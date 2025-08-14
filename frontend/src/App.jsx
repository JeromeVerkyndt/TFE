import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useAuth from './hooks/useAuth';

import Home from './pages/home';
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
import CreateSubscription from "./pages/Admin/CreateSubscription.jsx";
import Subscription from "./pages/User/Subscription.jsx";
import ProfilePage from "./pages/Profile.jsx";
import HistoryUser from "./pages/User/HistoricUser.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import NotAuthorized from './pages/NotAuthorized';


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


            <main className="flex-grow-1" style={{ paddingTop: '90px' }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/not-authorized" element={<NotAuthorized />} />


                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
                    <Route path="/hub/panier" element={<PrivateRoute><RoleRoute allowedRoles={['HUB']} user={user}><ProductsPage /></RoleRoute></PrivateRoute>} />
                    <Route path="/create-product" element={<PrivateRoute><RoleRoute allowedRoles={['ADMIN']} user={user}><CreateProduct /></RoleRoute></PrivateRoute>} />
                    <Route path="/create-inforamtion" element={<PrivateRoute><RoleRoute allowedRoles={['ADMIN']} user={user}><CreateInformationPage /></RoleRoute></PrivateRoute>} />
                    <Route path="/stock" element={<PrivateRoute><RoleRoute allowedRoles={['ADMIN']} user={user}><GestionStockPage /></RoleRoute></PrivateRoute>} />
                    <Route path="/suivi-client" element={<PrivateRoute><RoleRoute allowedRoles={['ADMIN']} user={user}><SuiviClientPage /></RoleRoute></PrivateRoute>} />
                    <Route path="/hub/user-selecte" element={<PrivateRoute><RoleRoute allowedRoles={['HUB']} user={user}><UserSelectionPage /></RoleRoute></PrivateRoute>} />
                    <Route path="/create-subscription" element={<PrivateRoute><RoleRoute allowedRoles={['ADMIN']} user={user}><CreateSubscription /></RoleRoute></PrivateRoute>} />
                    <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/compte" element={<PrivateRoute><HistoryUser /></PrivateRoute>} />
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
