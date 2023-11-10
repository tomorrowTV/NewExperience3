document.addEventListener('DOMContentLoaded', function () {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    let currentVideo;
    let currentVideoIndex = 0;
    let audioPlaying = false;
    const preloadedVideos = [];
    const videoArray = [
        'wwwroot/videos/SW1.mp4',
        'wwwroot/videos/SW2.mp4',
        'wwwroot/videos/SW3.mp4',
        'wwwroot/videos/SW4.mp4',
        'wwwroot/videos/SW5.mp4',
        'wwwroot/videos/SW6.mp4',
        // Add more video filenames as needed
    ];

    const preload = new createjs.LoadQueue();
    preload.setMaxConnections(5);

    const loadingBar = document.getElementById('loadingBar');

    // Set the number of assets to preload before enabling the game
    const preloadThreshold = 3;
    let assetsLoaded = 0;

    // Function to play video by index
    function playVideoByIndex(index) {
        if (currentVideo) {
            currentVideo.pause();
            videoPlayerContainer.removeChild(currentVideo);
        }

        const newVideo = preloadedVideos[index];
        videoPlayerContainer.appendChild(newVideo);

        newVideo.currentTime = currentVideo ? currentVideo.currentTime : 0;
        currentVideo = newVideo;
        currentVideo.play().catch(error => {
            console.error('Video playback error:', error.message);
        });

        currentVideoIndex = index;
    }

    // Preload videos with progress tracking
    preload.loadManifest(videoArray.map(videoPath => ({ src: videoPath })));

    // Add an event listener for progress updates during loading
    preload.on('progress', function (event) {
        loadingBar.style.width = (event.progress * 100) + '%';

        // Check if the preload threshold is reached
        if (assetsLoaded < preloadThreshold && event.loaded === 1) {
            assetsLoaded++;
            if (assetsLoaded === preloadThreshold) {
                // Enable the game or initiate specific logic
                startGame();
            }
        }
    });

    function startGame() {
        // Hide or remove the loading bar element
        loadingBar.style.display = 'none';

        // Create preloaded video elements
        videoArray.forEach(videoPath => {
            const video = document.createElement('video');
            video.src = videoPath;
            video.preload = 'auto';
            video.setAttribute('playsinline', '');
            preloadedVideos.push(video);
        });

        // Add a click event listener to switch to the next video on user interaction
        document.addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videoArray.length;
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
