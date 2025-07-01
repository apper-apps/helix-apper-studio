import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Loading = ({ 
  message = "Loading...", 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: (
      <div className="flex items-center justify-center space-x-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name="Loader" size={24} className="text-primary" />
        </motion.div>
        <span className="text-slate-400">{message}</span>
      </div>
    ),
    skeleton: (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="h-32 bg-slate-700 rounded"></div>
      </div>
    ),
    spinner: (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-600 border-t-primary rounded-full animate-spin"></div>
      </div>
    ),
    dots: (
      <div className="flex items-center justify-center space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {variants[variant]}
    </div>
  );
};

export default Loading;