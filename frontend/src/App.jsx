// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Test from './pages/Test';
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import ProductsPage from "./pages/Magasin.jsx";
import Navbar from "./components/Navbar";
import CreateInformationPage from "./pages/Admin/CreateInformation.jsx";
import GestionStockPage from "./pages/Admin/GestionStock.jsx";
import SuiviClientPage from "./pages/Admin/SuiviClient.jsx";
import UserSelectionPage from "./pages/Hub/UserSelection.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";

import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
                <Navbar />

                <main className="flex-grow-1" style={{ paddingTop: '70px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/produits" element={<ProductsPage />} />
                        <Route path="/create-product" element={<CreateProduct />} />
                        <Route path="/create-inforamtion" element={<CreateInformationPage/>}/>
                        <Route path="/stock" element={<GestionStockPage/>}/>
                        <Route path="/suivi-client" element={<SuiviClientPage/>}/>

                        <Route path="/user-selecte" element={<UserSelectionPage/>}/>

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;

