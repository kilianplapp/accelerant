async function isServiceWorkerInstallable() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        if (registration.installing) {
          console.log('Service Worker is installing...');
        } else if (registration.waiting) {
          console.log('Service Worker is waiting...');
        } else if (registration.active) {
          console.log('Service Worker is active.');
          return true;
        }
      } catch (error) {
        console.error('Failed to register Service Worker:', error);
        return false;
      }
    }
    return false;
  }