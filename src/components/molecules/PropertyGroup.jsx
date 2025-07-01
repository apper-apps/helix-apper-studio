import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PropertyGroup = ({ 
  title, 
  icon, 
  children, 
  isOpen = true, 
  onToggle,
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-700 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-2">
          {icon && (
            <ApperIcon 
              name={icon} 
              size={16} 
              className="text-slate-400"
            />
          )}
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronDown" : "ChevronRight"} 
          size={16} 
          className="text-slate-400 transition-transform"
        />
      </motion.button>
      
      <motion.div
        initial={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="space-y-3 pl-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyGroup;