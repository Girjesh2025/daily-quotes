// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyQuoteBtn = document.getElementById('copy-quote-btn');
const tweetQuoteBtn = document.getElementById('tweet-quote-btn');
const loader = document.querySelector('.loader');

// Background Images from Unsplash (Nature and Inspiration themed)
const backgroundImages = [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
    'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe',
    'https://images.unsplash.com/photo-1437422061949-f6efbde0a471',
    'https://images.unsplash.com/photo-1439853949127-fa647821eba0'
];

// Event Listeners
document.addEventListener('DOMContentLoaded', getNewQuote);
newQuoteBtn.addEventListener('click', getNewQuote);
copyQuoteBtn.addEventListener('click', copyQuote);
tweetQuoteBtn.addEventListener('click', tweetQuote);

// Auto refresh quote every 10 seconds
setInterval(getNewQuote, 10000);

// Show loading spinner
function showLoader() {
    loader.classList.remove('hidden');
}

// Hide loading spinner
function hideLoader() {
    loader.classList.add('hidden');
}

// Change background image
function changeBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const imageUrl = `${backgroundImages[randomIndex]}?auto=format&fit=crop&w=1920&q=80`;
    
    // Preload image
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
        document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`;
    };
}

// Fetch new quote from API
async function getNewQuote() {
    showLoader();
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        
        // Update quote text with fade effect
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        
        setTimeout(() => {
            quoteText.textContent = data.content;
            quoteAuthor.textContent = `— ${data.author}`;
            
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 500);
        
        // Change background
        changeBackground();
    } catch (error) {
        quoteText.textContent = 'Oops! Something went wrong. Please try again.';
        quoteAuthor.textContent = '— Error';
    } finally {
        hideLoader();
    }
}

// Copy quote to clipboard
async function copyQuote() {
    const quote = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
    
    try {
        await navigator.clipboard.writeText(quote);
        showToast('Quote copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy quote');
    }
}

// Tweet current quote
function tweetQuote() {
    const quote = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
    window.open(tweetUrl, '_blank');
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add fade transition to quote text
quoteText.style.transition = 'opacity 0.5s ease';
quoteAuthor.style.transition = 'opacity 0.5s ease'; 