/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
// import { GoogleGenAI } from "@google/genai";
import { Image as ImageIcon, Sparkles, Heart, RefreshCcw, Link2, Logs, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUI } from './components/ChatUI';
import ChatList from './components/ChatList';
import LogsUI from './components/Logs';

export const RPContext = createContext(null);

interface Message {
    role: 'User' | 'AI';
    text: string;
}

// Helper to get AI instance
/* const getAI = () => {
	return new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY || ''
	});
}; */

export default function App() {
	const [settingPanelEnabled, setSettingPanelEnabled] = useState(true);
	const [apiBase, setApiBase] = useState('');
	const [setting, setSetting] = useState('');
	const [isApplying, setIsApplying] = useState(false);
	const [characterDescription, setCharacterDescription] = useState('');
	const [lastVisualPrompt, setLastVisualPrompt] = useState('');

	const [messages, setMessages] = useState<Message[]>([]);
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState("");
	const [historyList, setHistoryList] = useState([]);
	const [logs, setLogs] = useState({});
	const [logsUIShow, setLogsUIShow] = useState(false);

	const pushLogs = (key, value) => {
		setLogs(prevLogs => ({
			...prevLogs,
			[key]: value // Square brackets allow dynamic keys
		}));
	};

	const extractCharacter = async () => {
        if (!setting) return;
        try {
            setIsApplying(true);
            let response = await fetch(`${apiBase}/init_char_dna`, {
                method: 'POST',
                headers: {
					'Bypass-Tunnel-Reminder': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ setting_txt: setting })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const data = await response.json();
			console.log(data);
            // setDna(dna);
			// setLogs({...logs, dna: data.dna, visual_prompt: data.visual_prompt});
			pushLogs('dna', data.dna);
			pushLogs('visual_prompt', data.visual_prompt);
            
			response = await fetch('/api/initRoleplay', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({setting, dna: data.dna, lastVisualPrompt: data.visual_prompt})
			});
			if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

			let insertData = await response.json();
			console.log(insertData);
			setSessionId(insertData.id);

			setCharacterDescription(data.dna);
            setLastVisualPrompt(data.visual_prompt);
            console.log('dna: ', data.dna);
            console.log('visual_prompt: ', data.visual_prompt);
        } catch (e) {
            console.error("Error extracting character:", e);
        } finally {
            setIsApplying(false);
			setSettingPanelEnabled(false);
        }
    };

	const testFunc = async () => {
		try {
			console.log('testing...');
			const response = await fetch('/api/updateMessages', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({sessionId: '69bfc0d4dd4ee0dffa4e8a13', userReply: 'hello', aiReply: 'hi', lastVisualPrompt: 'last visual prompt'})
			});
			if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
			const insertData = await response.json();
			console.log(insertData);
		} catch (error) {
			console.error(error);
		}
	}

	const resetSession = () => {
        setMessages([]);
        setGeneratedImage(null);
        setCharacterDescription('');
		setSettingPanelEnabled(true);
        // extractCharacter();
    };

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500/30 overflow-hidden flex flex-col">
			<RPContext.Provider value={{
			characterDescription,
			apiBase,
			setting,
			setSetting,
			messages,
			setMessages,
			generatedImage,
			setGeneratedImage,
			lastVisualPrompt,
			setLastVisualPrompt,
			sessionId,
			historyList,
			setHistoryList,
			setSettingPanelEnabled,
			setCharacterDescription,
			setSessionId,
			pushLogs,
			logs,
			setLogs
			}}>
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
							<button className={`p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 ${ logsUIShow && 'bg-white/10' }`} title="Show logs">
								<Logs className="w-4 h-4" onClick={ () => { setLogsUIShow(prev => !prev) } } />
							</button>
							<button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400" title="Setting" onClick={() => { console.log(logs); }} >
								<Settings2 className="w-4 h-4"/>
							</button>
							<button onClick={resetSession} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400" title="Reset Session">
								<RefreshCcw className="w-4 h-4" />
							</button>
						</div>
					</div>
				</header>

				<main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 w-full grow">
					{ logsUIShow && (
						<section className='bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md'>
							<p className="text-white">Logs</p>
							<hr className="border-t border-gray-700 my-3" />
							<LogsUI logs={logs} />
						</section>
					) }
					
					{/* Setting panel */}
					{settingPanelEnabled ? (
						<section className='bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md'>
							{/* API Base Input */}
							<section className="bg-white/5 rounded-2xl p-3 border border-white/10">
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
							<section className="bg-white/5 rounded-2xl p-3 border border-white/10 mt-5">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-3.5 h-3.5 text-rose-500" />
									<h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Character & Scenario Definition</h2>
								</div>
								<div className="flex flex-col gap-3">
									<textarea
										value={setting}
										onChange={(e) => setSetting(e.target.value)}
										className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none transition-all min-h-[260px] resize-none"
										placeholder="e.g. Act as my Indian brother, we are studying in college. He is wearing a skyblue tshirt..."
									/>
									<button
										disabled={isApplying ? true : false}
										onClick={extractCharacter}
										className="self-end px-6 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl text-[14px] font-bold uppercase tracking-wider transition-all text-rose-400 cursor-pointer"
									>
										{isApplying ? 'Creating character...' : 'Apply Character'}
									</button>

									<button
										onClick={testFunc}
										className="hidden self-end px-6 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl text-[14px] font-bold uppercase tracking-wider transition-all text-rose-400 cursor-pointer"
									>
										DB Test
									</button>
								</div>
							</section>
							{/* Chat list */}
							<section className="mt-5 flex flex-col gap-3">
								<ChatList />
							</section>
						</section>
					) : <ChatUI />}
				</main>
			</RPContext.Provider>
		</div>
	);
}
