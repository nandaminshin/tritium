import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Target, Award } from 'lucide-react';

const About = () => {
    const teamMembers = [
        { name: 'Mina', role: 'Lead Instructor', img: '/images/mina1.jpg' },
        { name: 'Sana', role: 'Product Manager', img: '/images/Sana1.jpg' },
        { name: 'Momo', role: 'UX Designer', img: '/images/momo1.jpg' },
        { name: 'Tzuyu', role: 'Lead Developer', img: '/images/tzuyu1.jpg' },
    ];

    const stats = [
        { icon: <BookOpen size={40} className="text-blue-400" />, value: '1,200+', label: 'Courses Offered' },
        { icon: <Users size={40} className="text-green-400" />, value: '150,000+', label: 'Students Enrolled' },
        { icon: <Award size={40} className="text-yellow-400" />, value: '50+', label: 'Expert Instructors' },
        { icon: <Target size={40} className="text-red-400" />, value: '95%', label: 'Completion Rate' },
    ];

    return (
        <div className="bg-gradient-to-br from-[#03050a] to-[#000721] text-white" style={{ marginTop: '-85px' }}>
            {/* Hero Section */}
            <section className="relative text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/heroBackground.jpg" alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-[60vh] pt-36 pb-16">
                        <div className="max-w-3xl text-center">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                                About <span className="text-blue-400">Tritium</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200">
                                We are on a mission to make high-quality education accessible to everyone, everywhere. Join us to unlock your potential.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Our Mission & Vision</h2>
                        <div className="w-24 h-1 bg-[#232b3b] rounded mt-2 mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-slate-300 leading-relaxed">
                                At Tritium, our mission is to democratize education by providing a platform where anyone can learn new skills from industry experts. We believe that learning should be a lifelong journey, and we are committed to creating a supportive and engaging environment for our global community of learners.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Our vision is to become the leading destination for online learning, known for our high-quality content, innovative teaching methods, and the success of our students. We aim to empower individuals to achieve their personal and professional goals through accessible and affordable education.
                            </p>
                        </div>
                        <div>
                            <img src="/images/homepageimage1.png" alt="Our Mission" className="rounded-2xl shadow-lg w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#131a2a]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                {stat.icon}
                                <div className="text-4xl font-extrabold mt-2">{stat.value}</div>
                                <div className="text-slate-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Meet the Team</h2>
                        <div className="w-24 h-1 bg-[#232b3b] rounded mt-2 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center">
                                <img src={member.img} alt={member.name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-slate-700" />
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-slate-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-slate-300 mb-8">
                        Browse our extensive catalog of courses and find the perfect one to kickstart your learning adventure.
                    </p>
                    <Link to="/courses" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        Browse Courses
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;