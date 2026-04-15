import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_URL;

const getAuthHeaders = (isFile: boolean = false): { headers: Record<string, string> } => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token ?? ''}`, 
    };
    if (!isFile) {
        headers['Content-Type'] = 'application/json';
    }
    
    return { headers };
};

export interface Category {
    _id: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await axios.get<Category[]>(
        '/api/admin/categories', 
        getAuthHeaders()
    );
    return data;
};

export const createCategory = async (name: string): Promise<Category> => {
    const { data } = await axios.post<Category>(
        '/api/admin/categories',
        { name },
        getAuthHeaders()
    );
    return data;
};

export const updateCategory = async (id: string, name: string): Promise<Category> => {
    const { data } = await axios.put<Category>(
        `/api/admin/categories/${id}`,
        { name },
        getAuthHeaders()
    );
    return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await axios.delete(`/api/admin/categories/${id}`, getAuthHeaders());
};

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    publishDate: string;
    imageThumbnail: string;
    imageFeatured: string;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchAdminBlogs = async (): Promise<Blog[]> => {
    const { data } = await axios.get<Blog[]>('/api/admin/blogs', getAuthHeaders());
    return data;
};

export const fetchBlogById = async (id: string): Promise<Blog> => {
    const { data } = await axios.get<Blog>(`/api/admin/blogs/${id}`, getAuthHeaders());
    return data;
};

export const createBlog = async (formData: FormData): Promise<Blog> => {
    const { data } = await axios.post<Blog>(
        '/api/admin/blogs',
        formData,
        getAuthHeaders(true)
    );
    return data;
};

export const updateBlog = async (id: string, formData: FormData): Promise<Blog> => {
    const { data } = await axios.put<Blog>(
        `/api/admin/blogs/${id}`,
        formData,
        getAuthHeaders(true)
    );
    return data;
};

export const deleteBlog = async (id: string): Promise<void> => {
    await axios.delete(`/api/admin/blogs/${id}`, getAuthHeaders());
};

export const fetchLatestBlogs = async (): Promise<Blog[]> => {
    const { data } = await axios.get<Blog[]>('/api/public/blogs/latest');
    return data;
};

export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
    const { data } = await axios.get<Blog>(`/api/public/blogs/${slug}`);
    return data;
};

export const searchBlogs = async (query: string): Promise<Blog[]> => {
    const { data } = await axios.get<Blog[]>(`/api/public/blogs/search?q=${query}`);
    return data;
};