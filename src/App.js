import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Products from "./Products";
import ProductsAdd from "./ProductsAdd";
import ProductsEdit from "./ProductsEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/products_add" element={<ProductsAdd />} />
        <Route path="/products_edit/:id" element={<ProductsEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
