import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
const TopToolbar = ({ 
  projectName = 'Untitled Project',
  onSave,
  onPreview,
  onResponsivePreview,
  onExport,
  onUndo,
  onRedo,
  onOpenTemplates,
  onFileUpload,
  previewDevice = 'desktop',
  onDeviceChange,
  canUndo = false,
  canRedo = false,
  isMobile = false,
  isResponsivePreview = false,
  mobileSidebarOpen = false,
  onToggleMobileSidebar,
  className = '' 
}) => {
const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef(null);

  const deviceOptions = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'mobile', label: 'Mobile' }
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/json': ['.json'],
      'text/html': ['.html'],
      'text/css': ['.css']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles);
    },
    noClick: true
  });

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    onPreview?.(!isPreviewMode);
  };

  const handleResponsivePreview = () => {
    onResponsivePreview?.(!isResponsivePreview);
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result,
            lastModified: file.lastModified
          };
          onFileUpload?.(fileData);
          toast.success(`${file.name} uploaded successfully`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
return (
    <div className={`h-16 bg-surface border-b border-slate-700 flex items-center justify-between px-4 ${className}`}>
      {/* Left Section - Logo & Project */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileSidebar}
            className="p-2 lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
        )}

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isMobile ? "Studio" : "Apper Studio"}
          </span>
        </div>
        
        {!isMobile && (
          <>
            <div className="h-6 w-px bg-slate-600" />
            
            <div className="flex items-center space-x-2">
              <ApperIcon name="File" size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-300 truncate max-w-32 sm:max-w-none">
                {projectName}
              </span>
            </div>
          </>
        )}
      </div>

{/* Center Section - Tools */}
      {!isMobile && (
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
      )}

{/* Right Section - Actions */}
      <div 
        {...getRootProps()}
        className={`flex items-center space-x-2 sm:space-x-3 ${
          isDragActive ? 'bg-primary/10 rounded-lg p-2 border border-primary border-dashed' : ''
        }`}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.json,.html,.css"
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />
        
        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg pointer-events-none">
            <span className="text-primary font-medium">Drop files here</span>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMobile ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2"
            >
              <ApperIcon name="MoreVertical" size={20} />
            </Button>
            
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-48 bg-surface border border-slate-600 rounded-lg shadow-xl z-50"
              >
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Undo" size={16} className="mr-2" />
                    Undo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Redo" size={16} className="mr-2" />
                    Redo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenTemplates}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Layout" size={16} className="mr-2" />
                    Templates
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileButtonClick}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload Files
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSave}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExport}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Export
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Select
                value={previewDevice}
                onChange={(e) => onDeviceChange?.(e.target.value)}
                options={deviceOptions}
                className="w-32"
              />
              
              <Button
                variant={isResponsivePreview ? "primary" : "ghost"}
                size="sm"
                onClick={handleResponsivePreview}
                className="flex items-center space-x-1"
                title="Responsive Preview"
              >
                <ApperIcon name="Smartphone" size={16} />
              </Button>
            </div>
            
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
              variant="ghost"
              size="sm"
              onClick={handleFileButtonClick}
              className="flex items-center space-x-1"
              title="Upload Files"
            >
              <ApperIcon name="Upload" size={16} />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            
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
              <span className="hidden lg:inline">Export</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopToolbar;