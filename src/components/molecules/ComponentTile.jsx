import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const ComponentTile = ({ 
  component, 
  onDragStart,
  onDragEnd,
  className = '' 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(component);
  };

  const handleDragEnd = (e) => {
    onDragEnd?.(component);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card
        variant="glass"
        hover={false}
        className="p-4 cursor-grab active:cursor-grabbing select-none"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon 
              name={component.icon} 
              size={20} 
              className="text-primary"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-200">{component.name}</p>
            <p className="text-xs text-slate-400">{component.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ComponentTile;