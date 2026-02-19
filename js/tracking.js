// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-K69KVMX75E';

// Initialize the dataLayer
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Initialize GA
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

// Load the remote GA script
(function () {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
})();
