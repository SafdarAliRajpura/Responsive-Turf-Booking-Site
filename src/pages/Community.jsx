import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Calendar,
    Heart, Share2, MessageCircle, Plus, X, Send
} from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import SplitText from '../components/common/SplitText';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import userAvatarImg from '../assets/images/common/user-avatar.jpg';
import apiClient from '../utils/apiClient';
import LeaderboardCard from '../components/common/LeaderboardCard';

export default function Community() {
    const [discussions, setDiscussions] = useState([]);
    const [events, setEvents] = useState([]);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
    const [user, setUser] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [platformStats, setPlatformStats] = useState({ users: 0, venues: 0, tournaments: 0, recentAvatars: [] });
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
        
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [discRes, eventRes, statsRes] = await Promise.all([
                apiClient.get('/community/discussions'),
                apiClient.get('/community/events'),
                apiClient.get('/analytics/platform-stats')
            ]);
            setDiscussions(discRes.data);
            setEvents(eventRes.data);
            if (statsRes.data?.success) {
                setPlatformStats(statsRes.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch community data:', err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) return;
        try {
            const res = await apiClient.post('/community/discussions', newPost);
            setDiscussions([res.data, ...discussions]);
            setIsCreatingPost(false);
            setNewPost({ title: '', content: '', category: 'General' });
            fetchData();
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('Please login to post a discussion.');
        }
    };

    const handleLike = async (id) => {
        if (!user) return alert("Please login first.");
        try {
            await apiClient.put(`/community/discussions/${id}/like`);
            fetchData();
        } catch (err) {
            console.error('Like error:', err);
        }
    };


    const handleComment = async (id) => {
        if (!user) return alert("Please login to participate in the discussion.");
        if (!commentText.trim()) return;

        try {
            await apiClient.post(`/community/discussions/${id}/comment`, { text: commentText });
            setCommentText("");
            fetchData();
        } catch (err) {
            console.error('Comment error:', err);
            alert("Failed to post comment.");
        }
    };

    useEffect(() => {
        if (selectedDiscussion) {
            const updated = discussions.find(d => d._id === selectedDiscussion._id);
            if (updated) setSelectedDiscussion(updated);
        }
    }, [discussions, selectedDiscussion]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden">

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                <div className="relative mb-24 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                    <div className="relative z-10 flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 mb-8 backdrop-blur-md shadow-lg shadow-neon-blue/10"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Community Live Hub</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-tight"
                        >
                            <span className="block mb-2 drop-shadow-2xl"><SplitText>Connect.</SplitText></span>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-violet-500 to-purple-500 inline-block min-w-[300px] drop-shadow-[0_0_30px_rgba(100,100,255,0.4)]">
                                <TypeAnimation
                                    sequence={['Compete.', 2000, 'Collaborate.', 2000, 'Challenge.', 2000]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    cursor={false}
                                />
                            </div>
                            <span className="block mt-2 drop-shadow-2xl"><SplitText>Conquer.</SplitText></span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                            className="text-slate-400 max-w-xl text-xl mb-10 leading-relaxed font-light"
                        >
                            Join the ultimate sports ecosystem. Find reliable teammates, discuss pro strategies, and participate in exclusive city-wide events.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                            className="flex items-center gap-6"
                        >
                            <button 
                                onClick={() => setIsCreatingPost(true)}
                                className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-2xl hover:bg-neon-blue hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-neon-blue/40 hover:-translate-y-1 flex items-center gap-2"
                            >
                                Start Discussion <Plus className="w-5 h-5" />
                            </button>
                            <div className="flex -space-x-4">
                                {(platformStats.recentAvatars?.length > 0 
                                    ? platformStats.recentAvatars.slice(0, 5) 
                                    : [1, 2, 3, 4]).map((avatar, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden relative shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                                        <img src={typeof avatar === 'string' ? avatar : userAvatarImg} alt="User" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center text-[10px] font-black text-white z-10 shadow-xl shadow-neon-blue/20">
                                    {platformStats.users > 5 ? `${(platformStats.users - 5).toLocaleString()}+` : 'JOIN'}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="relative hidden lg:flex items-center justify-center min-h-[500px]"
                    >
                        <div className="relative w-full max-w-sm mx-auto">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[30px] p-8 shadow-2xl overflow-hidden group hover:border-white/20 transition-colors"
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                <div className="mb-8 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                                        </span>
                                        <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Live Pulse</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        {platformStats.users?.toLocaleString() || '1,000'}+
                                    </h2>
                                    <p className="text-sm text-slate-400 font-medium mt-1">Real-time Platform Users</p>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {[...discussions, ...events]
                                        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                                        .slice(0, 3)
                                        .map((item, i) => {
                                            const isEvent = !!item.date;
                                            const Icon = isEvent ? Calendar : MessageCircle;
                                            const color = isEvent ? "text-neon-green" : "text-neon-blue";
                                            return (
                                                <div key={item._id || i} className="flex items-center gap-4 group/item">
                                                    <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-white/20 transition-colors ${color}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-white leading-none mb-1 group-hover/item:text-neon-blue transition-colors truncate">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                                            {isEvent ? `Event Organized by ${item.organizer?.first_name || 'Admin'}` : `New Discussion by ${item.author?.first_name || 'Anonymous'}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-xs font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                                        Join The Action <Share2 className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] pointer-events-none opacity-50" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-neon-blue" /> Trending Discussions
                            </h2>
                            <button className="text-sm text-neon-blue font-bold hover:text-white transition-colors">View All</button>
                        </div>

                        {discussions.map((post, i) => {
                            const isLiked = user && post.likes.includes(user._id);
                            return (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
                                    onClick={() => setSelectedDiscussion(post)}
                                    className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-neon-blue/30 transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-bl-[100px] pointer-events-none group-hover:bg-neon-blue/10 transition-colors" />
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <img src={post.author?.user_profile || userAvatarImg} alt="Author" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-neon-blue transition-colors truncate max-w-[200px] md:max-w-md">{post.title}</h3>
                                                <p className="text-xs text-slate-500 mt-1">By <span className="text-white">{post.author?.first_name || 'Anonymous'}</span> • {new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/5 whitespace-nowrap">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="mb-4 text-sm text-slate-300 line-clamp-2 relative z-10">{post.content}</div>
                                    <div className="flex items-center gap-6 text-slate-400 text-sm relative z-10">
                                        <button onClick={(e) => { e.stopPropagation(); handleLike(post._id); }} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-neon-pink' : 'hover:text-neon-pink'}`}>
                                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {post.likes.length}
                                        </button>
                                        <div className="flex items-center gap-2 hover:text-neon-blue transition-colors">
                                            <MessageCircle className="w-4 h-4" /> {post.comments.length}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); }} className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Leaderboard Section */}
                        <LeaderboardCard />
                    </div>
                </div>

                {/* Modals outside main grid but inside main container */}
                <AnimatePresence>
                    {selectedDiscussion && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
                            onClick={() => setSelectedDiscussion(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-slate-900 border border-white/10 rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
                            >
                                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                                    <button onClick={() => setSelectedDiscussion(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>
                                    <div className="mb-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-4 py-1.5 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-black uppercase border border-neon-blue/20">{selectedDiscussion.category}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8">{selectedDiscussion.title}</h2>
                                        <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 inline-flex">
                                            <img src={selectedDiscussion.author?.user_profile || userAvatarImg} className="w-12 h-12 rounded-full border-2 border-neon-blue/50" alt="" />
                                            <div><p className="text-xs font-black text-neon-blue uppercase">Posted By</p><p className="text-lg font-bold text-white">{selectedDiscussion.author?.first_name} {selectedDiscussion.author?.last_name}</p></div>
                                        </div>
                                    </div>
                                    <p className="text-xl text-slate-300 leading-relaxed font-light mb-12">{selectedDiscussion.content}</p>
                                    <div className="flex items-center gap-8 py-6 border-y border-white/5 mb-10 text-slate-400 font-bold">
                                        <button onClick={() => handleLike(selectedDiscussion._id)} className={user && selectedDiscussion.likes.includes(user._id) ? 'text-neon-pink' : ''}><Heart className="w-6 h-6 inline mr-2" /> {selectedDiscussion.likes.length}</button>
                                        <div><MessageSquare className="w-6 h-6 inline mr-2 text-neon-blue" /> {selectedDiscussion.comments.length} Replies</div>
                                    </div>
                                    <div className="space-y-8">
                                        <h4 className="text-2xl font-black italic uppercase text-white flex items-center gap-3"><span className="w-8 h-1 bg-neon-blue rounded-full" /> Community <span className="text-neon-blue">Insights</span></h4>
                                        <div className="relative flex items-start gap-4 p-6 rounded-[30px] bg-slate-950/50 border border-white/10 group">
                                            <img src={user?.user_profile || userAvatarImg} className="w-12 h-12 rounded-full flex-shrink-0" alt="" />
                                            <div className="flex-1 space-y-4">
                                                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your insights..." className="w-full bg-transparent border-none text-white focus:outline-none resize-none text-lg min-h-[100px]" />
                                                <div className="flex justify-end"><button onClick={() => handleComment(selectedDiscussion._id)} className="px-8 py-3 bg-neon-blue text-black font-black uppercase rounded-2xl">Deliver <Send className="w-4 h-4 inline ml-2" /></button></div>
                                            </div>
                                        </div>
                                        <div className="space-y-6 pt-4">
                                            {selectedDiscussion.comments.map((comment, idx) => (
                                                <div key={idx} className="flex gap-5 items-start">
                                                    <img src={comment.user?.user_profile || userAvatarImg} className="w-10 h-10 rounded-full flex-shrink-0 border border-white/10" alt="" />
                                                    <div className="flex-1 bg-white/5 border border-white/5 rounded-[25px] p-6">
                                                        <div className="flex justify-between mb-2"><p className="font-bold text-neon-blue">{comment.user?.first_name} {comment.user?.last_name || ''}</p><span className="text-[10px] text-slate-500 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span></div>
                                                        <p className="text-slate-300">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {isCreatingPost && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                        >
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
                                <button onClick={() => setIsCreatingPost(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                                <h3 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-neon-blue" /> New <span className="text-neon-blue">Discussion</span></h3>
                                <form onSubmit={handleCreatePost} className="space-y-4">
                                    <input type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" placeholder="Title" required />
                                    <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"><option>General</option><option>Strategy</option><option>Team Up</option><option>Reviews</option><option>Equipment</option></select>
                                    <textarea value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none" rows="4" placeholder="Content" required />
                                    <button type="submit" className="w-full py-4 bg-neon-blue text-black font-black uppercase rounded-xl">Post Now <Send className="w-4 h-4 inline ml-2" /></button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
