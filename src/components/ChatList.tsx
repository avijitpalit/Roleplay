import React, { useEffect, useContext } from 'react'
import { ArrowBigRight } from "lucide-react";
import { RPContext } from '../App';

export default function ChatList() {
    const { historyList, setHistoryList, setSetting, setCharacterDescription, setLastVisualPrompt, setMessages, setSettingPanelEnabled, setSessionId } = useContext(RPContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('/api/loadChats');
                if(!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status}: ${errorText}`);
                }
                const chatsJson = await response.json();
                setHistoryList(chatsJson.chats);
            } catch (error) {
                console.log(error);
            }
        }
        fetchHistory();
    }, [])
    
    const selectChat = (id, setting, dna, lastVisualPrompt, messages) => {
        console.log(`chat selected: ${id}`);
        setSetting(setting);
        setCharacterDescription(dna);
        setLastVisualPrompt(lastVisualPrompt);
        setMessages(messages);
        setSettingPanelEnabled(false);
        setSessionId(id);
    }

    return (
        <>
            { historyList.map(list => (
                <div key={list._id.toString()} className='bg-white/5 rounded-2xl p-3 border border-white/10'>
                    <p>{ list.setting }</p>
                    <div className='mt-2 flex gap-3 items-center'>
                        <span className='text-[14px] text-gray-400 uppercase'>{ new Date(list.createdAt).toLocaleDateString() }</span>
                        <button className='self-end bg-rose-600/20 focus:bg-rose-600/30 border border-rose-500/30 rounded-xl text-[12px] uppercase tracking-wider transition-all text-rose-400 cursor-pointer px-2 py-2 ml-auto' onClick={() => selectChat(list._id, list.setting, list.dna, list.lastVisualPrompt, list.messages)}><ArrowBigRight/></button>
                    </div>
                </div>
            ))}
        </>
    )
}
