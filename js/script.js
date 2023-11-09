document.addEventListener('DOMContentLoaded', function () {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    let currentVideo; // Declare currentVideo variable
    let currentVideoIndex = 0; // Keep track of the current video index
    let audioPlaying = false; // Flag to track audio playback

    // Create an array to store preloaded video elements
    const preloadedVideos = [];

    // Define the videoArray with the video paths
    const videoArray = [
        'wwwroot/videos/SW1.mp4',
        'wwwroot/videos/SW2.mp4',
        'wwwroot/videos/SW3.mp4',
        'wwwroot/videos/SW4.mp4',
        'wwwroot/videos/SW5.mp4',
        'wwwroot/videos/SW6.mp4',
        // Add more video filenames as needed
    ];

    // Initialize CreateJS PreloadJS
    const preload = new createjs.LoadQueue();
    preload.setMaxConnections(5); // Adjust the number of concurrent downloads

    // Function to play video by index
    function playVideoByIndex(index) {
        if (currentVideo && currentVideo.parentNode) {
            currentVideo.pause();
            currentVideo.parentNode.removeChild(currentVideo);
        }

        const newVideo = preloadedVideos[index];
        videoPlayerContainer.appendChild(newVideo);

        newVideo.currentTime = currentVideo ? currentVideo.currentTime : 0; // Sync video time

        currentVideo = newVideo;
        currentVideo.play().catch(error => {
            console.error('Video playback error:', error.message);
        });

        currentVideoIndex = index;
    }

    // Preload all videos
    preload.loadManifest(videoArray.map(videoPath => ({ src: videoPath })));

    // Add an event listener for when all assets are loaded
    preload.on('complete', function () {
        // Create preloaded video elements
        videoArray.forEach(videoPath => {
            const video = document.createElement('video');
            video.src = videoPath;
            video.preload = 'auto';
            video.setAttribute('playsinline', ''); // Add playsinline attribute for mobile devices
            preloadedVideos.push(video);
        });

        // Add a click event listener to switch to the next video on user interaction
        document.addEventListener('click', () => {
            // Calculate the next index, wrapping around to the beginning if needed
            currentVideoIndex = (currentVideoIndex + 1) % videoArray.length;

            // Play the next video
            playVideoByIndex(currentVideoIndex);

            // Play the background audio using SoundJS only once
            if (!audioPlaying) {
                createjs.Sound.registerSound({ src: 'wwwroot/assets/Song.m4a', id: 'backgroundAudio' });
                const backgroundAudio = createjs.Sound.play('backgroundAudio', { loop: -1 });
                audioPlaying = true;
            }
        });

        // Start with the first video in the array
        playVideoByIndex(0);
    });
});
