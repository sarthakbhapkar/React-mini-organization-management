import './App.css';
import ProductPage from "./components/ProductPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PostPage from "./components/PostPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <h1>List Table Exercise</h1>
            <Routes>
                <Route path="posts" element={<PostPage/>}/>
                <Route path="products" element={<ProductPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
