// This is a vanilla JavaScript file that runs alongside the React application.
// It's suitable for simple, global scripts that don't need to interact with React's state.

console.log("Instore Navigator Pro vanilla script loaded.");

// Example: Handling online/offline status changes
function updateOnlineStatus() {
  const statusElementId = 'online-status-indicator';
  let statusElement = document.getElementById(statusElementId);
  
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.id = statusElementId;
    Object.assign(statusElement.style, {
      position: 'fixed',
      bottom: '80px', // Position above the 64px nav bar
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      borderRadius: '8px',
      color: 'white',
      zIndex: '1000',
      transition: 'opacity 0.5s, visibility 0.5s',
      opacity: '0',
      visibility: 'hidden',
      fontSize: '14px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    });
    document.body.appendChild(statusElement);
  }
  
  if (!navigator.onLine) {
    statusElement.textContent = 'You are offline. Some features may be unavailable.';
    statusElement.style.backgroundColor = '#ef4444'; // Tailwind red-500
    statusElement.style.opacity = '1';
    statusElement.style.visibility = 'visible';
  } else {
    // Only show the "Back online" message if the element was previously visible (i.e., we were offline)
    if (statusElement.style.visibility === 'visible') {
        statusElement.textContent = 'Back online!';
        statusElement.style.backgroundColor = '#22c55e'; // Tailwind green-500
        statusElement.style.opacity = '1';

        // Hide the 'Back online' message after a few seconds
        setTimeout(() => {
            statusElement.style.opacity = '0';
            statusElement.style.visibility = 'hidden';
        }, 3000);
    }
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check in case the app loads while offline
document.addEventListener('DOMContentLoaded', () => {
    if(!navigator.onLine){
        // A small delay to ensure the DOM is fully ready
        setTimeout(updateOnlineStatus, 500);
    }
});

