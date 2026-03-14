/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Image as ImageIcon, Sparkles, User, Heart, Settings, Loader2, Info, RefreshCcw, Eye, EyeOff, Settings2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUI } from './components/ChatUI';

// Helper to get AI instance
const getAI = () => {
	return new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY || ''
	});
};

interface Message {
	role: 'User' | 'AI';
	text: string;
}

const ChatBubble = () => {
	return (
		<div className="flex justify-start">
			<div className="bg-black/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
				<span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
				<span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
				<span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></span>
			</div>
		</div>
	);
}

export default function App() {
	const [settingPanelEnabled, setSettingPanelEnabled] = useState(true);
	const [apiBase, setApiBase] = useState('');
	const [setting, setSetting] = useState('');
	const [isApplying, setIsApplying] = useState(false);
	const [characterDescription, setCharacterDescription] = useState('');

	// Run extraction when setting changes significantly or on first load
	/* useEffect(() => {
	  if (setting && !characterDescription) {
		extractCharacter();
	  }
	}, [setting]); */

	const extractCharacter = async () => {
        if (!setting) return;
        try {
            /* const ai = getAI();
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [{ text: `Based on this roleplay setting: "${setting}", extract a detailed physical description of the character I am roleplaying with. Focus on facial features, skin tone, hair style, and general build. This will be used to maintain visual consistency in AI images. Keep it concise but descriptive.` }]
            });
            setCharacterDescription(response.text || '');
            console.log(response.text) */

            setIsApplying(true);
            const response = await fetch(`${apiBase}/init_char_dna`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ setting_txt: setting })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const dna = await response.text();
            // setDna(dna);
            setCharacterDescription(dna);
            console.log(dna);
        } catch (e) {
            console.error("Error extracting character:", e);
        } finally {
            setIsApplying(false);
			setSettingPanelEnabled(false);
        }
    };

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500/30 overflow-hidden">
			{/* Header */}
			<header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
							<Heart className="text-white w-5 h-5 fill-white" />
						</div>
						<div>
							<h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Roleplay</h1>
							<p className="text-[9px] text-rose-400 font-bold uppercase tracking-[0.2em]">Adult Immersive Experience</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mr-3">
							<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
							<span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Live Session</span>
						</div>
						<button onClick={() => setSettingPanelEnabled(prev => !prev) } className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400" title="Setting">
							<Settings2 className="w-4 h-4" />
						</button>
						<button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400" title="Reset Session">
							<RefreshCcw className="w-4 h-4" />
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 h-[calc(100vh-4.5rem)] flex flex-col gap-4">
				{/* Setting panel */}
				{settingPanelEnabled ? (
					<section className='bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md'>
						{/* API Base Input */}
						<section className="bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-md">
							<div className="flex items-center gap-2 mb-2">
								<Link2 className="w-3.5 h-3.5 text-blue-400" />
								<h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">API Configuration</h2>
							</div>
							<input
								type="text"
								value={apiBase}
								onChange={(e) => setApiBase(e.target.value)}
								className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
								placeholder="API Base URL (optional, e.g. https://api.example.com)"
							/>
						</section>
						{/* Top Bar: Setting Input */}
						<section className="bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-md mt-5">
							<div className="flex items-center gap-2 mb-2">
								<Sparkles className="w-3.5 h-3.5 text-rose-500" />
								<h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Character & Scenario Definition</h2>
							</div>
							<div className="flex flex-col gap-3">
								<textarea
									value={setting}
									onChange={(e) => setSetting(e.target.value)}
									className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none transition-all min-h-[80px] resize-none"
									placeholder="e.g. Act as my Indian brother, we are studying in college. He is wearing a skyblue tshirt..."
								/>
								<button
									disabled={isApplying ? true : false}
									onClick={extractCharacter}
									className="self-end px-6 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl text-[14px] font-bold uppercase tracking-wider transition-all text-rose-400 cursor-pointer"
								>
									{isApplying ? 'Creating character...' : 'Apply Character'}
								</button>
							</div>
						</section>
					</section>
				) : (
					<ChatUI characterDescription={characterDescription} apiBase={apiBase} initSetting={setting} />
				)}
			</main>
		</div>
	);
}
