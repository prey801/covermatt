'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConvo, setActiveConvo] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations list initially and poll
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/admin/chat');
                if (res.ok) {
                    const data = await res.json();
                    if (data.conversations) {
                        setConversations(data.conversations);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch conversations', error);
            }
        };

        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Polling every 5s for new chats
        return () => clearInterval(interval);
    }, []);

    // Fetch messages for the active conversation
    useEffect(() => {
        if (!activeConvo) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/admin/chat?conversationId=${activeConvo.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages) {
                        setMessages(data.messages);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch active messages', error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling active chat
        return () => clearInterval(interval);
    }, [activeConvo]);

    // Scroll down on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConvo) return;

        const tempMessage = {
            _id: Date.now().toString(),
            sender: 'admin',
            content: inputValue,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, tempMessage]);
        setInputValue('');

        try {
            await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeConvo.id,
                    content: tempMessage.content
                })
            });
        } catch (error) {
            console.error('Admin message failed to send', error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-6 border-b border-gray-100 bg-white">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-emerald-600" />
                        Live Chats
                    </h1>
                </div>
                
                <div className="flex-1 overflow-y-auto w-full p-4 space-y-2">
                    {conversations.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 mt-10">
                            No active conversations
                        </div>
                    ) : (
                        conversations.map((convo) => (
                            <button
                                key={convo.id}
                                onClick={() => setActiveConvo(convo)}
                                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                                    activeConvo?.id === convo.id 
                                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        {convo.customerName || 'Guest'}
                                    </span>
                                    {convo.unreadCount > 0 && (
                                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {convo.unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate mb-2">
                                    {convo.lastMessagePreview || 'Started a chat'}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    {activeConvo.customerName || 'Guest'}
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                        {activeConvo.status}
                                    </span>
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Session ID: {activeConvo.sessionId}</p>
                            </div>
                            <button className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 hover:bg-emerald-50">
                                <CheckCircle2 className="w-4 h-4" /> Resolve
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#f8fafc]">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-10">Loading messages...</div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isAdmin = msg.sender === 'admin';
                                    return (
                                        <div key={msg._id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                                                isAdmin 
                                                    ? 'bg-emerald-600 text-white rounded-br-sm' 
                                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                                            }`}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <div className={`flex items-center gap-1.5 mt-2 justify-end text-[10px] ${isAdmin ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Type your reply to customer..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-black bg-gray-50 focus:bg-white"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <MessageCircle className="w-16 h-16 text-gray-200" />
                        <p className="text-sm font-medium">Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
