import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, User, Layers, Clock, Play, Lock, Check } from 'lucide-react';
import Axios from '../../helpers/Axios';

// Enrollment Modal Component
const EnrollmentModal = ({
    showEnrollModal,
    setShowEnrollModal,
    course,
    studentData,
    error,
    enrolling,
    handleEnroll
}) => {
    if (!showEnrollModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#131a2a] rounded-xl p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-6">Course Enrollment</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span>Course Price:</span>
                        <span className="text-blue-400">{course.price} Coins</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Your Balance:</span>
                        <span className="text-green-400">{studentData?.coinAmount || 0} Coins</span>
                    </div>
                    <div className="border-t border-[#232b3b] my-4"></div>
                    <div className="flex justify-between items-center">
                        <span>Remaining Balance:</span>
                        <span className={`${(studentData?.coinAmount || 0) - course.price < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {(studentData?.coinAmount || 0) - course.price} Coins
                        </span>
                    </div>
                    {(studentData?.coinAmount || 0) < course.price && (
                        <div className="mt-4 text-center">
                            <a
                                href="/purchase-coin"
                                className="inline-block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                            >
                                Purchase More Coins
                            </a>
                            <p className="text-sm text-slate-400 mt-2">
                                You need {course.price - (studentData?.coinAmount || 0)} more coins to enroll
                            </p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="text-red-400 mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => setShowEnrollModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEnroll}
                        disabled={enrolling || (studentData?.coinAmount || 0) < course.price}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${(studentData?.coinAmount || 0) < course.price
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [enrollment, setEnrollment] = useState(null);

    // Fetch student data including coin balance
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await Axios.get('/api/user/student/data');
                if (response.data.success) {
                    setStudentData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch student data:', error);
            }
        };

        fetchStudentData();
    }, []);

    // Handle course enrollment
    const handleEnroll = async () => {
        setEnrolling(true);
        setError(null);
        try {
            const response = await Axios.post(`/api/user/courses/${id}/enroll`);
            if (response.data.success) {
                // Refresh student data and enrollment after successful enrollment
                const [updatedStudent, updatedEnrollment] = await Promise.all([
                    Axios.get('/api/user/student/data'),
                    Axios.get(`/api/user/courses/${id}/enrollment`)
                ]);

                setStudentData(updatedStudent.data.data);
                setEnrollment(updatedEnrollment.data.data);
                setShowEnrollModal(false);
                setShowSuccess(true);

                // Hide success message after 5 seconds
                setTimeout(() => setShowSuccess(false), 5000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
            setError(errorMessage);

            if (error.response?.data?.redirectTo === '/purchase-coin') {
                const wantToPurchase = window.confirm('Would you like to purchase more coins?');
                if (wantToPurchase) {
                    window.location.href = '/purchase-coin';
                }
            }
        } finally {
            setEnrolling(false);
        }
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const [courseRes, enrollmentRes] = await Promise.all([
                    Axios.get(`/api/user/courses/${id}`),
                    Axios.get(`/api/user/courses/${id}/enrollment`)
                ]);

                if (courseRes.data.success) {
                    const courseData = courseRes.data.data;
                    setCourse(courseData);

                    // Calculate total duration from visible lectures only
                    if (courseData.lectures && Array.isArray(courseData.lectures)) {
                        const visibleLectures = courseData.lectures.filter(lecture => !lecture.hidden);
                        const total = visibleLectures.reduce((acc, lecture) => acc + (lecture.duration || 0), 0);
                        setTotalDuration(total);
                    } else {
                        setTotalDuration(0);
                    }
                }

                if (enrollmentRes.data.success) {
                    setEnrollment(enrollmentRes.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch course details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();

    }, [id]);



    if (isLoading) {
        return <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white flex items-center justify-center">
            Loading...
        </div>;
    }

    if (!course) {
        return <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white flex items-center justify-center">
            Course not found
        </div>;
    }

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLectureClick = (lecture) => {
        if (!enrollment) {
            setShowEnrollModal(true);
            return;
        }
        navigate(`/courses/${id}/lectures/${lecture._id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white" style={{ marginTop: '-90px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {/* Success Message */}
                {showSuccess && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                        <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center z-10 animate-bounce">
                            <Check className="w-6 h-6 mr-3" />
                            <span className="text-lg">Congratulations! You have successfully enrolled in this course</span>
                        </div>
                    </div>
                )}

                {/* Enrollment Modal */}
                <EnrollmentModal
                    showEnrollModal={showEnrollModal}
                    setShowEnrollModal={setShowEnrollModal}
                    course={course}
                    studentData={studentData}
                    error={error}
                    enrolling={enrolling}
                    handleEnroll={handleEnroll}
                />
                {/* Intro Video Section */}
                {course.introVideo && (
                    <div className="w-full aspect-video mb-8 bg-[#131a2a] rounded-xl overflow-hidden">
                        <video
                            src={`${import.meta.env.VITE_BACKEND_URL}/courses/${course.introVideo}`}
                            controls
                            className="w-full h-full object-contain"
                            poster={`${import.meta.env.VITE_BACKEND_URL}/courses/${course.image}`}
                        />
                    </div>
                )}

                {/* Course Header */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-bold">{course.name}</h1>
                        <div className="flex items-center gap-4">
                            {enrollment?.isEnrolled ? (
                                <div className="flex gap-4">
                                    <button
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Contact Instructor
                                    </button>
                                    <button
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Drop Course
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-2xl text-blue-400">{course.price} Coins</p>
                                    <button
                                        onClick={() => setShowEnrollModal(true)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Enroll Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 text-slate-300">
                        <span className="flex items-center gap-2">
                            <List className="text-blue-400 w-5 h-5" />
                            {course.lectures?.length || 0} Episodes
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="text-green-400 w-5 h-5" />
                            {formatDuration(totalDuration)} total
                        </span>
                        <span className="flex items-center gap-2">
                            <User className="text-yellow-400 w-5 h-5" />
                            {course.level}
                        </span>
                        <span className="flex items-center gap-2">
                            <Layers className="text-purple-400 w-5 h-5" />
                            {course.category?.name}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="text-blue-400 w-5 h-5" />
                            Created on {formatDate(course.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Course Description */}
                    <div className="md:col-span-2 bg-[#131a2a] rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                        <p className="text-slate-300 whitespace-pre-line">{course.description}</p>
                    </div>

                    {/* Instructor Info */}
                    <div className="bg-[#131a2a] rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                        <div className="flex items-center gap-4">
                            <img
                                src={course.instructor?.image ? `${import.meta.env.VITE_BACKEND_URL}/users/${course.instructor.image}` : "/images/tritiumlogo.png"}
                                alt={course.instructor?.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{course.instructor?.name}</h3>
                                <p className="text-slate-400">Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Course Content</h2>
                        {enrollment?.isEnrolled && (
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-48 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                        style={{ width: `${enrollment.enrollment?.completionPercentage || 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-green-500 font-medium">
                                    {Math.round(enrollment.enrollment?.completionPercentage || 0)}% Complete
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#131a2a] rounded-xl">
                        {course.lectures && course.lectures.length > 0 ? (
                            course.lectures
                                .filter(lecture => !lecture.hidden)  // Only show non-hidden lectures
                                .sort((a, b) => a.order - b.order)  // Sort by order
                                .map((lecture, index) => (
                                    <div
                                        key={lecture._id}
                                        onClick={() => handleLectureClick(lecture)}
                                        className={`flex items-center justify-between p-4 ${index !== 0 ? 'border-t border-[#232b3b]' : ''
                                            } hover:bg-[#1c2539] cursor-pointer transition-colors`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400">{index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                {enrollment?.enrollment ? (
                                                    <>
                                                        <Play className="w-4 h-4 text-blue-400" />
                                                        {enrollment.enrollment.completedLectures?.includes(lecture._id) && (
                                                            <Check className="w-4 h-4 text-green-400" />
                                                        )}
                                                    </>
                                                ) : (
                                                    <Lock className="w-4 h-4 text-yellow-400" />
                                                )}
                                            </div>
                                            <span className="font-medium">{lecture.title}</span>
                                        </div>
                                        <span className="text-slate-400">{formatDuration(lecture.duration)}</span>
                                    </div>
                                ))
                        ) : (
                            <div className="p-4 text-slate-400">No lectures available yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
