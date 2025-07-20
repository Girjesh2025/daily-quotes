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

// Fallback quotes for when API fails
const fallbackQuotes = [
    {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        content: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        content: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
    },
    {
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        content: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        content: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        content: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    }
];

// Get random fallback quote
function getFallbackQuote() {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
}

// Fetch new quote from API
async function getNewQuote() {
    showLoader();
    try {
        let response;
        
        // Check if AbortController is supported
        if (typeof AbortController !== 'undefined') {
            // Use AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
            
            response = await fetch('https://api.quotable.io/random', {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
        } else {
            // Fallback for browsers without AbortController
            response = await fetch('https://api.quotable.io/random', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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
        console.log('API failed, using fallback quote:', error.message);
        // Use fallback quote instead of showing error
        const fallbackQuote = getFallbackQuote();
        
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        
        setTimeout(() => {
            quoteText.textContent = fallbackQuote.content;
            quoteAuthor.textContent = `— ${fallbackQuote.author}`;
            
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 500);
        
        // Still change background even with fallback
        changeBackground();
    } finally {
        hideLoader();
    }
}

// Copy quote to clipboard
async function copyQuote() {
    const quote = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(quote);
            showToast('Quote copied to clipboard!');
        } else {
            // Fallback method for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = quote;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showToast('Quote copied to clipboard!');
            } catch (err) {
                showToast('Please manually copy the quote');
            }
            
            textArea.remove();
        }
    } catch (err) {
        showToast('Copy not supported on this device');
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