'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [sessionId, setSessionId] = useState<string>('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize session ID
    useEffect(() => {
        let storedId = localStorage.getItem('chat_session_id');
        let storedName = localStorage.getItem('chat_customer_name');
        let storedEmail = localStorage.getItem('chat_customer_email');
        
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem('chat_session_id', storedId);
        } else if (storedName) {
            setName(storedName);
            if (storedEmail) setEmail(storedEmail);
            setHasJoined(true);
        }
        setSessionId(storedId);
    }, []);

    // Polling for messages
    useEffect(() => {
        if (!isOpen || !hasJoined) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?sessionId=${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages) {
                        setMessages(data.messages);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };

        fetchMessages(); // Initial fetch
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [isOpen, hasJoined, sessionId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Listen to custom event to open chat from Contact Page
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-live-chat', handleOpen);
        return () => window.removeEventListener('open-live-chat', handleOpen);
    }, []);

    const handleJoinChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        localStorage.setItem('chat_customer_name', name);
        localStorage.setItem('chat_customer_email', email);
        setHasJoined(true);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const tempMessage = {
            _id: Date.now().toString(),
            sender: 'customer',
            content: inputValue,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, tempMessage]);
        setInputValue('');

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    customerName: name,
                    customerEmail: email,
                    content: tempMessage.content
                })
            });
        } catch (error) {
            console.error('Message failed to send', error);
            // Could add retry logic here in a real app
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-700 hover:scale-105 transition-all z-50"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100 flex-shrink-0">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Live Support</h3>
                        <p className="text-white/70 text-xs">We typically reply in minutes</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                {!hasJoined ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                            <User className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-gray-900">Welcome to Live Chat!</h4>
                        <p className="text-sm text-gray-500">Please enter your details to start chatting with one of our support agents.</p>
                        <form onSubmit={handleJoinChat} className="w-full mt-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 mb-3 text-black"
                                required
                            />
                            <input 
                                type="email" 
                                placeholder="Your Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 mb-3 text-black"
                                required
                            />
                            <button type="submit" className="w-full btn-emerald py-3 rounded-xl text-sm font-bold">
                                Start Chatting
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full">Chat Started</span>
                        </div>
                        {messages.length === 0 && (
                            <div className="text-center text-sm text-gray-500 mt-8">
                                Send a message to start the conversation!
                            </div>
                        )}
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender === 'customer';
                            return (
                                <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                        isMe ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                                    }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            {hasJoined && (
                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 text-black"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim()}
                            className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
