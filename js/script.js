document.addEventListener('DOMContentLoaded', function () {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    let currentVideoIndex = 0;
    let audioPlaying = false;
    let audioStartTime = 0;
    const preloadedVideos = [];
    let assetsLoaded = 0;

    // Define assets to preload
    const assetsToLoad = [
        'wwwroot/assets/CowboyHead.gif',
        'wwwroot/assets/Song.m4a',
        'wwwroot/videos/SW1.mp4',
        'wwwroot/videos/SW2.mp4',
        'wwwroot/videos/SW3.mp4',
        'wwwroot/videos/SW4.mp4',
        'wwwroot/videos/SW5.mp4',
        'wwwroot/videos/SW6.mp4',
        // Add more assets as needed
    ];

    const preload = new createjs.LoadQueue();
    preload.setMaxConnections(5);

    const loadingBar = document.getElementById('loadingBar');
    const loadingScreen = document.getElementById('loadingBarContainer');

    // Function to play video by index
    function playVideoByIndex(index) {
        const newVideo = preloadedVideos[index];
        videoPlayerContainer.innerHTML = ''; // Clear container

        // Add the 'playsinline' attribute for mobile devices
        newVideo.setAttribute('playsinline', '');

        videoPlayerContainer.appendChild(newVideo);

        // Set the current time in the video to match the audio start time
        newVideo.currentTime = audioStartTime;

        newVideo.play().catch(error => {
            console.error('Video playback error:', error.message);
        });
    }

    // Preload assets with progress tracking
    preload.loadManifest(assetsToLoad);

    // Add an event listener for progress updates during loading
    preload.on('progress', function (event) {
        loadingBar.style.width = (event.progress * 100) + '%';

        // Check if at least one video is preloaded
        if (preloadedVideos.length > 0 && !audioPlaying) {
            startGame();
        }
    });

    // Add an event listener for when each asset is loaded
    preload.on('fileload', function (event) {
        assetsLoaded++;
        console.log('Assets loaded:', assetsLoaded);

        // Check if the loaded asset is a video and it's not yet in the preloadedVideos array
        if (event.item.src.endsWith('.mp4') && !preloadedVideos.some(video => video.src === event.result.src)) {
            preloadedVideos.push(event.result);
        }

        // Trigger the start of the game when at least one video is preloaded
        if (preloadedVideos.length >= 1) {
            startGame();
        }
    });

    // Add an event listener for when all assets are loaded
    preload.on('complete', function () {
        console.log('All assets loaded');
        if (preloadedVideos.length === 0) {
            console.warn('No videos preloaded');
        }
    });

    function startGame() {
        // Add a click event listener to switch to the next video on user interaction
        document.addEventListener('click', function () {
            // Set the audio start time to match the current time in the current video
            audioStartTime = preloadedVideos[currentVideoIndex].currentTime;

            currentVideoIndex = (currentVideoIndex + 1) % preloadedVideos.length;
            playVideoByIndex(currentVideoIndex);

            if (!audioPlaying) {
                createjs.Sound.registerSound({ src: 'wwwroot/assets/Song.m4a', id: 'backgroundAudio' });
                const backgroundAudio = createjs.Sound.play('backgroundAudio', { loop: -1 });
                audioPlaying = true;
            }
        });

        // Start with the first video in the array
        playVideoByIndex(0);
    }
});
