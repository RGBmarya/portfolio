const html = document.documentElement;
const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

const frameCount = 1530;
const currentFrame = index => (
    `./frames/out${index.toString()}.jpg`
);

// Cache for loaded images
const imageCache = new Map();

// Preload images with a limit to prevent memory issues
const preloadImages = () => {
    const batchSize = 50;
    let currentBatch = 0;
    
    const loadBatch = () => {
        const start = currentBatch * batchSize + 1;
        const end = Math.min(start + batchSize - 1, frameCount);
        
        for (let i = start; i <= end; i++) {
            if (!imageCache.has(i)) {
                const img = new Image();
                img.src = currentFrame(i);
                imageCache.set(i, img);
            }
        }
        
        currentBatch++;
        if (currentBatch * batchSize < frameCount) {
            setTimeout(loadBatch, 100);
        }
    };
    
    loadBatch();
};

// Initialize canvas
canvas.width = 1920;
canvas.height = 1080;

// Throttle function to limit function calls
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const updateImage = (index) => {
    const img = imageCache.get(index);
    if (img) {
        context.drawImage(img, 0, 0);
    }
};

const setupLinkControl = () => {
    const links = document.querySelectorAll('#links a');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            const scrollPercent = 100 * html.scrollTop / (html.scrollHeight - window.innerHeight);
            if (scrollPercent < 95) {
                event.preventDefault();
            }
        });
    });
};

let curOpacity = 0;
const links = document.querySelectorAll('#links a');
links.forEach(link => {
    link.style.opacity = curOpacity;
});

const updateOpacity = () => {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
    );
    
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
        updateImage(frameIndex + 1);
        
        const scrollPercent = (html.scrollTop + window.innerHeight) / html.scrollHeight * 100;
        if (scrollPercent >= 95) {
            curOpacity = Math.min(1, (scrollPercent - 95) / 5);
        } else {
            curOpacity = 0;
        }
        
        links.forEach(link => {
            link.style.opacity = curOpacity;
        });
    });
};

// Throttle scroll event to improve performance
window.addEventListener('scroll', throttle(updateOpacity, 16)); // ~60fps

// Initialize
preloadImages();
setupLinkControl();