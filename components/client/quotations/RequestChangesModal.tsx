'use client';

import React, { useState } from 'react';
import { ActiveQuoteDetail } from '@/lib/client/types';

interface RequestChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: ActiveQuoteDetail;
  onSubmitChanges: (notes: string) => Promise<void>;
}

export default function RequestChangesModal({
  isOpen,
  onClose,
  quote,
  onSubmitChanges,
}: RequestChangesModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmitChanges(notes);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNotes('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-950 tracking-tight">
          Request Changes to Quotation
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {quote.quoteNumber} • Current Revision {quote.revision}
        </p>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="font-bold text-gray-950">Revision Request Sent!</div>
            <div className="text-xs text-gray-500">Your Lead Designer has been notified and will prepare an updated estimate.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Specific Changes or Additions
              </label>
              <textarea
                rows={4}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please change the living room modular sofa fabric from leather to linen, or adjust kitchen granite color..."
                className="w-full p-3.5 bg-[#FAF7F2] rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none placeholder-gray-400"
              />
            </div>

            <div className="text-[11px] text-gray-500 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl">
              Changes will be reviewed with your Design Manager. A new revision (e.g. v{Number(quote.revision.replace('v', '')) + 0.1 || '4.1'}) will be generated for your approval.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!notes.trim() || isSubmitting}
                className={`flex-1 py-3 px-4 rounded-full text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  notes.trim() && !isSubmitting
                    ? 'bg-black hover:bg-zinc-800 active:scale-[0.98]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
