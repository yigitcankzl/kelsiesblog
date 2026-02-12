import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, ChevronUp, ChevronDown, Image, MapPin, Type } from 'lucide-react';
import { useBlogStore } from '../../store/store';
import { BlogPost, Section } from '../../types';
import { countryBounds } from '../../data/countryBounds';

interface PostFormProps {
    post: BlogPost | null;
    onSave: () => void;
    onCancel: () => void;
}

const emptySection: Section = { heading: '', content: '', image: '' };

export default function PostForm({ post, onSave, onCancel }: PostFormProps) {
    const { addPost, updatePost } = useBlogStore();

    const [title, setTitle] = useState(post?.title || '');
    const [country, setCountry] = useState(post?.country || '');
    const [city, setCity] = useState(post?.city || '');
    const [lat, setLat] = useState(post?.coordinates[0]?.toString() || '');
    const [lng, setLng] = useState(post?.coordinates[1]?.toString() || '');
    const [coverImage, setCoverImage] = useState(post?.coverImage || '');
    const [sections, setSections] = useState<Section[]>(
        post?.sections?.length ? post.sections : [{ ...emptySection }]
    );

    const isEditing = post !== null;

    const addSection = () => {
        setSections([...sections, { ...emptySection }]);
    };

    const removeSection = (index: number) => {
        if (sections.length <= 1) return;
        setSections(sections.filter((_, i) => i !== index));
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updated = sections.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
        );
        setSections(updated);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSections(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanSections = sections
            .filter(s => s.heading.trim() || s.content.trim())
            .map(s => ({
                heading: s.heading.trim(),
                content: s.content.trim(),
                ...(s.image?.trim() ? { image: s.image.trim() } : {}),
            }));

        const postData: BlogPost = {
            id: post?.id || `post-${Date.now()}`,
            title: title.trim(),
            country: country.trim(),
            city: city.trim(),
            coordinates: [parseFloat(lat), parseFloat(lng)],
            coverImage: coverImage.trim(),
            sections: cleanSections,
        };

        if (isEditing) {
            updatePost(post.id, postData);
        } else {
            addPost(postData);
        }

        onSave();
    };

    const isValid = title.trim() && country.trim() && city.trim() && lat && lng && sections.some(s => s.heading.trim() && s.content.trim());

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    {isEditing ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Basic Information
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Temples & Tea in Kyoto"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm cursor-pointer"
                                required
                            >
                                <option value="">Select country...</option>
                                {countryBounds.map((c) => (
                                    <option key={c.code} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Kyoto"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="35.0116"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="135.7681"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            <Image className="w-3.5 h-3.5" />
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                        />
                        {coverImage && (
                            <div className="mt-2 rounded-xl overflow-hidden h-32">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Content Sections ({sections.length})
                    </h3>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addSection}
                        className="flex items-center gap-1.5 text-[#2d6a4f] hover:text-[#1a472a] text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Section
                    </motion.button>
                </div>

                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-2 border-gray-100 rounded-xl p-4 relative group hover:border-gray-200 transition-colors"
                        >
                            {/* Section number badge */}
                            <div className="absolute -top-3 left-4 bg-[#2d6a4f] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                {index + 1}
                            </div>

                            {/* Section controls */}
                            <div className="absolute -top-3 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0}
                                    className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === sections.length - 1}
                                    className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeSection(index)}
                                    disabled={sections.length <= 1}
                                    className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-3 mt-2">
                                <input
                                    type="text"
                                    value={section.heading}
                                    onChange={(e) => updateSection(index, 'heading', e.target.value)}
                                    placeholder="Section Heading"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium"
                                />
                                <textarea
                                    value={section.content}
                                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                                    placeholder="Write your story here..."
                                    rows={4}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm resize-y"
                                />
                                <input
                                    type="url"
                                    value={section.image || ''}
                                    onChange={(e) => updateSection(index, 'image', e.target.value)}
                                    placeholder="Image URL (optional)"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 justify-end">
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    Cancel
                </motion.button>
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!isValid}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#1a472a] to-[#2d6a4f] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <Save className="w-4 h-4" />
                    {isEditing ? 'Update Post' : 'Publish Post'}
                </motion.button>
            </div>
        </form>
    );
}
