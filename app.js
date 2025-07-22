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
    },
    {
        content: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
    },
    {
        content: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson"
    },
    {
        content: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        content: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        content: "Don't be afraid to give up the good to go for the great.",
        author: "John D. Rockefeller"
    },
    {
        content: "If you want to achieve greatness stop asking for permission.",
        author: "Anonymous"
    },
    {
        content: "The best revenge is massive success.",
        author: "Frank Sinatra"
    },
    {
        content: "People who are crazy enough to think they can change the world, are the ones who do.",
        author: "Rob Siltanen"
    },
    {
        content: "Failure will never overtake me if my determination to succeed is strong enough.",
        author: "Og Mandino"
    },
    {
        content: "Entrepreneurs are great at dealing with uncertainty and also very good at minimizing risk. That's the classic entrepreneur.",
        author: "Mohnish Pabrai"
    },
    {
        content: "We may encounter many defeats but we must not be defeated.",
        author: "Maya Angelou"
    },
    {
        content: "Knowing is not enough; we must apply. Wishing is not enough; we must do.",
        author: "Johann Wolfgang Von Goethe"
    },
    {
        content: "Whether you think you can or you think you can't, you're right.",
        author: "Henry Ford"
    },
    {
        content: "The future belongs to those who prepare for it today.",
        author: "Malcolm X"
    },
    {
        content: "Some people want it to happen, some wish it would happen, others make it happen.",
        author: "Michael Jordan"
    },
    {
        content: "Great things never come from comfort zones.",
        author: "Anonymous"
    },
    {
        content: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    },
    {
        content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson"
    },
    {
        content: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill"
    },
    {
        content: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        content: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },
    {
        content: "I have learned throughout my life as a composer chiefly through my mistakes and pursuits of false assumptions, not by my exposure to founts of wisdom and knowledge.",
        author: "Igor Stravinsky"
    },
    {
        content: "A person who never made a mistake never tried anything new.",
        author: "Albert Einstein"
    },
    {
        content: "The person who says it cannot be done should not interrupt the person who is doing it.",
        author: "Chinese Proverb"
    },
    {
        content: "There are no traffic jams along the extra mile.",
        author: "Roger Staubach"
    },
    {
        content: "It is never too late to be what you might have been.",
        author: "George Eliot"
    },
    {
        content: "You become what you believe.",
        author: "Oprah Winfrey"
    },
    {
        content: "I would rather die of passion than of boredom.",
        author: "Vincent van Gogh"
    },
    {
        content: "A truly rich man is one whose children run into his arms when his hands are empty.",
        author: "Anonymous"
    },
    {
        content: "If you want your children to be intelligent, read them fairy tales. If you want them to be more intelligent, read them more fairy tales.",
        author: "Albert Einstein"
    },
    {
        content: "It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all.",
        author: "J.K. Rowling"
    },
    {
        content: "Remember that not getting what you want is sometimes a wonderful stroke of luck.",
        author: "Dalai Lama"
    }
];

// Get random fallback quote
function getFallbackQuote() {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
}



// Get new quote using our curated fallback collection
function getNewQuote() {
    showLoader();
    
    // Use our excellent fallback quotes collection
    const quote = getFallbackQuote();
    
    // Update quote text with fade effect
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    
    setTimeout(() => {
        quoteText.textContent = quote.content;
        quoteAuthor.textContent = `— ${quote.author}`;
        
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 500);
    
    // Change background
    changeBackground();
    hideLoader();
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