"use client";

import { useEffect } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    autoCloseDuration?: number; // in milliseconds
}

export default function SuccessModal({ 
    isOpen, 
    onClose, 
    title = "Giao dịch thành công", 
    message, 
    autoCloseDuration = 5000 
}: SuccessModalProps) {
    useEffect(() => {
        if (isOpen && autoCloseDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative bg-[#0B0F1A] border border-brand-accent/50 shadow-[0_0_30px_rgba(236,57,44,0.15)] rounded-[2.5rem] p-10 w-full max-w-[380px] flex flex-col items-center justify-center transform transition-all animate-in zoom-in-95 fade-in duration-300">
                
                {/* Close X Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>

                {/* Animated Orange Check Icon */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    {/* Outer dark orange/red ring */}
                    <div className="absolute inset-0 bg-brand-accent/10 rounded-full animate-pulse opacity-70"></div>
                    {/* Middle orange/red ring */}
                    <div className="absolute inset-[8px] bg-brand-accent/20 rounded-full"></div>
                    {/* Inner bright orange/red circle */}
                    <div className="absolute inset-[18px] bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(236,57,44,0.4)]">
                        <svg 
                            className="w-8 h-8 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={4}
                            style={{
                                strokeDasharray: 50,
                                strokeDashoffset: 50,
                                animation: 'drawCheck 0.6s ease-out forwards 0.2s'
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold text-white tracking-wide text-center leading-tight">
                    {title}
                </h2>
                
                {message && (
                    <p className="text-gray-400 text-center mt-3 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                )}

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300"
                >
                    Đóng
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes drawCheck {
                    to { stroke-dashoffset: 0; }
                }
            `}} />
        </div>
    );
}
