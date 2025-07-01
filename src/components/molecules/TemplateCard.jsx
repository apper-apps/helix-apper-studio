import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const TemplateCard = ({ 
  template, 
  onUse,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={className}
    >
      <Card variant="elevated" hover={false} className="overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon 
              name={template.icon || "Layout"} 
              size={48} 
              className="text-slate-400"
            />
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
              {template.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-slate-200 mb-2">{template.name}</h3>
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">
            {template.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">
                {template.components?.length || 0} components
              </span>
            </div>
            
            <Button
              size="sm"
              onClick={() => onUse(template)}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Plus" size={14} />
              <span>Use Template</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TemplateCard;