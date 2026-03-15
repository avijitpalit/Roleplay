import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Image as ImageIcon, Sparkles, User, Heart, Settings, Loader2, Info, RefreshCcw, Eye, EyeOff, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RPContext } from '../App';

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

export const ChatUI = () => {
    const { characterDescription, apiBase, setting, messages, setMessages, generatedImage, setGeneratedImage } = React.useContext(RPContext);

    // const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    // const [dna, setDna] = useState("");

    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    // const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showMessages, setShowMessages] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'User', text: input };
        setMessages(prev => [...prev, userMessage]);
        const updatedMessages = [...messages, userMessage];
        console.log(updatedMessages);
        setInput('');
        setIsTyping(true);
        try {
            /* const ai = getAI();
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [
                {
                  role: 'user',
                  parts: [{
                    text: `System: You are an AI roleplay partner. 
                  Roleplay Context: ${setting}
                  Character Consistency Notes: ${characterDescription}
                  Tone: Adult, 18+, intimate, and emotionally deep. You are allowed to engage in mature themes, romantic intimacy, and adult conversations as requested by the user. 
                  
                  Previous Conversation:
                  ${messages.map(m => `${m.role === 'user' ? 'User' : 'Character'}: ${m.text}`).join('\n')}
                  
                  User: ${input}`
                  }]
                }
              ],
              config: {
                systemInstruction: "Engage in a high-quality, adult-themed roleplay. Be descriptive, evocative, and stay perfectly in character. Use natural language, occasional cultural references if applicable, and focus on the emotional and physical intimacy of the scene. Do not hold back on mature themes if the roleplay leads there. Keep responses concise but impactful.",
              }
            }); */

            // For flask api
            let prompt = `Roleplay setting: ${setting}
                ${updatedMessages.map(m => `${m.role === 'User' ? 'User' : 'AI'}: ${m.text}`).join('\n')}
            `;
            console.log(prompt);
            const response = await fetch(`${apiBase}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ history: prompt })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const reply = await response.text();
            console.log(reply);

            // const modelText = response.text || "I'm speechless... tell me more.";
            setMessages(prev => [...prev, { role: 'AI', text: reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I lost my train of thought for a moment. What were we saying?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleVisualize = async () => {
        setIsGeneratingImage(true);
        try {
            // const ai = getAI();
            // Ensure we have a character description
            /* if (!characterDescription) {
                await extractCharacter();
            } */

            // Get a prompt that combines consistency with the current scenario and recent chat history
            /*const promptResponse = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [{
                text: `Create a highly detailed, cinematic image generation prompt for an Z-image turbo model. 
                
                CHARACTER CONSISTENCY (Physical Features): ${characterDescription}
                
                RECENT CHAT CONTEXT & SCENARIO:
                ${messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Character'}: ${m.text}`).join('\n')}
                
                CURRENT SETTING: ${setting}
                
                INSTRUCTIONS:
                1. The image MUST be ultra-realistic, looking like a real human photograph (8k, highly detailed skin textures, realistic eyes).
                2. Use natural HDR lighting, realistic skin texture and realistic depth of field.
                3. The character's outfit, pose, and expression should be based on the RECENT CHAT CONTEXT.
                4. Since this is an 18+ adult roleplay app, the image should be intimate, mature, and can contain explicit/NSFW elements if the current chat context suggests it. 
                5. Ensure the facial features strictly follow the CHARACTER CONSISTENCY notes.
                6. The character should be the central focus, captured in a cinematic composition.`
              }]
            });*/

            const refinedPrompt = `Create a highly detailed, cinematic image generation prompt for an Z-image turbo model. 
          
          CHARACTER CONSISTENCY (Physical Features): ${characterDescription}
          
          RECENT CHAT CONTEXT & SCENARIO:
          ${messages.slice(-5).map(m => `${m.role === 'User' ? 'User' : 'AI'}: ${m.text}`).join('\n')}
                    
          INSTRUCTIONS:
          1. The image MUST be ultra-realistic, looking like a real human photograph (8k, highly detailed skin textures, realistic eyes).
          2. Use natural HDR lighting, realistic skin texture and realistic depth of field.
          3. The character's outfit, pose, and expression should be based on the RECENT CHAT CONTEXT.
          4. Since this is an 18+ adult roleplay app, the image should be intimate, mature, and can contain explicit/NSFW elements if the current chat context suggests it. 
          5. Ensure the facial features strictly follow the CHARACTER CONSISTENCY notes.
          6. The character should be the central focus, captured in a cinematic composition.`

            // const visualPrompt = promptResponse.text || `A photorealistic, ultra-detailed portrait of the character in ${setting}, natural HDR lighting, intimate atmosphere.`;

            const payload = {
                refinedPrompt,
                width: 768,
                height: 1344,
                steps: 8
            };
            console.log("Generating image via API...");
            const response = await fetch(`${apiBase}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const imageBlob = await response.blob();
            console.log('creating image blob...');
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedImage(imageUrl);
            console.log('Image generated');

            /*const imageResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: {
                parts: [{ text: visualPrompt }],
              },
              config: {
                imageConfig: {
                  aspectRatio: "16:9",
                },
              },
            });
      
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                break;
              }
            }*/
        } catch (error) {
            console.error("Image generation error:", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    /* const resetSession = () => {
        setMessages([]);
        setGeneratedImage(null);
        setCharacterDescription('');
        extractCharacter();
    }; */

    return (
        <>
            {/* Main Chat Container with Background Image */}
            <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0f0f0f]">
                {/* Background Image Layer */}
                <AnimatePresence mode="wait">
                    {generatedImage ? (
                        <motion.div
                            key={generatedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0 z-0"
                        >
                            <img
                                src={generatedImage}
                                alt="Background"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90" />
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 z-0 flex items-center justify-center">
                            <div className="text-center opacity-10">
                                <ImageIcon className="w-32 h-32 mx-auto mb-4" />
                                <p className="text-2xl font-serif italic">"Visualize to set the scene..."</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Chat Content Layer */}
                <div className="absolute inset-0 z-10 flex flex-col">
                    {/* Toggle Visibility Button */}
                    <div className="absolute top-4 right-4 z-30">
                        <button
                            onClick={() => setShowMessages(!showMessages)}
                            className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-all shadow-lg text-white/70 hover:text-white"
                            title={showMessages ? "Hide Chat Bubbles" : "Show Chat Bubbles"}
                        >
                            {showMessages ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 scrollbar-hide transition-opacity duration-500 ${showMessages ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
                                >
                                    <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif italic text-white/90">Waiting for your first move...</h3>
                                    <p className="text-sm text-gray-400 max-w-sm mx-auto">The character is ready to immerse in your defined scenario. Start the conversation below.</p>
                                </div>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                                        <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'User' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                                                {msg.role === 'User' ? 'You' : 'AI'}
                                            </span>
                                        </div>
                                        <div className={`p-4 sm:p-5 rounded-2xl backdrop-blur-xl border ${msg.role === 'User'
                                            ? 'bg-rose-600/20 border-rose-500/30 text-white rounded-tr-none shadow-lg shadow-rose-900/20'
                                            : 'bg-black/50 border-white/10 text-gray-100 rounded-tl-none shadow-lg shadow-black/40'
                                            }`}>
                                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && <ChatBubble />}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[2px] transition-opacity duration-500 ${showMessages ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="max-w-4xl mx-auto flex gap-3">
                            <button
                                onClick={handleVisualize}
                                disabled={isGeneratingImage}
                                className="relative p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all disabled:opacity-50 overflow-hidden group flex-shrink-0"
                                title="Visualize current scenario"
                            >
                                {isGeneratingImage ? (
                                    <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <div className="flex-1 relative">
                                {/* <textarea
                                value={input}
                                onChange={(e: any) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                    }
                                }}
                                placeholder="Whisper your desires..."
                                className="w-full p-4 pr-16 bg-black/60 border border-white/10 rounded-2xl focus:ring-2 focus:ring-rose-500/50 outline-none transition-all resize-none h-[56px] text-sm sm:text-base scrollbar-hide"
                                /> */}
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e: any) => setInput(e.target.value)}
                                    placeholder="Whisper your desires..."
                                    className="w-full p-4 pr-16 bg-black/60 border border-white/10 rounded-2xl focus:ring-2 focus:ring-rose-500/50 outline-none transition-all resize-none h-[56px] text-sm sm:text-base scrollbar-hide"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-2 bottom-2 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20 flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {/* <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] text-white/30 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-rose-500/60"><Info className="w-3 h-3" /> 18+ Adult Content Enabled</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">Character Consistency: {characterDescription ? 'Active' : 'Pending'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Cinematic Visualization</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}