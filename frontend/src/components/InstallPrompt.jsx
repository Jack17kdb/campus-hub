import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-2xl bg-gray-900 px-4 py-3 text-white shadow-lg">
      <div>
        <p className="text-sm font-semibold">Install KIST Hub</p>
        <p className="text-xs text-gray-400">Add to home screen for quick access</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowBanner(false)} className="rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:text-white">
          Later
        </button>
        <button onClick={handleInstall} className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold hover:bg-orange-600">
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
