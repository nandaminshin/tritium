import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, Check } from 'lucide-react';
import Axios from '../../helpers/Axios';

const LectureVideo = () => {
    const { courseId, lectureId } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextLecture, setNextLecture] = useState(null);
    const [previousLecture, setPreviousLecture] = useState(null);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchLectureData = async () => {
            try {
                const [lectureRes, enrollmentRes] = await Promise.all([
                    Axios.get(`/api/user/courses/${courseId}/lectures/${lectureId}`),
                    Axios.get(`/api/user/courses/${courseId}/enrollment`)
                ]);

                if (lectureRes.data.success) {
                    setLecture(lectureRes.data.data);
                    setNextLecture(lectureRes.data.data.nextLecture);
                    setPreviousLecture(lectureRes.data.data.previousLecture);
                }
                if (enrollmentRes.data.success) {
                    setEnrollment(enrollmentRes.data.data);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load lecture');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLectureData();
    }, [courseId, lectureId]);

    const handleMarkComplete = async () => {
        setIsCompleting(true);
        try {
            const response = await Axios.post(`/api/user/courses/${courseId}/lectures/${lectureId}/complete`);
            if (response.data.success) {
                // Update enrollment progress
                setEnrollment(prev => ({
                    ...prev,
                    completedLectures: [...(prev.enrollment?.completedLectures || []), lectureId]
                }));
            }
        } catch (error) {
            console.error('Failed to mark lecture as complete:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await Axios.get(
                `/api/user/courses/${courseId}/lectures/${lectureId}/download`,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${lecture.title}.mp4`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download lecture:', error);
        }
    };

    const navigateToLecture = (lectureId) => {
        if (lectureId) {
            navigate(`/courses/${courseId}/lectures/${lectureId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error || !lecture) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white flex items-center justify-center">
                {error || 'Lecture not found'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#03050a] to-[#000721] text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="aspect-video bg-[#131a2a] rounded-xl overflow-hidden mb-6">
                    <video
                        key={lecture._id}
                        src={`${import.meta.env.VITE_BACKEND_URL}/courses/lectures/${lecture.video_url}`}
                        controls
                        className="w-full h-full"
                        autoPlay
                    />
                </div>

                <div className="bg-[#131a2a] rounded-xl p-6">
                    <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>

                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => navigateToLecture(previousLecture?._id)}
                            disabled={!previousLecture}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${previousLecture
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-600 cursor-not-allowed'
                                } transition-colors`}
                        >
                            <ArrowLeft size={20} />
                            Previous
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={handleMarkComplete}
                                disabled={isCompleting || enrollment?.completedLectures?.includes(lectureId)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${enrollment?.completedLectures?.includes(lectureId)
                                    ? 'bg-green-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } transition-colors`}
                            >
                                <Check size={20} />
                                {enrollment?.completedLectures?.includes(lectureId)
                                    ? 'Completed'
                                    : isCompleting
                                        ? 'Marking...'
                                        : 'Mark as Complete'}
                            </button>

                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <Download size={20} />
                                Download
                            </button>
                        </div>

                        <button
                            onClick={() => navigateToLecture(nextLecture?._id)}
                            disabled={!nextLecture}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${nextLecture
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-600 cursor-not-allowed'
                                } transition-colors`}
                        >
                            Next
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureVideo;
