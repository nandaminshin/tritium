import React, { useEffect, useState } from 'react';
import axios from '../../helpers/Axios';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/user/categories')
            .then(res => {
                setCategories(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load categories');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-white text-center py-8">Loading categories...</div>;
    if (error) return <div className="text-red-400 text-center py-8">{error}</div>;

    return (
        <section className="w-full max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Pick a Topic. Any Topic.</h2>
                <div className="w-56 h-1 bg-[#232b3b] rounded mt-2"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categories.map((cat, idx) => (
                    <div key={cat._id || idx} className="bg-[#232b3b] rounded-lg flex items-center justify-between px-6 py-6 min-h-[90px] shadow hover:shadow-xl transition-all border border-transparent hover:border-blue-500">
                        <span className="font-mono text-base text-slate-100">{cat.name}</span>
                        <img src="/images/tritiumlogo.png" alt="atom" className="w-10 h-10 object-contain opacity-80" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
