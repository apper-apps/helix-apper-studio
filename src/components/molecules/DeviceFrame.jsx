import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DeviceFrame = ({ 
  device = 'desktop', 
  children, 
  className = '' 
}) => {
  const frames = {
    desktop: {
      width: '100%',
      height: '100%',
      padding: '0',
      borderRadius: '0',
      frame: null
    },
    laptop: {
      width: '1024px',
      height: '640px',
      padding: '20px 20px 40px 20px',
      borderRadius: '12px',
      frame: 'bg-slate-800 border-2 border-slate-600'
    },
    tablet: {
      width: '768px',
      height: '1024px',
      padding: '40px 20px',
      borderRadius: '20px',
      frame: 'bg-slate-800 border-2 border-slate-600'
    },
    mobile: {
      width: '375px',
      height: '667px',
      padding: '30px 10px',
      borderRadius: '24px',
      frame: 'bg-slate-800 border-2 border-slate-600'
    }
  };

  const currentFrame = frames[device];

  if (device === 'desktop') {
    return (
      <div className={`w-full h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight: '100%' }}
    >
      <div
        className={`${currentFrame.frame} shadow-2xl`}
        style={{
          width: currentFrame.width,
          height: currentFrame.height,
          borderRadius: currentFrame.borderRadius,
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        <div
          className="w-full h-full bg-white overflow-auto"
          style={{
            padding: currentFrame.padding,
            borderRadius: `calc(${currentFrame.borderRadius} - 2px)`,
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceFrame;