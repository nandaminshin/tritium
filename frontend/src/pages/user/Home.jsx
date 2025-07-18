import React, { useRef, useEffect, useState } from 'react';
import { List, User, Layers, Clock } from 'lucide-react';
import CategoryGrid from '../../components/user/CategoryGrid';
import { Link } from 'react-router-dom';
import { useFeaturedCourses } from '../../helpers/useCourseQueries';

const Home = () => {
    const { data: featuredCourses, isLoading, isError } = useFeaturedCourses();
    console.log('all', featuredCourses);
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

    return (
        <>
            {/* Hero Section */}
            <section className="relative text-white overflow-hidden -mt-20">
                {/* Background Image and Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/heroBackground.jpg" alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center md:justify-start min-h-[70vh] pt-36 pb-16">
                        {/* Text Content */}
                        <div className="max-w-xl text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                                The Best <span className="text-blue-400">Way</span> <br /> to Learn <span className="text-red-500">Anything</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 mb-8">
                                Equip yourself with our endless collection of courses, resources, and a community that&apos;s second to none.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">Browse Courses</button>
                                <button className="px-8 py-3 bg-transparent border-2 border-slate-600 text-slate-300 font-semibold rounded-lg shadow-sm hover:bg-slate-800 hover:text-white transition-all duration-300 cursor-pointer">Get Started</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructors Section */}
            <section className="w-full mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Meet Our Instructors</h2>
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Featured Courses</h2>
                    <div className="w-32 h-1 bg-[#232b3b] rounded mt-2"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {isLoading && <p>Loading...</p>}
                    {isError && <p>Error fetching courses</p>}
                    {featuredCourses && featuredCourses.map((course, idx) => (
                        console.log(course),
                        <div key={idx} className="bg-[#181f2a] rounded-2xl shadow-lg p-6 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-h-[340px] h-full">
                            <div className="w-full">
                                <div className="w-20 h-20 rounded-full bg-[#232b3b] flex items-center justify-center mb-4 shadow-md mx-auto">
                                    <img src="/images/tritiumlogo.png" alt="Course Logo" className="w-14 h-14 object-contain" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{course.name}</h3>
                                <div className="text-slate-300 text-sm mb-4">With {course.instructor.name}</div>
                                <div className="w-full border-t border-[#232b3b] my-2"></div>
                            </div>
                            <div className="flex flex-col gap-2 text-slate-300 text-sm w-full mt-2">
                                <span className="flex items-center gap-2"><List className="text-blue-400 w-4 h-4" /> {course.lectureCount} Episodes</span>
                                <span className="flex items-center gap-2"><User className="text-green-400 w-4 h-4" /> {course.level}</span>
                                <span className="flex items-center gap-2"><Layers className="text-purple-400 w-4 h-4" /> {course.category.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CategoryGrid />

            {/* Platform Currency Advertisement Section */}
            <section className="w-full max-w-3xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Insert Coin to Continue</h2>
                    <div className="w-56 h-1 bg-[#232b3b] rounded mt-2"></div>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg bg-[#181f2a]">
                    <img src="/images/coinBackground.jpg" alt="Coin Background" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none" />
                    <div className="relative z-10 flex flex-col items-center justify-center p-10 min-h-[340px]">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/images/tritiumlogo.png" alt="coin" className="w-24 h-24" />
                        </div>
                        <div className="bg-slate-900 rounded-lg px-6 py-2 flex items-center gap-2 mb-6">
                            <span className="font-bold text-lg text-yellow-300">Tritium Coin</span>
                        </div>
                        <div className="flex gap-2 items-center mb-4">
                            <div className="text-4xl font-extrabold text-white mb-2">1 </div>
                            <img src="/images/tritiumCoin.png" alt="coin" className="mb-2 w-12 h-12 shadow-cyan-500/50 animate-spin-slow" />
                            <div className="text-4xl font-extrabold text-white mb-2"> = 10000 MMK</div>
                        </div>
                        <div className="text-slate-300 text-center mb-8 max-w-md">Unlock all premium features, purchase Tritium Coins and enjoy the full experience of our platform. One-time purchase, no recurring fees.</div>
                        <Link to="/purchase-coin" className="w-full max-w-xs py-3 bg-slate-800 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 transform hover:-translate-y-1 transition-all duration-300 text-lg cursor-pointer text-center">
                            Purchase Coin
                        </Link>
                    </div>
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
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 6s linear infinite;
                }
            `}</style>
        </>
    )
}

export default Home
