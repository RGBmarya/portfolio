const html = document.documentElement;
const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

const frameCount = 2130;
const currentFrame = index => (
    `./frames/out${index.toString()}.jpg`
)

const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
    }
};

const img = new Image()
img.src = currentFrame(1);
canvas.width=1920;
canvas.height=1080;
img.onload=function(){
    context.drawImage(img, 0, 0);
}

const updateImage = index => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0);
}

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
let links = document.querySelectorAll('#links a');
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
    
    requestAnimationFrame(() => updateImage(frameIndex + 1));
    const scrollPercent = (html.scrollTop + window.innerHeight) / html.scrollHeight * 100;
    if (scrollPercent >= 95) {
        curOpacity = (scrollPercent - 95) / 5;
        if (curOpacity > 1) {
            curOpacity = 1;
        }
    }
    else {
        curOpacity = 0;
    }
    links.forEach(link => {
        link.style.opacity = curOpacity;
    });
};

window.addEventListener('scroll', updateOpacity);


// let observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//         console.log(scrollPercent)
//         if (scrollPercent >= 95) {
//             entry.target.style.animation = 'fade 2s ease both';
//             console.log("HERE")
//         } else {
//             entry.target.style.animation = '';
//         }
//     });
// });

// let links = document.querySelector('#links');

// window.addEventListener('scroll', () => {
//     const scrollPercent = (html.scrollTop + window.innerHeight) / html.scrollHeight * 100;
//     if (scrollPercent >= 95) {
//         // Perform your action here when the user has scrolled 95% of the page
//     }
// });

preloadImages();
setupLinkControl();