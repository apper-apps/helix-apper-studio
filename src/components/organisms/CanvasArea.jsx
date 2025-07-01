import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CanvasArea = ({ 
  components = [], 
  selectedComponent,
  onSelectComponent,
  onDropComponent,
  onDeleteComponent,
  onUpdateComponent,
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const canvasRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      onDropComponent?.(componentData, { x, y });
    } catch (error) {
      console.error('Error dropping component:', error);
    }
  };

  const renderComponent = (component) => {
    const isSelected = selectedComponent?.id === component.id;
    
    return (
      <motion.div
        key={component.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
        }`}
        style={{
          left: component.position?.x || 0,
          top: component.position?.y || 0,
          width: component.size?.width || 200,
          height: component.size?.height || 100,
        }}
        onClick={() => onSelectComponent?.(component)}
      >
        <div className={`w-full h-full rounded-lg border-2 border-dashed ${
          isSelected ? 'border-primary bg-primary/5' : 'border-slate-600 bg-slate-800/50'
        } flex items-center justify-center relative group`}>
          {/* Component Content */}
          <div className="flex flex-col items-center space-y-2">
            <ApperIcon 
              name={component.icon || 'Square'} 
              size={24} 
              className={isSelected ? 'text-primary' : 'text-slate-400'}
            />
            <span className={`text-sm font-medium ${
              isSelected ? 'text-primary' : 'text-slate-400'
            }`}>
              {component.name}
            </span>
          </div>
          
          {/* Delete Button */}
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteComponent?.(component.id);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ApperIcon name="X" size={12} className="text-white" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`flex-1 flex flex-col bg-background ${className}`}>
      {/* Canvas Toolbar */}
      <div className="h-14 bg-surface border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="MousePointer" size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">Canvas</span>
          {components.length > 0 && (
            <span className="text-xs text-slate-500">
              ({components.length} component{components.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'text-primary' : ''}
          >
            <ApperIcon name="Grid3X3" size={16} />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-auto transition-all duration-200 ${
          isDragOver ? 'bg-primary/5 border-2 border-primary border-dashed' : ''
        } ${showGrid ? 'bg-grid-pattern' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setShowGrid(true)}
        onMouseLeave={() => setShowGrid(false)}
      >
        {/* Empty State */}
        {components.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Plus" size={64} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                Start Building Your App
              </h3>
              <p className="text-slate-500 mb-4 max-w-md">
                Drag components from the sidebar to begin creating your application layout
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MousePointer" size={16} />
                  <span>Drag & Drop</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Settings" size={16} />
                  <span>Configure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Eye" size={16} />
                  <span>Preview</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drag Over State */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <ApperIcon name="Download" size={64} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">
                Drop Component Here
              </h3>
              <p className="text-primary/70">
                Release to add component to your canvas
              </p>
            </div>
          </div>
        )}

        {/* Render Components */}
        {components.map(renderComponent)}

        {/* Grid Overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle, #6366F1 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasArea;