import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import ScanQR from "./pages/ScanQR";
import QRDetails from "./pages/QRDetails";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// Use BrowserRouter but we need the 404 hack for GitHub Pages
// Or use HashRouter if we want to be safe, but the plan asked for "proper URL"
// Given the prompt mentioned "redirect must work when /q/{slug} is opened directly",
// we will rely on the 404.html hack (to be added) and use BrowserRouter.

function App() {
    return (
        <BrowserRouter basename="/q-ryft">
            <Routes>
                {/* Public Redirect Route - No Layout, Minimal Overhead */}
                <Route path="/q/:slug" element={<Redirect />} />

                {/* App Routes - Wrapped in Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create" element={<CreateQR />} />
                    <Route path="/scan" element={<ScanQR />} />
                    <Route path="/qr/:id" element={<QRDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
