import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultContent = `<h1>How to Start Coding: A Beginner's Guide for Indian Students</h1>

<p>Are you watching everyone around you talk about tech jobs, software engineering, and the IT boom, and wondering where you fit in? You are absolutely not alone. Many students feel overwhelmed by the fast-moving tech world.</p>
<p>Starting to code can feel like trying to learn an alien language. But what if I told you it is actually much simpler than it looks?</p>

<div class="ad-slot banner-ad">AdSense Ad - Banner</div>

<h2>Why Anyone Can Learn to Code Today</h2>
<p>Let's break this down into very easy language. Coding is simply giving a set of instructions to a computer. Think of it like giving directions to a friend to make your favorite cup of masala chai. You tell them the exact steps, and they do it.</p>
<p>You do not need to be a mathematics genius to start. If you are a beginner with basic computer knowledge and logical thinking, you already have what it takes.</p>

<img src="https://via.placeholder.com/800x400?text=Student+Learning+to+Code" alt="A young Indian student learning to code on a modern laptop at home" />

<h2>A Real-Life Example: From Confusion to Creator</h2>
<p>Consider Rahul, a commerce student from Pune. He had absolutely zero prior IT background. One day, he wanted to create a simple online menu for his family's local bakery. Instead of paying a professional thousands of rupees, he spent one hour daily learning basic HTML and CSS.</p>
<p>In just four weeks, he built the website. He didn't write complex algorithms; he just learned how to structure text and add background colors. Coding is highly practical, and starting with small real-world problems is the secret key to faster learning.</p>

<div class="ad-slot video-ad">Video Ad Placement Placeholder</div>

<h2>Steps to Write Your First Program</h2>

<h3>1. Choose a Beginner-Friendly Language</h3>
<p>Start with HTML/CSS or Python. If you want to see visual results immediately, HTML and CSS are your best friends. Python is fantastic if you want to focus more on rules and logic.</p>

<h3>2. Use Free High-Quality Resources</h3>
<p>You don't need expensive bootcamps immediately. Use free platforms available online. The internet is filled with incredible, free knowledge tailored for people starting from zero.</p>

<div class="ad-slot poster-ad">Sidebar / Poster Ad Placeholder</div>

<h2>Key Points and Actionable Tips</h2>
<ul>
    <li><strong>Start very small:</strong> Build a single-page website before trying to build complex apps.</li>
    <li><strong>Focus on concepts:</strong> Do not just try to memorize lines of code. Understand the logic behind them.</li>
    <li><strong>Ask for help:</strong> Join student tech communities. Professional developers love helping beginners grow.</li>
</ul>

<h2>Common Beginner Mistakes</h2>
<p>Many beginners jump directly into advanced frameworks or machine learning before understanding basics. Another huge mistake is just watching video tutorials without actually typing the code yourself. Always practice what you watch to build muscle memory.</p>

<div class="ad-slot banner-ad">Bottom AdSense Ad - Banner</div>

<h2>Conclusion</h2>
<p>Learning to code is an incredibly rewarding skill that opens up huge global opportunities, right from your bedroom. Start by focusing entirely on the basics, build small and realistic projects, and most importantly, stay consistent.</p>
<p>Your beautiful tech journey begins with just a single line of code. Open your laptop, take a deep breath, and start typing today!</p>

<div class="faq-section">
    <h2>Frequently Asked Questions (FAQs)</h2>
    
    <div class="faq-item">
        <p class="faq-question">1. Do I need an expensive, powerful laptop to learn coding?</p>
        <p>No. Any standard laptop that can run a web browser smoothly is completely enough for learning basic languages like HTML and Python.</p>
    </div>
    
    <div class="faq-item">
        <p class="faq-question">2. How much time does it take to learn the absolute basics?</p>
        <p>If you dedicate around 1-2 hours daily, you can successfully grasp the fundamentals of basic web development in about 3 to 4 months.</p>
    </div>
</div>`;

export default function BlogEditor() {
    const navigate = useNavigate();
    const [content, setContent] = useState(defaultContent);
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateContent = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic first!");
            return;
        }
        
        setIsGenerating(true);
        
        // Simulating AI generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const generatedHtml = `<h1>The Ultimate Guide to ${topic}</h1>
<p>Are you curious about ${topic}? You are absolutely not alone. Many professionals and students are eager to master this subject in today's fast-paced tech world.</p>
<p>Starting out might feel like trying to learn an alien language. But what if I told you that diving into ${topic} is actually much simpler than it looks?</p>

<div class="ad-slot banner-ad">Top Banner Ad</div>

<h2>Why ${topic} Matters Today</h2>
<p>Let's break this down into very easy language. It is simply about understanding the core rules and applying them effectively. Think of it like a recipe. You learn the exact steps, and eventually, you produce an amazing result.</p>
<p>If you are a beginner with basic logical thinking, you already have what it takes to succeed.</p>

<img src="https://loremflickr.com/800/400/tech,software,${encodeURIComponent(topic)}" alt="Visual representation of ${topic} in a learning context" />

<h2>A Real-Life Example: From Confusion to Creator</h2>
<p>Consider Rahul from Pune. He had absolutely zero prior background in this field. One day, he wanted to apply ${topic} to his family's local business. Instead of paying thousands of rupees, he spent one hour daily learning the basics.</p>
<p>In just four weeks, he saw incredible results! Working thoroughly is highly practical, and starting with small real-world problems is the secret key to faster learning.</p>

<div class="ad-slot video-ad">Video Ad Placeholder (Auto-playing Video)</div>

<h2>Steps to Master ${topic}</h2>

<h3>1. Choose Beginner-Friendly Resources</h3>
<p>Start with free platforms available online. The internet is filled with incredible, free knowledge tailored for people starting from absolute zero.</p>

<h3>2. Practice Daily</h3>
<p>Consistency beats massive effort. Dedicating just 30 minutes every single day is much better than studying for 5 hours once a week.</p>

<div class="ad-slot poster-ad">Poster Ad / Sidebar Ad Placeholder</div>

<h2>Key Points and Actionable Tips</h2>
<ul>
    <li><strong>Start very small:</strong> Break down the problem before trying to tackle it all at once.</li>
    <li><strong>Focus on concepts:</strong> Do not just try to memorize. Understand the logic behind ${topic}.</li>
    <li><strong>Ask for help:</strong> Join student tech communities. Professionals love helping beginners grow.</li>
</ul>

<h2>Common Beginner Mistakes</h2>
<p>Many beginners jump directly into advanced topics before understanding the absolute basics. Another huge mistake is just reading tutorials without actually practicing yourself. Always practice what you learn to build memory.</p>

<div class="ad-slot banner-ad">Bottom Banner Ad Placeholder</div>

<h2>Conclusion</h2>
<p>Mastering ${topic} is an incredibly rewarding skill that opens up huge global opportunities, right from your home. Start by focusing entirely on the basics, build small realistic projects, and most importantly, stay consistent.</p>
<p>Your beautiful journey begins with just a single step. Open your laptop, take a deep breath, and start today!</p>

<div class="faq-section">
    <h2>Frequently Asked Questions (FAQs)</h2>
    
    <div class="faq-item">
        <p class="faq-question">1. Do I need expensive tools to learn ${topic}?</p>
        <p>No. Any standard equipment and a solid internet connection are completely enough for learning the basics.</p>
    </div>
    
    <div class="faq-item">
        <p class="faq-question">2. How much time does it take to learn the basics?</p>
        <p>If you dedicate around 1-2 hours daily, you can successfully grasp the fundamentals in about 3 to 4 months.</p>
    </div>
    
    <div class="faq-item">
        <p class="faq-question">3. Do I specifically need a degree to get a job in this field?</p>
        <p>While a degree helps get initial interviews, modern companies hire heavily based on visible skills and a strong project portfolio.</p>
    </div>
</div>`;

        setContent(generatedHtml);
        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 w-full shrink-0 flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-indigo-600 tracking-tight">ContentStudio Pro</h1>
                    <p className="text-sm text-slate-500">Write & Discover dual-pane editor</p>
                </div>
                
                {/* AI Topic Generator Form */}
                <div className="flex-1 max-w-2xl mx-10 flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <span className="text-sm font-bold text-slate-600 whitespace-nowrap hidden lg:block">AI Topic Writer:</span>
                    <input 
                        type="text" 
                        placeholder="Enter a topic (e.g., Python for Beginners)..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleGenerateContent() }}
                        className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
                    />
                    <button 
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:from-indigo-600 hover:to-purple-700 transition shadow-sm disabled:opacity-70 whitespace-nowrap cursor-pointer"
                    >
                        {isGenerating ? "Generating..." : "✨ Magic Generate"}
                    </button>
                </div>

                <div className="flex gap-3 mt-2 md:mt-0">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                        Back
                    </button>
                    <button 
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                        onClick={() => alert("Save functionality will be integrated with backend API shortly.")}
                    >
                        Save Draft
                    </button>
                </div>
            </header>

            <div className="flex flex-1 p-6 gap-6 h-[calc(100vh-80px)] overflow-hidden max-md:flex-col max-md:overflow-y-auto max-md:h-auto">
                {/* Left Side: Editor */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden max-md:min-h-[500px] max-md:flex-none">
                    <div className="flex justify-between items-center px-6 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
                        <span className="font-semibold text-slate-800">HTML Source Editor</span>
                        <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full tracking-wide">EDIT HERE</span>
                    </div>
                    <div className="flex-1 relative">
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="absolute inset-0 w-full h-full p-6 border-none resize-none focus:ring-0 focus:outline-none bg-slate-50 focus:bg-white transition-colors text-slate-600 text-[15px] leading-relaxed custom-scrollbar font-mono"
                            spellCheck="false"
                        />
                    </div>
                </div>

                {/* Right Side: Preview */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden max-md:min-h-[600px] max-md:flex-none">
                    <div className="flex justify-between items-center px-6 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
                        <span className="font-semibold text-slate-800">Blog Reader Output</span>
                        <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full tracking-wide">LIVE PREVIEW</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 sm:p-10 reader-container custom-scrollbar">
                        <div 
                            className="max-w-[680px] mx-auto prose prose-slate prose-lg focus:outline-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                /* Custom styling for preview reader */
                .reader-container h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-top: 1rem; margin-bottom: 1.5rem; }
                .reader-container h2 { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
                .reader-container h3 { font-size: 1.25rem; font-weight: 600; color: #334155; margin-top: 2rem; margin-bottom: 0.75rem; }
                .reader-container p { margin-bottom: 1.25rem; color: #334155; line-height: 1.8; }
                .reader-container ul { margin-bottom: 1.5rem; padding-left: 1.5rem; list-style-type: disc; color: #334155; }
                .reader-container li { margin-bottom: 0.5rem; line-height: 1.6; }
                .reader-container strong { color: #0f172a; font-weight: 600; }
                .reader-container img { width: 100%; min-height: 250px; background-color: #e2e8f0; border-radius: 12px; object-fit: cover; margin: 2rem 0; display: block; border: 1px solid #e2e8f0; }
                
                /* Advanced Ad Slot Stylings */
                .reader-container .ad-slot { margin: 2.5rem 0; padding: 1.5rem; background-color: #f8fafc; border: 2px dashed #cbd5e1; text-align: center; color: #94a3b8; border-radius: 8px; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; align-items: center; justify-content: center; display: flex; }
                .reader-container .banner-ad { min-height: 100px; background-color: #f1f5f9; border-color: #94a3b8; }
                .reader-container .video-ad { min-height: 300px; background-color: #0f172a; color: #cbd5e1; border: none; border-radius: 12px; font-size: 1.1rem; }
                .reader-container .poster-ad { min-height: 350px; max-width: 300px; margin: 2.5rem auto; background-color: #e0e7ff; color: #4f46e5; border-color: #c7d2fe; border-width: 2px; border-style: solid; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1); }

                /* FAQs */
                .reader-container .faq-section { background-color: #f8fafc; padding: 2rem; border-radius: 16px; margin-top: 3rem; border: 1px solid #e2e8f0; }
                .reader-container .faq-section h2 { margin-top: 0; border-bottom: none; }
                .reader-container .faq-item { margin-bottom: 1.25rem; }
                .reader-container .faq-item:last-child { margin-bottom: 0; }
                .reader-container .faq-question { font-weight: 600; color: #0f172a; margin-bottom: 0.25rem !important; }
                
                /* Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
}
