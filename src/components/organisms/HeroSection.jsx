import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HeroSection = ({ 
  title = "Welcome to Your App",
  subtitle = "Build amazing experiences with our platform",
  videoUrl = "",
  backgroundImage = "",
  ctaText = "Get Started",
  onCtaClick,
  overlay = true,
  className = ""
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const playerRef = useRef(null);

  const handleVideoReady = () => {
    setIsVideoLoaded(true);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {videoUrl && showVideo ? (
          <div className="w-full h-full">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing
              loop
              muted
              width="100%"
              height="100%"
              onReady={handleVideoReady}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                objectFit: 'cover'
              }}
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        ) : backgroundImage ? (
          <img 
            src={backgroundImage} 
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        )}
        
        {/* Overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
            {title}
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onCtaClick}
              className="text-lg px-8 py-3"
            >
              {ctaText}
              <ApperIcon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            
            {videoUrl && (
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleVideo}
                className="text-white border-white/30 hover:bg-white/10"
              >
                <ApperIcon 
                  name={showVideo ? "Pause" : "Play"} 
                  size={20} 
                  className="mr-2" 
                />
                {showVideo ? "Pause Video" : "Watch Video"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ApperIcon name="ChevronDown" size={32} className="text-white/70" />
      </motion.div>
    </section>
  );
};

export default HeroSection;