import React from 'react';
import { useAppState } from '../context/AppContext';
import { MessageSquareText } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { navigation } = useAppState();

  const currentScreen = navigation.currentScreen;

  // Don't display on splash or admin screens to maintain professional layout
  if (['splash', 'adminLogin', 'adminDashboard'].includes(currentScreen)) {
    return null;
  }

  const handleWhatsAppAction = () => {
    // Generate preset text, opens WhatsApp web
    const presetText = encodeURIComponent(
      'Hello VELRIVA dropshipping reseller support! I am looking for details about the latest trending inventory.'
    );
    window.open(`https://wa.me/919690986010?text=${presetText}`, '_blank');
  };

  return (
    <button
      id="whatsapp-support-floating-btn"
      onClick={handleWhatsAppAction}
      className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition duration-200 hover:bg-emerald-600 hover:scale-105 active:scale-95"
      title="Chat with Support"
    >
      <MessageSquareText className="h-5.5 w-5.5 fill-current" />
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
      </span>
    </button>
  );
};
