import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#101324] text-slate-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and About */}
                    <div className="flex flex-col items-center md:items-start">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="/images/tritiumlogo.png" alt="Tritium Logo" className="w-10 h-10" />
                            <span className="text-2xl font-bold text-white">Tritium</span>
                        </Link>
                        <p className="text-sm text-slate-400 text-center md:text-left">
                            Empowering the next generation of learners with cutting-edge online courses.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={24} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={24} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Github size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Tritium. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
