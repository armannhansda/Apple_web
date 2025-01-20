import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../util";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    videoId: 0,
    startPlay: false,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, isLastVideo, isPlaying, videoId } = video;

  // Use GSAP to trigger animations when the video comes into view
  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translate(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[video]?.pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // Handle loaded metadata for videos
  const handleLoadedMetadata = (i, e) => {
    // Updated: Store metadata for each video using its index `i` to prevent issues with data integrity
    setLoadedData((prev) => {
      const newData = [...prev];
      newData[i] = e;
      return newData;
    });
  };

  useEffect(() => {
    let currentProgress = 0;

    let span = videoSpanRef.current;

    if (span[videoId]) {
      // Animate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            // Adjust the progress bar width based on the screen size
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            // Update the progress bar width and color
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      // Updated: Animating based on current video time, using the `videoRef` to get `currentTime`
      const animUpdate = () => {
        if (videoRef.current[videoId]) {
          const progress =
            videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration;
          anim.progress(progress); // Updated: Syncing GSAP animation with video playback time
        }
      };

      // Add or remove the animation ticker based on the playing state
      if (isPlaying) {
        gsap.ticker.add(animUpdate); // Updated: Use GSAP ticker to continuously update progress during video play
      } else {
        gsap.ticker.remove(animUpdate);
      }

      // If it's the first video, restart the animation
      if (videoId === 0) {
        anim.restart();
      }
    }
  }, [videoId, startPlay]);

  // Handle different video processes like play/pause, video end, reset
  const handleprocess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({
          ...pre,
          isEnd: true,
          videoId: i + 1, // Move to the next video when current video ends
        }));
        break;
      case "video-last":
        setVideo((pre) => ({
          ...pre,
          isLastVideo: true, // Set last video flag when the last video is reached
        }));
        break;
      case "video-reset":
        setVideo((pre) => ({
          ...pre,
          isLastVideo: false, // Reset to first video when replaying
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((pre) => ({
          ...pre,
          isPlaying: true, // Set to play
        }));
        break;
      case "pause":
        setVideo((pre) => ({
          ...pre,
          isPlaying: false, // Set to pause
        }));
        break;
      case "play":
        setVideo((pre) => ({
          ...pre,
          isPlaying: !pre.isPlaying, // Toggle between play and pause
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-21 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${list.id === 2 && "translate-x-44"}
                    pointer-events-none`}
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleprocess("video-end", i)
                      : handleprocess("video-last")
                  }
                  onPlay={() => {
                    setVideo((preVideo) => ({
                      ...preVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)} // Updated: Call `handleLoadedMetadata` for each video
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleprocess("video-reset") // Reset to the first video if it's the last one
                : !isPlaying
                ? () => handleprocess("play") // Play if it's not playing
                : () => handleprocess("pause") // Pause if it's playing
            }
          />
        </button>
      </div>
    </>
  );
};
