import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable-box';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CanvasArea = ({ 
  components = [], 
  selectedComponent,
  onSelectComponent,
  onDropComponent,
  onDeleteComponent,
  onUpdateComponent,
  isMobile = false,
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [dragPosition, setDragPosition] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const canvasRef = useRef(null);

  const gridSize = isMobile ? 15 : 20;

  // Snap position to grid
  const snapPosition = useCallback((x, y) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);

  // Auto-align nearby components
  const getAlignedPosition = useCallback((x, y, componentId) => {
    if (!snapToGrid) return { x, y };
    
    const alignmentThreshold = gridSize * 2;
    const otherComponents = components.filter(c => c.id !== componentId);
    
    let alignedX = x;
    let alignedY = y;
    
    // Check for alignment with other components
    otherComponents.forEach(comp => {
      const compX = comp.position?.x || 0;
      const compY = comp.position?.y || 0;
      
      // Horizontal alignment
      if (Math.abs(x - compX) < alignmentThreshold) {
        alignedX = compX;
      }
      
      // Vertical alignment
      if (Math.abs(y - compY) < alignmentThreshold) {
        alignedY = compY;
      }
    });
    
    return snapPosition(alignedX, alignedY);
  }, [components, snapToGrid, snapPosition, gridSize]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragPosition(snapPosition(x, y));
    }
  };

  const handleDragLeave = (e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setDragPosition(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragPosition(null);
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const alignedPosition = getAlignedPosition(x, y, null);
      onDropComponent?.(componentData, alignedPosition);
    } catch (error) {
      console.error('Error dropping component:', error);
    }
  };

  const handleComponentDrag = (componentId, e, data) => {
    const alignedPosition = getAlignedPosition(data.x, data.y, componentId);
    const component = components.find(c => c.id === componentId);
    
    if (component) {
      const updatedComponent = {
        ...component,
        position: alignedPosition
      };
      onUpdateComponent?.(componentId, updatedComponent);
    }
  };

  const handleComponentResize = (componentId, direction, styleSize, clientSize, delta) => {
    const component = components.find(c => c.id === componentId);
    
    if (component) {
      const newSize = snapToGrid ? {
        width: Math.round(clientSize.width / gridSize) * gridSize,
        height: Math.round(clientSize.height / gridSize) * gridSize
      } : clientSize;
      
      const updatedComponent = {
        ...component,
        size: newSize
      };
      onUpdateComponent?.(componentId, updatedComponent);
    }
  };

  // Touch handling for mobile
  const handleTouchStart = (e, component) => {
    if (isMobile) {
      onSelectComponent?.(component);
    }
  };

  const renderComponent = (component) => {
    const isSelected = selectedComponent?.id === component.id;
    const position = component.position || { x: 0, y: 0 };
    const size = component.size || { width: isMobile ? 150 : 200, height: isMobile ? 80 : 100 };
    
    if (isMobile) {
      // Mobile: Simple touch interaction without drag/resize
      return (
        <motion.div
          key={component.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.98 }}
          className={`absolute cursor-pointer transition-all duration-200 touch-manipulation ${
            isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}
          style={{
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
          }}
          onClick={() => onSelectComponent?.(component)}
          onTouchStart={(e) => handleTouchStart(e, component)}
        >
          <div className={`w-full h-full rounded-lg border-2 border-dashed ${
            isSelected ? 'border-primary bg-primary/5' : 'border-slate-600 bg-slate-800/50'
          } flex items-center justify-center relative group`}>
            <div className="flex flex-col items-center space-y-2">
              <ApperIcon 
                name={component.icon || 'Square'} 
                size={20} 
                className={isSelected ? 'text-primary' : 'text-slate-400'}
              />
              <span className={`text-xs font-medium truncate max-w-full px-1 ${
                isSelected ? 'text-primary' : 'text-slate-400'
              }`}>
                {component.name}
              </span>
            </div>
            
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteComponent?.(component.id);
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center transition-opacity"
              >
                <ApperIcon name="X" size={16} className="text-white" />
              </button>
            )}
          </div>
        </motion.div>
      );
    }

    // Desktop: Full drag and resize functionality
    return (
      <Draggable
        key={component.id}
        position={position}
        onStop={(e, data) => handleComponentDrag(component.id, e, data)}
        grid={snapToGrid ? [gridSize, gridSize] : [1, 1]}
        handle=".drag-handle"
      >
        <div className="absolute">
          <ResizableBox
            width={size.width}
            height={size.height}
            onResizeStop={(direction, styleSize, clientSize, delta) => 
              handleComponentResize(component.id, direction, styleSize, clientSize, delta)
            }
            minConstraints={[80, 60]}
            maxConstraints={[800, 600]}
            resizeHandles={isSelected ? ['se', 'e', 's', 'ne', 'nw', 'sw', 'w', 'n'] : []}
            handleStyles={{
              se: { width: 10, height: 10, backgroundColor: '#6366F1', border: 'none', borderRadius: '50%' },
              e: { width: 6, height: '100%', backgroundColor: '#6366F1', border: 'none' },
              s: { width: '100%', height: 6, backgroundColor: '#6366F1', border: 'none' },
              ne: { width: 10, height: 10, backgroundColor: '#6366F1', border: 'none', borderRadius: '50%' },
              nw: { width: 10, height: 10, backgroundColor: '#6366F1', border: 'none', borderRadius: '50%' },
              sw: { width: 10, height: 10, backgroundColor: '#6366F1', border: 'none', borderRadius: '50%' },
              w: { width: 6, height: '100%', backgroundColor: '#6366F1', border: 'none' },
              n: { width: '100%', height: 6, backgroundColor: '#6366F1', border: 'none' }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`w-full h-full cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
              onClick={() => onSelectComponent?.(component)}
            >
              <div className={`w-full h-full rounded-lg border-2 border-dashed ${
                isSelected ? 'border-primary bg-primary/5' : 'border-slate-600 bg-slate-800/50'
              } flex items-center justify-center relative group`}>
                {/* Drag Handle */}
                <div className={`drag-handle absolute top-0 left-0 right-0 h-8 flex items-center justify-center cursor-move ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Component Content */}
                <div className="flex flex-col items-center space-y-2 pointer-events-none">
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
                    className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ApperIcon name="X" size={12} className="text-white" />
                  </button>
                )}
                
                {/* Alignment Guidelines */}
                {isSelected && snapToGrid && (
                  <>
                    <div className="absolute -left-px top-0 bottom-0 w-px bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute left-0 right-0 -top-px h-px bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </div>
            </motion.div>
          </ResizableBox>
        </div>
      </Draggable>
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
            title="Toggle Grid"
          >
            <ApperIcon name="Grid3X3" size={16} />
          </Button>
          
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={snapToGrid ? 'text-primary' : ''}
              title="Toggle Snap to Grid"
            >
              <ApperIcon name="Magnet" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-auto transition-all duration-200 ${
          isDragOver ? 'bg-primary/5 border-2 border-primary border-dashed' : ''
        } ${isMobile ? 'touch-manipulation' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundImage: showGrid ? `
            radial-gradient(circle, #6366F1 1px, transparent 1px)
          ` : 'none',
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'auto',
          backgroundPosition: '0 0'
        }}
      >
        {/* Empty State */}
        {components.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <ApperIcon name="Plus" size={isMobile ? 48 : 64} className="text-slate-600 mx-auto mb-4" />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-300 mb-2`}>
                Start Building Your App
              </h3>
              <p className="text-slate-500 mb-4">
                {isMobile 
                  ? "Tap the menu to add components and start building"
                  : "Drag components from the sidebar to begin creating your application layout"
                }
              </p>
              <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'} text-sm text-slate-600`}>
                <div className="flex items-center space-x-1">
                  <ApperIcon name={isMobile ? "Touch" : "MousePointer"} size={16} />
                  <span>{isMobile ? "Tap & Select" : "Drag & Drop"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Move" size={16} />
                  <span>{isMobile ? "Touch to Edit" : "Drag to Move"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Maximize" size={16} />
                  <span>{isMobile ? "Properties" : "Resize"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drag Over State */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <ApperIcon name="Download" size={isMobile ? 48 : 64} className="text-primary mx-auto mb-4" />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-primary mb-2`}>
                Drop Component Here
              </h3>
              <p className="text-primary/70">
                Component will auto-align to the grid
              </p>
              {dragPosition && !isMobile && (
                <div 
                  className="absolute w-4 h-4 bg-primary rounded-full animate-ping"
                  style={{
                    left: dragPosition.x - 8,
                    top: dragPosition.y - 8
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Render Components */}
        {components.map(renderComponent)}

        {/* Grid Overlay (for visual reference when not using background grid) */}
        {showGrid && snapToGrid && !isMobile && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {/* Grid lines can be added here for more visual feedback */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasArea;