document.addEventListener('DOMContentLoaded', function () {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    let currentVideoIndex = 0;
    let audioPlaying = false;
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

    // Function to play video by index
    function playVideoByIndex(index) {
        const newVideo = preloadedVideos[index];
        videoPlayerContainer.innerHTML = ''; // Clear container
        videoPlayerContainer.appendChild(newVideo);

        newVideo.currentTime = 0; // Reset video time
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
        if (preloadedVideos.length === 0) {
            const videos = assetsToLoad.filter(asset => asset.endsWith('.mp4'));
            videos.forEach((video, index) => {
                if (!preloadedVideos[index] && preload.getResult(video)) {
                    const videoElement = document.createElement('video');
                    videoElement.src = video;
                    videoElement.preload = 'auto';
                    videoElement.setAttribute('playsinline', '');
                    preloadedVideos[index] = videoElement;

                    // Trigger the start of the game when the first video is preloaded
                    if (index === 0 && assetsLoaded === 0) {
                        startGame();
                    }
                }
            });
        }
    });

    // Add an event listener for when each asset is loaded
    preload.on('fileload', function (event) {
        assetsLoaded++;
        console.log('Assets loaded:', assetsLoaded);
    });

    // Add an event listener for when all assets are loaded
    preload.on('complete', function () {
        loadingBar.style.display = 'none'; // Hide loading bar
        console.log('All assets loaded');
    });

    function startGame() {
        // Add a click event listener to switch to the next video on user interaction
        document.addEventListener('click', function () {
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
