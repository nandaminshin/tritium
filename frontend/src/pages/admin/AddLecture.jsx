import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useLectures,
    useAddLecture,
    useDeleteLecture,
    useToggleHiddenLecture,
    useReorderLectures,
    useUpdateLecture,
} from '../../helpers/useLectureQueries';
import axios from '../../helpers/Axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactDOM from 'react-dom';

const AddLecture = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [localLectures, setLocalLectures] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);

    // Fetch lectures
    const { data: lectures = [], isLoading, isError, error: fetchError } = useLectures(courseId);
    // Mutations
    const addLectureMutation = useAddLecture(courseId);
    const deleteLectureMutation = useDeleteLecture(courseId);
    const toggleHiddenMutation = useToggleHiddenLecture(courseId);
    const reorderMutation = useReorderLectures(courseId);
    const updateLectureMutation = useUpdateLecture(courseId);

    useEffect(() => {
        setLocalLectures(lectures.slice().sort((a, b) => a.order - b.order));
    }, [lectures]);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        if (!title || !order || !file) {
            setError('All fields are required.');
            setUploading(false);
            return;
        }

        let formData = new FormData();
        formData.set('video_url', file);
        let video_url_response = await axios.post(`api/admin/courses/${courseId}/lectures/upload-video`, formData, {
            headers: {
                Accept: "multipart/form-data"
            }
        });

        let lectureData = {
            title,
            order,
            video_url: video_url_response.data.video_url
        }
        addLectureMutation.mutate(lectureData, {
            onSuccess: () => {
                setTitle('');
                setOrder('');
                setFile(null);
                setPreview(null);
                setUploading(false);
                e.target.reset();
            },
            onError: (err) => {
                setError(err.response.data.error);
                setUploading(false);
            }
        });
    };

    const handleDelete = (lectureId) => {
        if (window.confirm('Delete this lecture?')) {
            deleteLectureMutation.mutate(lectureId);
        }
    };

    const handleToggleHidden = (lectureId, hidden) => {
        toggleHiddenMutation.mutate({ lectureId, hidden: !hidden });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = localLectures.findIndex((lec) => lec._id === active.id);
        const newIndex = localLectures.findIndex((lec) => lec._id === over.id);
        const newLectures = arrayMove(localLectures, oldIndex, newIndex).map((lec, idx) => ({ ...lec, order: idx + 1 }));
        setLocalLectures(newLectures);
        reorderMutation.mutate(newLectures.map((lec) => ({ _id: lec._id, order: lec.order })));
    };

    // Sortable row component for dnd-kit
    function SortableRow({ id, children }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            background: isDragging ? '#1e293b' : undefined,
        };

        return (
            <tr ref={setNodeRef} style={style} {...attributes}>
                {React.Children.map(children, (child) => {
                    if (child.props.className && child.props.className.includes('drag-handle')) {
                        return React.cloneElement(child, { ...listeners });
                    }
                    return child;
                })}
            </tr>
        );
    }

    const handleEditClick = (lecture) => {
        setEditingLecture(lecture);
        setEditModalOpen(true);
        setModalError('');
    };

    const handleEditSave = (updatedLecture) => {
        updateLectureMutation.mutate(updatedLecture, {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingLecture(null);
            },
            onError: (err) => {
                setModalError(err.response.data.error);
                setUploading(false);
            }
        });
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditingLecture(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Lectures</h1>
                <button
                    onClick={() => navigate(`/admin/courses/${courseId}`)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to Course
                </button>
            </div>

            {/* Add Lecture Form */}
            <div className="bg-[#101324] border border-gray-600 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Lecture</h2>
                <form className="space-y-4" onSubmit={handleAddLecture}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Order</label>
                        <input
                            type="number"
                            name="order"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Video</label>
                        <input
                            type="file"
                            name="video_url"
                            accept="video/*"
                            onChange={handleFileInputChange}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white"
                            required
                        />
                    </div>
                    {preview && (
                        <div className="mt-4">
                            <p className="block text-sm font-medium mb-2">Video Preview:</p>
                            <video src={preview} controls className="w-full max-w-md rounded-md border border-gray-600" />
                        </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-green-600 bg-green-950 text-green-400 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        disabled={uploading || addLectureMutation.isLoading}
                    >
                        {uploading ? 'Uploading...' : 'Add Lecture'}
                    </button>
                </form>
            </div>

            {/* List of Lectures */}
            <div className="bg-[#101324] border border-gray-600 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Lectures</h2>
                {isLoading ? (
                    <div>Loading lectures...</div>
                ) : isError ? (
                    <div className="text-red-500">{fetchError?.message || 'Failed to load lectures.'}</div>
                ) : lectures.length === 0 ? (
                    <div>No lectures added yet.</div>
                ) : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left w-12"></th>
                                        <th className="px-4 py-2 text-left w-12 align-middle">Order</th>
                                        <th className="px-4 py-2 text-center w-56">Title</th>
                                        <th className="px-4 py-2 text-left w-48 align-middle">Video</th>
                                        <th className="px-4 py-2 text-left w-16">Hidden</th>
                                        <th className="px-4 py-2 text-left w-64">Actions</th>
                                    </tr>
                                </thead>
                                <SortableContext items={localLectures.map((lec) => lec._id)} strategy={verticalListSortingStrategy}>
                                    <tbody>
                                        {localLectures.map((lecture, idx) => (
                                            <SortableRow key={lecture._id} id={lecture._id}>
                                                <td className="px-4 py-2 align-middle w-12 drag-handle cursor-move">
                                                    <i className="fa-solid fa-hand-pointer h-6 w-6"></i>
                                                </td>
                                                <td className="px-4 py-2 align-middle w-12">{lecture.order}</td>
                                                <td className="px-4 py-2 align-middle text-center w-56">{lecture.title}</td>
                                                <td className="px-4 py-2 align-middle w-48">
                                                    <video
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/courses/lectures/${lecture.video_url}`}
                                                        controls
                                                        className="w-40 h-20 rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 align-middle w-16">
                                                    <span className={lecture.hidden ? 'text-red-400' : 'text-green-400'}>
                                                        {lecture.hidden ? 'Hidden' : 'Visible'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 align-middle w-64 space-x-2">
                                                    <button
                                                        onClick={() => handleToggleHidden(lecture._id, lecture.hidden)}
                                                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-yellow-600 bg-yellow-950 text-yellow-300 hover:bg-yellow-900 cursor-pointer"
                                                    >
                                                        {lecture.hidden ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(lecture)}
                                                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-sky-600 bg-sky-950 text-sky-400 hover:bg-sky-900 cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(lecture._id)}
                                                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-red-600 bg-red-950 text-red-400 hover:bg-red-900 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </SortableRow>
                                        ))}
                                    </tbody>
                                </SortableContext>
                            </table>
                        </div>
                    </DndContext>
                )}
            </div>

            {/* Edit Lecture Modal */}
            <EditLectureModal
                open={editModalOpen}
                onClose={handleEditCancel}
                lecture={editingLecture}
                onSave={handleEditSave}
                modalError={modalError}
            />
        </div>
    );
};

// Modal component for editing a lecture
function EditLectureModal({ open, onClose, lecture, onSave, modalError }) {
    const { courseId } = useParams();
    const [title, setTitle] = useState(lecture?.title || '');
    const [hidden, setHidden] = useState(lecture?.hidden || false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    // const [modalError, setModalError] = useState('');

    useEffect(() => {
        setTitle(lecture?.title || '');
        setHidden(lecture?.hidden || false);
        setFile(null);
        setPreview(null);
    }, [lecture]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleSave = async () => {
        let updatedLecture = { ...lecture, title, hidden };

        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('video_url', file);
            formData.append('old_video_url', lecture.video_url);

            try {
                // Upload new video
                const res = await axios.post(`/api/admin/courses/${courseId}/lectures/upload-video`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                updatedLecture.video_url = res.data.video_url;
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploading(false);
                return; // Stop if upload fails
            }
        }

        onSave(updatedLecture);
        setUploading(false);
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#101324] border border-gray-600 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Lecture</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Video</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white"
                        />
                    </div>
                    {preview && (
                        <div className="mt-2">
                            <video src={preview} controls className="w-full max-w-xs rounded-md border border-gray-600" />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={hidden}
                            onChange={e => setHidden(e.target.checked)}
                            id="edit-hidden-checkbox"
                        />
                        <label htmlFor="edit-hidden-checkbox" className="text-sm">Hidden</label>
                    </div>
                </div>
                {modalError && (
                    <div className="text-red-500 text-sm mt-2">{modalError}</div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-green-600 bg-green-950 text-green-400 hover:bg-green-900 cursor-pointer"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddLecture;
