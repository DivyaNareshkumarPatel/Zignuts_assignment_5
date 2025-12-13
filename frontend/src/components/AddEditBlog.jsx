import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, fetchBlogById, updateBlog, fetchCategories } from '../api/api.js';

// Icon Components
const Icons = {
    Back: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    Image: () => <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Calendar: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Tag: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
};

// Main Component
const AddEditBlog = () => {
    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [publishDate, setPublishDate] = useState(new Date().toISOString().substring(0, 10));
    
    // File states
    const [imageThumbnail, setImageThumbnail] = useState(null);
    const [imageFeatured, setImageFeatured] = useState(null);
    
    // Preview states for UI
    const [previewThumbnail, setPreviewThumbnail] = useState(null);
    const [previewFeatured, setPreviewFeatured] = useState(null);
    
    // Other States
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState({ thumbnail: '', featured: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Router Hooks
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Load Initial Data
    useEffect(() => {
        const loadInitialData = async () => {
            setError(null);
            try {
                const categoryData = await fetchCategories();
                setCategories(categoryData);
                
                if (!isEditMode && categoryData.length > 0) {
                    setCategory(categoryData[0]._id); 
                }

                if (isEditMode) {
                    const blogData = await fetchBlogById(id);
                    setTitle(blogData.title);
                    setCategory(blogData.category?._id || categoryData[0]?._id || '');
                    setDescription(blogData.description);
                    if (blogData.publishDate) {
                        setPublishDate(new Date(blogData.publishDate).toISOString().substring(0, 10));
                    }
                    setExistingImages({
                        thumbnail: blogData.imageThumbnail,
                        featured: blogData.imageFeatured,
                    });
                }
            } catch (err) {
                setError('Failed to load initial data.');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditMode]);

    // Handle File Selection with Previews
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'thumbnail') {
                setImageThumbnail(file);
                setPreviewThumbnail(URL.createObjectURL(file));
            } else {
                setImageFeatured(file);
                setPreviewFeatured(URL.createObjectURL(file));
            }
        }
    };

    // Handle Form Submission
    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        if (!isEditMode && (!imageThumbnail || !imageFeatured)) {
             setError('Both Thumbnail and Featured images are required for a new post.');
             setIsSubmitting(false);
             return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('publishDate', publishDate);

        if (imageThumbnail) formData.append('imageThumbnail', imageThumbnail);
        if (imageFeatured) formData.append('imageFeatured', imageFeatured);

        try {
            if (isEditMode) {
                await updateBlog(id, formData);
                setSuccess('Blog updated successfully!');
            } else {
                await createBlog(formData);
                setSuccess('Blog created successfully!');
                setTitle(''); setDescription(''); setImageThumbnail(null); setImageFeatured(null); setPreviewThumbnail(null); setPreviewFeatured(null);
            }
            setTimeout(() => navigate('/admin/blogs'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Blog operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    // Helper Components for Styles
    const InputWrapper = ({ label, icon, children }) => (
        <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
                {children}
            </div>
        </div>
    );

    // Modern Input Component
    const ModernInput = (props) => (
        <input 
            {...props}
            className={`w-full ${props.icon ? 'pl-10' : 'px-4'} py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 font-medium`}
        />
    );

    // Image Uploader Component
    const ImageUploader = ({ label, file, preview, existing, onChange }) => (
        <div className="bg-gray-50 p-1 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
            <label className="cursor-pointer group block relative h-56 rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 hover:border-green-500 transition-all duration-300">
                <input type="file" className="hidden" accept="image/*" onChange={onChange} disabled={isSubmitting} />
                
                {(preview || (isEditMode && existing)) ? (
                    <>
                        <img 
                            src={preview || existing} 
                            alt="Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                Change Image
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-green-600">
                        <Icons.Image />
                        <span className="mt-2 text-sm font-medium">Click to upload {label}</span>
                    </div>
                )}
            </label>
            <p className="text-center text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">{label}</p>
        </div>
    );

    // Main Render
    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500">
                        {isEditMode ? 'Edit Blog Post' : 'Create New Post'}
                    </h2>
                    <p className="text-gray-500 mt-1">Manage your content and engage your audience.</p>
                </div>
                <button onClick={() => navigate('/admin/blogs')} className="flex items-center text-gray-500 hover:text-gray-800 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md">
                    <Icons.Back /> <span className="ml-2">Cancel</span>
                </button>
            </div>
           {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r shadow-sm mb-6 flex items-center"><span className="mr-2">✓</span> {success}</div>}
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm mb-6 flex items-center"><span className="mr-2">⚠</span> {error}</div>}

            <form onSubmit={submitHandler} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <InputWrapper label="Blog Title">
                                <ModernInput 
                                    type="text" 
                                    placeholder="Enter an engaging title..." 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                />
                            </InputWrapper>
                            
                            <div className="mt-6">
                                <InputWrapper label="Content">
                                    <textarea 
                                        className="w-full h-96 p-5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 leading-relaxed resize-none"
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Start writing your story here..."
                                        disabled={isSubmitting}
                                    />
                                </InputWrapper>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Publishing Details</h3>
                            
                            <InputWrapper label="Category" icon={<Icons.Tag />}>
                                <div className="relative">
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </InputWrapper>

                            <InputWrapper label="Publish Date" icon={<Icons.Calendar />}>
                                <ModernInput 
                                    type="date" 
                                    icon={true}
                                    value={publishDate} 
                                    onChange={(e) => setPublishDate(e.target.value)} 
                                    required 
                                />
                            </InputWrapper>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-2">Featured Images</h3>
                            
                            <ImageUploader 
                                label="Thumbnail (Grid View)" 
                                file={imageThumbnail} 
                                preview={previewThumbnail} 
                                existing={existingImages.thumbnail} 
                                onChange={(e) => handleFileChange(e, 'thumbnail')} 
                            />
                            
                            <ImageUploader 
                                label="Featured (Banner View)" 
                                file={imageFeatured} 
                                preview={previewFeatured} 
                                existing={existingImages.featured} 
                                onChange={(e) => handleFileChange(e, 'featured')} 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Icons.Save /> 
                                    <span className="ml-2">{isEditMode ? 'Update Post' : 'Publish Post'}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEditBlog;