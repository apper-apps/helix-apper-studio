import { useState, useEffect } from 'react';
import SplitPane from 'react-split-pane';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const MasterLayout = ({ 
  leftPanel, 
  centerPanel, 
  rightPanel,
  leftPanelVisible = true,
  rightPanelVisible = true,
  onToggleLeftPanel,
  onToggleRightPanel,
  isMobile = false,
  className = ''
}) => {
  const [panelSizes, setPanelSizes] = useState({
    leftWidth: 280,
    rightWidth: 320
  });

  // Load saved panel sizes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studio-panel-sizes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPanelSizes(parsed);
      } catch (error) {
        console.error('Failed to parse saved panel sizes:', error);
      }
    }
  }, []);

  // Save panel sizes to localStorage
  const savePanelSizes = (sizes) => {
    setPanelSizes(sizes);
    localStorage.setItem('studio-panel-sizes', JSON.stringify(sizes));
  };

  const handleLeftPanelResize = (size) => {
    savePanelSizes({
      ...panelSizes,
      leftWidth: size
    });
  };

  const handleRightPanelResize = (size) => {
    savePanelSizes({
      ...panelSizes,
      rightWidth: size
    });
  };

  // Mobile layout - stack panels
  if (isMobile) {
    return (
      <div className={`flex flex-col h-full overflow-hidden ${className}`}>
        {/* Left Panel (Component Sidebar) - Mobile Overlay */}
        {leftPanelVisible && leftPanel}
        
        {/* Center Panel (Canvas) - Always visible on mobile */}
        <div className="flex-1 overflow-hidden">
          {centerPanel}
        </div>
        
        {/* Right Panel (Properties) - Mobile Overlay */}
        {rightPanelVisible && rightPanel}
      </div>
    );
  }

  // Desktop layout with resizable panels
  return (
    <div className={`h-full overflow-hidden ${className}`}>
      <SplitPane
        split="vertical"
        minSize={leftPanelVisible ? 200 : 0}
        maxSize={leftPanelVisible ? 400 : 0}
        size={leftPanelVisible ? panelSizes.leftWidth : 0}
        onDragFinished={handleLeftPanelResize}
        allowResize={leftPanelVisible}
        resizerStyle={{
          background: leftPanelVisible ? '#475569' : 'transparent',
          opacity: leftPanelVisible ? 1 : 0,
          width: leftPanelVisible ? '4px' : '0px',
          cursor: leftPanelVisible ? 'col-resize' : 'default',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Left Panel */}
        <div className={`h-full transition-all duration-300 ${
          leftPanelVisible ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
        }`}>
          {leftPanelVisible && (
            <div className="h-full relative">
              {leftPanel}
              
              {/* Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLeftPanel}
                className="absolute -right-8 top-4 z-10 bg-surface border border-slate-600 hover:bg-slate-700"
                title="Hide Components Panel"
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Right Side - Center + Right Panel */}
        <SplitPane
          split="vertical"
          minSize={rightPanelVisible ? -400 : 0}
          maxSize={rightPanelVisible ? -200 : 0}
          size={rightPanelVisible ? -panelSizes.rightWidth : 0}
          onDragFinished={handleRightPanelResize}
          allowResize={rightPanelVisible}
          resizerStyle={{
            background: rightPanelVisible ? '#475569' : 'transparent',
            opacity: rightPanelVisible ? 1 : 0,
            width: rightPanelVisible ? '4px' : '0px',
            cursor: rightPanelVisible ? 'col-resize' : 'default',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Center Panel */}
          <div className="h-full relative">
            {centerPanel}
            
            {/* Panel Toggle Buttons */}
            <div className="absolute top-4 left-4 flex space-x-2 z-10">
              {!leftPanelVisible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleLeftPanel}
                  className="bg-surface/90 backdrop-blur border border-slate-600 hover:bg-slate-700"
                  title="Show Components Panel"
                >
                  <ApperIcon name="Package" size={16} />
                </Button>
              )}
            </div>
            
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              {!rightPanelVisible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleRightPanel}
                  className="bg-surface/90 backdrop-blur border border-slate-600 hover:bg-slate-700"
                  title="Show Properties Panel"
                >
                  <ApperIcon name="Settings" size={16} />
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className={`h-full transition-all duration-300 ${
            rightPanelVisible ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            {rightPanelVisible && (
              <div className="h-full relative">
                {rightPanel}
                
                {/* Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleRightPanel}
                  className="absolute -left-8 top-4 z-10 bg-surface border border-slate-600 hover:bg-slate-700"
                  title="Hide Properties Panel"
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            )}
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
};

export default MasterLayout;