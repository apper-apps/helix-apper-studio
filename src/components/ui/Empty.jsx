import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  icon = "Package",
  title = "No items found", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-200 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-400 mb-8 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;