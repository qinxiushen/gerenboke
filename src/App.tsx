import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import TagsPage from './pages/TagsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
