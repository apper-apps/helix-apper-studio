import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  message = "Something went wrong", 
  description,
  onRetry,
  showRetry = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {message}
      </h3>
      
      {description && (
        <p className="text-slate-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Error;