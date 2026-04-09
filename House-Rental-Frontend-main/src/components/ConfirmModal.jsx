import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // 'danger' | 'info' | 'warning'
}) => {
    if (!isOpen) return null;

    const typeConfig = {
        danger: {
            icon: <AlertTriangle className="text-rose-500" size={32} />,
            btnColor: 'bg-rose-500 hover:bg-rose-600',
            bgHeader: 'bg-rose-50 dark:bg-rose-900/20'
        },
        warning: {
            icon: <AlertTriangle className="text-amber-500" size={32} />,
            btnColor: 'bg-amber-500 hover:bg-amber-600',
            bgHeader: 'bg-amber-50 dark:bg-amber-900/20'
        },
        info: {
            icon: <Info className="text-violet-500" size={32} />,
            btnColor: 'bg-violet-500 hover:bg-violet-600',
            bgHeader: 'bg-violet-50 dark:bg-violet-900/20'
        }
    };

    const config = typeConfig[type];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-fade-in" onClick={onCancel}>
            <div
                className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className={`p-6 ${config.bgHeader} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-700 p-2 rounded-2xl shadow-sm">
                            {config.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300 text-base">{message}</p>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition shadow-lg ${config.btnColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
