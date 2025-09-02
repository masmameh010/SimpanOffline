
import React, { useEffect } from 'react';

export interface Message {
    text: string;
    type: 'info' | 'confirm';
    onConfirm?: (confirmed: boolean) => void;
}

interface MessageBoxProps {
    message: Message;
    onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, onClose }) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleConfirm = () => {
        message.onConfirm?.(true);
        onClose();
    };

    const handleCancel = () => {
        message.onConfirm?.(false);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[1000]">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
                <p className="mb-6 text-gray-700">{message.text}</p>
                <div className="flex justify-center gap-4">
                    {message.type === 'confirm' ? (
                        <>
                            <button onClick={handleConfirm} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                Ya
                            </button>
                            <button onClick={handleCancel} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                                Tidak
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
