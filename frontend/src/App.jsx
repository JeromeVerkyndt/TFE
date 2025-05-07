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
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;

