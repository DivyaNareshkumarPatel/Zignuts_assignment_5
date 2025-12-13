import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboardLayout from './pages/Admin/AdminDashboardLayout';
import ListBlogs from './components/ListBlogs';
import AddEditBlog from './components/AddEditBlog';
import ListCategories from './components/ListCategories';
import AddEditCategory from './components/AddEditCategories';

// User Pages
import BlogListPage from './pages/User/BlogListPage';
import BlogDetailsPage from './pages/User/BlogDetailsPage';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    return token ? children : <Navigate to="/admin-login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                
                {/* Admin Auth */}
                <Route path="/admin-login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Nested Routes inside Dashboard Layout */}
                    <Route index element={<Navigate to="blogs" replace />} />
                    <Route path="dashboard" element={<Navigate to="../blogs" replace />} />
                    
                    <Route path="blogs" element={<ListBlogs />} />
                    <Route path="blogs/new" element={<AddEditBlog />} />
                    <Route path="blogs/edit/:id" element={<AddEditBlog />} />

                    <Route path="categories" element={<ListCategories />} />
                    <Route path="categories/new" element={<AddEditCategory />} />
                    <Route path="categories/edit/:id" element={<AddEditCategory />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;