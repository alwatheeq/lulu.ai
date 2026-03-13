import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send } from 'lucide-react';
import { posts, currentUser } from '../data/mockData';

const Post = ({ post, index }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    const toggleLike = () => {
        if (liked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setLiked(!liked);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 mb-8 hover:border-rose-500/20 transition-all duration-300 group"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-500">
                            <img src={post.user.avatar} alt={post.user.name} className="w-full h-full rounded-full object-cover border-2 border-zinc-900" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-900">PRO</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg font-serif">{post.user.name}</h4>
                        <p className="text-xs text-gray-400 font-medium tracking-wide">{post.user.handle} • {post.time}</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white transition rounded-full p-2 hover:bg-white/5">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <p className="text-gray-200 mb-4 leading-relaxed text-[15px]">{post.content}</p>

            {/* Tags */}
            {post.tags && (
                <div className="flex gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-rose-400 text-xs font-semibold hover:underline cursor-pointer">{tag}</span>
                    ))}
                </div>
            )}

            {/* Image */}
            {post.image && (
                <div className="rounded-[2rem] overflow-hidden mb-6 relative aspect-video group-hover:shadow-[0_0_30px_rgba(244,63,94,0.1)] transition-all">
                    <img src={post.image} alt="Post" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleLike}
                        className={`flex items-center gap-2 transition group/like ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Heart className={`w-6 h-6 transition-transform group-active/like:scale-75 ${liked ? 'fill-current' : ''}`} />
                        <span className="font-medium text-sm">{likeCount}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition group/comment">
                        <MessageCircle className="w-6 h-6 group-hover/comment:-translate-y-1 transition-transform" />
                        <span className="font-medium text-sm">{post.comments}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition group/share">
                        <Send className="w-6 h-6 -rotate-45 group-hover/share:translate-x-1 group-hover/share:-translate-y-1 transition-transform" />
                    </button>
                </div>

                <button className="text-gray-400 hover:text-violet-400 transition">
                    <Bookmark className="w-6 h-6" />
                </button>
            </div>
        </motion.div>
    );
};

const Community = () => {
    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Feed Column */}
            <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar pb-20">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-zinc-950/80 backdrop-blur-xl p-4 z-20 rounded-2xl border border-white/5 mx-1">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">The Tribe</h1>
                        <p className="text-gray-400 text-sm">Inspiring stories from the Lulu global community.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2 shadow-rose-500/20">
                        <span className="text-xl leading-none font-light">+</span>
                        <span>Create</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {posts.map((post, i) => (
                        <Post key={post.id} post={post} index={i} />
                    ))}
                </div>
            </div>

            {/* Suggested / Sidebar Column */}
            <div className="hidden lg:block lg:col-span-4 space-y-8">
                {/* Trending Tags */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6">
                    <h3 className="text-lg font-bold text-white mb-4 font-serif">Trending Now</h3>
                    <div className="flex flex-wrap gap-2">
                        {["#MorningRoutine", "#PlantBased", "#MarathonPrep", "#YogaEveryday", "#LuluEats"].map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/20 border border-white/10 rounded-xl text-xs text-gray-300 transition cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Suggested Users */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6">
                    <h3 className="text-lg font-bold text-white mb-6 font-serif">Who to Watch</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Fitness Pro {i + 1}</p>
                                        <p className="text-xs text-gray-400">@fitpro_{i}</p>
                                    </div>
                                </div>
                                <button className="text-rose-400 text-xs font-bold hover:text-rose-300">Follow</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Community;
