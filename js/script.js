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

    function preloadVideo(index) {
        const video = document.createElement('video');
        video.src = videoArray[index];
        video.preload = 'auto';
        video.setAttribute('playsinline', '');
        preloadedVideos[index] = video;
    }

    preloadVideo(0); // Only preload the first video initially

    preload.on('progress', function (event) {
        loadingBar.style.width = (event.progress * 100) + '%';

        if (event.progress >= 0.5) {
            loadingBar.style.display = 'none';

            document.addEventListener('click', () => {
                currentVideoIndex = (currentVideoIndex + 1) % videoArray.length;

                // Preload the next video on-demand
                preloadVideo(currentVideoIndex);

                playVideoByIndex(currentVideoIndex);

                if (!audioPlaying) {
                    createjs.Sound.registerSound({ src: 'wwwroot/assets/Song.m4a', id: 'backgroundAudio' });
                    const backgroundAudio = createjs.Sound.play('backgroundAudio', { loop: -1 });
                    audioPlaying = true;
                }
            });

            playVideoByIndex(0);
        }
    });
});
