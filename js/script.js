document.addEventListener('DOMContentLoaded', function () {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    let currentVideo; // Declare currentVideo variable
    let currentVideoIndex = 0; // Keep track of the current video index
    let backgroundAudio; // Declare backgroundAudio variable for Howler.js
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

    // Preload all videos in advance
    videoArray.forEach(videoPath => {
        const video = document.createElement('video');
        video.src = videoPath;
        video.preload = 'auto';
        video.setAttribute('playsinline', ''); // Add playsinline attribute for mobile devices
        preloadedVideos.push(video);
    });

    // Function to play video by index
    function playVideoByIndex(index) {
        if (currentVideo) {
            currentVideo.pause();
            videoPlayerContainer.removeChild(currentVideo);
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

    // Add a click event listener to switch to the next video on user interaction
    document.addEventListener('click', () => {
        // Calculate the next index, wrapping around to the beginning if needed
        currentVideoIndex = (currentVideoIndex + 1) % videoArray.length;

        // Play the next video
        playVideoByIndex(currentVideoIndex);

        // Play the background audio using Howler.js only once
        if (!audioPlaying) {
            backgroundAudio = new Howl({
                src: ['wwwroot/assets/Song.m4a'], // Update this to the relative path of your audio file
                loop: true, // Set the loop attribute to true for continuous playback
                html5: true, // Use HTML5 audio
            });
            backgroundAudio.play();
            audioPlaying = true;
        }
    });

    // Start with the first video in the array
    playVideoByIndex(0);
});
