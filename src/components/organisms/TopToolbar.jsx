import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

const TopToolbar = ({ 
  projectName = 'Untitled Project',
  onSave,
  onPreview,
  onExport,
  onUndo,
  onRedo,
  onOpenTemplates,
  previewDevice = 'desktop',
  onDeviceChange,
  canUndo = false,
  canRedo = false,
  className = '' 
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const deviceOptions = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'mobile', label: 'Mobile' }
  ];

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    onPreview?.(!isPreviewMode);
  };

  return (
    <div className={`h-16 bg-surface border-b border-slate-700 flex items-center justify-between px-4 ${className}`}>
      {/* Left Section - Logo & Project */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Apper Studio
          </span>
        </div>
        
        <div className="h-6 w-px bg-slate-600" />
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="File" size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">{projectName}</span>
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-slate-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="px-2"
          >
            <ApperIcon name="Undo" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="px-2"
          >
            <ApperIcon name="Redo" size={16} />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-slate-600" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenTemplates}
          className="flex items-center space-x-1"
        >
          <ApperIcon name="Layout" size={16} />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        <Select
          value={previewDevice}
          onChange={(e) => onDeviceChange?.(e.target.value)}
          options={deviceOptions}
          className="w-32"
        />
        
        <div className="flex items-center bg-slate-800 rounded-lg p-1">
          <Button
            variant={isPreviewMode ? "primary" : "ghost"}
            size="sm"
            onClick={handlePreview}
            className="flex items-center space-x-1"
          >
            <ApperIcon name="Eye" size={16} />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </div>
        
        <div className="h-6 w-px bg-slate-600" />
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          className="flex items-center space-x-1"
        >
          <ApperIcon name="Save" size={16} />
          <span className="hidden sm:inline">Save</span>
        </Button>
        
        <Button
          variant="accent"
          size="sm"
          onClick={onExport}
          className="flex items-center space-x-1"
        >
          <ApperIcon name="Download" size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;