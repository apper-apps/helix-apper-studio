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
    try {
      // Enhanced validation for drag parameters
      if (!componentId || 
          typeof componentId !== 'string' ||
          !data || 
          typeof data !== 'object' ||
          typeof data.x !== 'number' || 
          typeof data.y !== 'number' ||
          isNaN(data.x) ||
          isNaN(data.y) ||
          !isFinite(data.x) ||
          !isFinite(data.y)) {
        console.warn('Invalid drag data:', { componentId, data });
        return;
      }

      // Validate components array exists
      if (!Array.isArray(components)) {
        console.warn('Components array is invalid:', components);
        return;
      }

      const alignedPosition = getAlignedPosition(data.x, data.y, componentId);
      const component = components.find(c => c && typeof c === 'object' && c.id === componentId);
      
      if (component && alignedPosition && typeof alignedPosition === 'object') {
        // Validate aligned position
        if (typeof alignedPosition.x !== 'number' || 
            typeof alignedPosition.y !== 'number' ||
            isNaN(alignedPosition.x) ||
            isNaN(alignedPosition.y)) {
          console.warn('Invalid aligned position:', alignedPosition);
          return;
        }

        const updatedComponent = {
          ...component,
          position: {
            x: alignedPosition.x,
            y: alignedPosition.y
          }
        };
        
        if (typeof onUpdateComponent === 'function') {
          onUpdateComponent(componentId, updatedComponent);
        }
      }
    } catch (error) {
      console.error('Error in handleComponentDrag:', error);
    }
  };

  const handleComponentResize = (componentId, direction, styleSize, clientSize, delta) => {
    try {
      if (!componentId || !clientSize || typeof clientSize.width !== 'number' || typeof clientSize.height !== 'number') {
        console.warn('Invalid resize data:', { componentId, clientSize });
        return;
      }

      const component = components?.find(c => c?.id === componentId);
      
      if (component) {
        const newSize = snapToGrid ? {
          width: Math.max(80, Math.round(clientSize.width / gridSize) * gridSize),
          height: Math.max(60, Math.round(clientSize.height / gridSize) * gridSize)
        } : {
          width: Math.max(80, clientSize.width),
          height: Math.max(60, clientSize.height)
        };
        
        const updatedComponent = {
          ...component,
          size: newSize
        };
        onUpdateComponent?.(componentId, updatedComponent);
      }
    } catch (error) {
      console.error('Error in handleComponentResize:', error);
    }
  };

  // Touch handling for mobile
  const handleTouchStart = (e, component) => {
    if (isMobile) {
      onSelectComponent?.(component);
    }
  };

const renderComponent = (component) => {
    // Enhanced validation for component data
    if (!component || 
        typeof component !== 'object' || 
        !component.id || 
        typeof component.id !== 'string' ||
        component.id.trim() === '') {
      console.warn('Invalid component data:', component);
      return null;
    }

    // Validate component type
    if (!component.type || typeof component.type !== 'string') {
      console.warn('Component missing valid type:', component);
      return null;
    }

    const isSelected = selectedComponent?.id === component.id;
    
    // Ensure position has valid numeric values with comprehensive validation
    const rawPosition = component.position || { x: 0, y: 0 };
    const position = {
      x: (typeof rawPosition.x === 'number' && !isNaN(rawPosition.x) && isFinite(rawPosition.x)) ? rawPosition.x : 0,
      y: (typeof rawPosition.y === 'number' && !isNaN(rawPosition.y) && isFinite(rawPosition.y)) ? rawPosition.y : 0
    };
    
    // Ensure size has valid numeric values with comprehensive validation
    const rawSize = component.size || {};
    const size = {
      width: (typeof rawSize.width === 'number' && rawSize.width > 0 && isFinite(rawSize.width)) ? rawSize.width : (isMobile ? 150 : 200),
      height: (typeof rawSize.height === 'number' && rawSize.height > 0 && isFinite(rawSize.height)) ? rawSize.height : (isMobile ? 150 : 200)
    };
    
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
                {component.name || 'Unnamed Component'}
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

    // Desktop: Full drag and resize functionality with error boundary
    try {
      return (
<Draggable
          key={`draggable-${component.id}`}
          position={position}
          onStop={(e, data) => {
            try {
              if (data && 
                  typeof data.x === 'number' && 
                  typeof data.y === 'number' &&
                  !isNaN(data.x) && 
                  !isNaN(data.y) &&
                  isFinite(data.x) &&
                  isFinite(data.y)) {
                handleComponentDrag(component.id, e, data);
              } else {
                console.warn('Invalid drag data received:', data);
              }
            } catch (error) {
              console.error('Error in drag handler:', error);
            }
          }}
          onStart={(e, data) => {
            try {
              // Validate drag start data
              if (!data || typeof data.x !== 'number' || typeof data.y !== 'number') {
                console.warn('Invalid drag start data:', data);
                return false; // Prevent drag
              }
            } catch (error) {
              console.error('Error in drag start handler:', error);
              return false; // Prevent drag
            }
          }}
          grid={snapToGrid ? [Math.max(1, gridSize), Math.max(1, gridSize)] : [1, 1]}
          handle=".drag-handle"
          defaultPosition={position}
          bounds="parent"
          disabled={!component.id || typeof component.id !== 'string'}
        >
          <div className="absolute">
            <ResizableBox
              width={size.width}
              height={size.height}
              onResizeStop={(direction, styleSize, clientSize, delta) => {
                try {
                  if (clientSize && typeof clientSize.width === 'number' && typeof clientSize.height === 'number') {
                    handleComponentResize(component.id, direction, styleSize, clientSize, delta);
                  }
                } catch (error) {
                  console.error('Error in resize handler:', error);
                }
              }}
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
                      {component.name || 'Unnamed Component'}
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
    } catch (error) {
      console.error('Error rendering draggable component:', error, component);
      // Fallback to static component if Draggable fails
      return (
        <div 
          key={component.id}
          className="absolute cursor-pointer bg-red-100 border-2 border-red-500 rounded p-2"
          style={{
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
          }}
          onClick={() => onSelectComponent?.(component)}
        >
          <div className="text-red-600 text-xs">Component Error</div>
          <div className="text-red-500 text-xs">{component.name || 'Unknown'}</div>
        </div>
      );
    }
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
{components?.filter(component => component && component.id).map(renderComponent)}

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