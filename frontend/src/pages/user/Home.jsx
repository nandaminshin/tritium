import React, { useRef, useEffect, useState } from 'react'
import { List, User, Layers, Clock } from 'lucide-react';

const Home = () => {
    const instructorImages = [
        { name: 'Mina', role: 'Instructor', img: '/images/mina1.jpg' },
        { name: 'Dubu', role: 'Instructor', img: '/images/dubu2.jpg' },
        { name: 'Mina', role: 'Instructor', img: '/images/mina2.jpg' },
        { name: 'Godji', role: 'Instructor', img: '/images/godji.jpg' },
        { name: 'Sana', role: 'Instructor', img: '/images/sana2.jpg' },
        { name: 'Mina', role: 'Instructor', img: '/images/mina3.jpg' },
        { name: 'Dubu', role: 'Instructor', img: '/images/dubu1.jpg' },
        { name: 'Nayeon', role: 'Instructor', img: '/images/nayeon1.jpg' },
        { name: 'Tzuyu', role: 'Instructor', img: '/images/tzuyu3.jpg' },
        { name: 'Tzuyu', role: 'Instructor', img: '/images/tzuyu1.jpg' },
        { name: 'Tzuyu', role: 'Instructor', img: '/images/tzuyu2.jpg' },
        { name: 'Momo', role: 'Instructor', img: '/images/momo2.jpg' },
        { name: 'Nayeon', role: 'Instructor', img: '/images/nayeon3.jpg' },
        { name: 'Momo', role: 'Instructor', img: '/images/momo1.jpg' },
        { name: 'Nayeon', role: 'Instructor', img: '/images/nayeon2.jpg' },
        { name: 'Sana', role: 'Instructor', img: '/images/Sana1.jpg' },
    ];

    const containerRef = useRef(null);
    const [scrollDistance, setScrollDistance] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        const updateScroll = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const totalImagesWidth = instructorImages.length * 350;
                const distance = Math.max(0, totalImagesWidth - containerWidth);
                setScrollDistance(distance);
            }
        };
        updateScroll();
        window.addEventListener('resize', updateScroll);
        return () => window.removeEventListener('resize', updateScroll);
    }, [instructorImages.length]);

    // JS-based auto-scroll
    useEffect(() => {
        if (!autoScroll) return;
        const container = containerRef.current;
        if (!container) return;
        let start = null;
        let animationFrame;
        const duration = 60000; // 60s
        const initialScroll = container.scrollLeft;
        const targetScroll = scrollDistance;

        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            container.scrollLeft = initialScroll + (targetScroll - initialScroll) * progress;
            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        }
        if (targetScroll > 0) {
            animationFrame = requestAnimationFrame(step);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [scrollDistance, autoScroll]);

    // Stop auto-scroll on user interaction
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const stopAutoScroll = () => setAutoScroll(false);
        container.addEventListener('wheel', stopAutoScroll, { passive: true });
        container.addEventListener('touchstart', stopAutoScroll, { passive: true });
        container.addEventListener('mousedown', stopAutoScroll, { passive: true });
        return () => {
            container.removeEventListener('wheel', stopAutoScroll);
            container.removeEventListener('touchstart', stopAutoScroll);
            container.removeEventListener('mousedown', stopAutoScroll);
        };
    }, []);

    // Demo featured courses
    const featuredCourses = [
        {
            title: 'Running Clock',
            instructor: 'Simon Vrachiotis',
            episodes: 3,
            level: 'Beginner',
            category: 'Tooling',
        },
        {
            title: 'Supercharged Search with Typesense',
            instructor: 'Jeffrey Way',
            episodes: 22,
            level: 'Intermediate',
            category: 'Tooling',
        },
        {
            title: 'shadcn/ui Deconstructed',
            instructor: 'Simon Vrachiotis',
            episodes: 10,
            level: 'Advanced',
            category: 'Frameworks',
        },
        {
            title: 'JavaScript Essentials for PHP Developers',
            instructor: 'Jeremy McPeak',
            episodes: 35,
            level: 'Beginner',
            category: 'Languages',
        },
        {
            title: 'The Definition Series',
            instructor: 'Jeremy McPeak',
            episodes: 10,
            level: 'Beginner',
            category: 'Tooling',
        },
        {
            title: 'Crafting Vue Modals',
            instructor: 'Jeffrey Way',
            episodes: 7,
            level: 'Intermediate',
            category: 'Frontend',
        },
        {
            title: 'React from Scratch',
            instructor: 'Jeremy McPeak',
            episodes: 15,
            level: 'Beginner',
            category: 'Frontend',
        },
        {
            title: 'Object-Oriented Principles in PHP',
            instructor: 'Jeremy McPeak',
            episodes: 20,
            level: 'Advanced',
            category: 'Languages',
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[70vh] text-white overflow-hidden py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Text Content */}
                <div className="relative z-10 flex-1 max-w-xl text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                        The Best <span className="text-blue-400">Way</span> <br /> to Learn <span className="text-red-500">Anything</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-8">
                        Equip yourself with our endless collection of courses, resources, and a community that&apos;s second to none.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="px-8 py-3 bg-white text-slate-900 font-semibold rounded shadow hover:bg-slate-100 transition">Browse</button>
                        <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition">Get Started</button>
                    </div>
                </div>
                {/* Hero Image */}
                <div className="relative flex-1 flex justify-center md:justify-end mt-10 md:mt-0 z-10">
                    <img src="/images/homepageimage1.png" alt="Learning Banner" className="w-80 md:w-[420px] h-auto rounded-xl shadow-2xl object-cover" />
                </div>
            </section>

            {/* Instructors Section */}
            <section className="w-full mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">World-Class Instructors</h2>
                    <div className="w-24 h-1 bg-[#232b3b] rounded mt-2"></div>
                </div>
                <div className="relative overflow-x-auto hide-scrollbar" ref={containerRef}>
                    <div
                        className="flex min-w-fit"
                    >
                        {instructorImages.map((inst, idx) => (
                            <div key={idx} className="relative w-[350px] h-[420px] flex-shrink-0">
                                <img
                                    src={inst.img}
                                    alt={inst.name}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500 cursor-pointer"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                                    <div className="text-xl font-bold text-white drop-shadow">{inst.name}</div>
                                    <div className="text-md text-slate-200">{inst.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Featured Courses Section */}
            <section className="w-full max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">A Stream of Courses</h2>
                    <div className="w-32 h-1 bg-[#232b3b] rounded mt-2"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {featuredCourses.map((course, idx) => (
                        <div key={idx} className="bg-[#181f2a] rounded-2xl shadow-lg p-6 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-h-[340px] h-full">
                            <div className="w-full">
                                <div className="w-20 h-20 rounded-full bg-[#232b3b] flex items-center justify-center mb-4 shadow-md mx-auto">
                                    <img src="/images/tritiumlogo.png" alt="Course Logo" className="w-14 h-14 object-contain" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                                <div className="text-slate-300 text-sm mb-4">With {course.instructor}</div>
                                <div className="w-full border-t border-[#232b3b] my-2"></div>
                            </div>
                            <div className="flex flex-col gap-2 text-slate-300 text-sm w-full mt-2">
                                <span className="flex items-center gap-2"><List className="text-blue-400 w-4 h-4" /> {course.episodes} Episodes</span>
                                <span className="flex items-center gap-2"><User className="text-green-400 w-4 h-4" /> {course.level}</span>
                                <span className="flex items-center gap-2"><Layers className="text-purple-400 w-4 h-4" /> {course.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </>
    )
}

export default Home
