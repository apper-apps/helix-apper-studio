import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Slider from '@/components/atoms/Slider';
import PropertyGroup from '@/components/molecules/PropertyGroup';
import Button from '@/components/atoms/Button';

const PropertiesPanel = ({ 
  selectedComponent,
  onUpdateComponent,
  isMobile = false,
  onClose,
  className = '' 
}) => {
  const [openGroups, setOpenGroups] = useState({
    general: true,
    styling: true,
    layout: true,
    content: true
  });

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handlePropertyChange = (property, value) => {
    if (!selectedComponent) return;
    
    onUpdateComponent?.(selectedComponent.id, {
      ...selectedComponent,
      properties: {
        ...selectedComponent.properties,
        [property]: value
      }
    });
  };

  const handlePositionChange = (axis, value) => {
    if (!selectedComponent) return;
    
    onUpdateComponent?.(selectedComponent.id, {
      ...selectedComponent,
      position: {
        ...selectedComponent.position,
        [axis]: parseInt(value)
      }
    });
  };

  const handleSizeChange = (dimension, value) => {
    if (!selectedComponent) return;
    
    onUpdateComponent?.(selectedComponent.id, {
      ...selectedComponent,
      size: {
        ...selectedComponent.size,
        [dimension]: parseInt(value)
      }
    });
  };

if (!selectedComponent) {
    return (
      <div className={`${isMobile ? 'fixed inset-0 z-50 bg-surface' : 'w-80 bg-surface border-l border-slate-700'} ${className}`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Settings" size={20} className="text-slate-400" />
              <h2 className="font-semibold text-slate-400">Properties</h2>
            </div>
            {isMobile && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <ApperIcon name="MousePointer" size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No Component Selected</p>
            <p className="text-sm text-slate-500">
              {isMobile ? "Tap on a component in the canvas to edit its properties" : "Click on a component in the canvas to edit its properties"}
            </p>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-surface' : 'w-80 bg-surface border-l border-slate-700'} flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Settings" size={20} className="text-primary" />
            <h2 className="font-semibold text-slate-200">Properties</h2>
          </div>
          {isMobile && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon 
              name={selectedComponent.icon || 'Square'} 
              size={12} 
              className="text-primary"
            />
          </div>
          <span className="text-sm font-medium text-slate-300 truncate">
            {selectedComponent.name}
          </span>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* General Properties */}
        <PropertyGroup
          title="General"
          icon="Info"
          isOpen={openGroups.general}
          onToggle={() => toggleGroup('general')}
        >
          <Input
            label="Component Name"
            value={selectedComponent.name || ''}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
          />
          
          <Select
            label="Component Type"
            value={selectedComponent.type || ''}
            onChange={(e) => handlePropertyChange('type', e.target.value)}
            options={[
              { value: 'header', label: 'Header' },
              { value: 'button', label: 'Button' },
              { value: 'card', label: 'Card' },
              { value: 'form', label: 'Form' },
              { value: 'text', label: 'Text' },
              { value: 'image', label: 'Image' }
            ]}
          />
        </PropertyGroup>

        {/* Layout Properties */}
        <PropertyGroup
          title="Layout"
          icon="Move"
          isOpen={openGroups.layout}
          onToggle={() => toggleGroup('layout')}
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="X Position"
              type="number"
              value={selectedComponent.position?.x || 0}
              onChange={(e) => handlePositionChange('x', e.target.value)}
            />
            <Input
              label="Y Position"
              type="number"
              value={selectedComponent.position?.y || 0}
              onChange={(e) => handlePositionChange('y', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Width"
              type="number"
              value={selectedComponent.size?.width || 200}
              onChange={(e) => handleSizeChange('width', e.target.value)}
            />
            <Input
              label="Height"
              type="number"
              value={selectedComponent.size?.height || 100}
              onChange={(e) => handleSizeChange('height', e.target.value)}
            />
          </div>
        </PropertyGroup>

        {/* Styling Properties */}
        <PropertyGroup
          title="Styling"
          icon="Palette"
          isOpen={openGroups.styling}
          onToggle={() => toggleGroup('styling')}
        >
          <Input
            label="Background Color"
            type="color"
            value={selectedComponent.properties?.backgroundColor || '#1E293B'}
            onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
          />
          
          <Input
            label="Text Color"
            type="color"
            value={selectedComponent.properties?.textColor || '#F1F5F9'}
            onChange={(e) => handlePropertyChange('textColor', e.target.value)}
          />
          
          <Slider
            label="Border Radius"
            min={0}
            max={20}
            value={selectedComponent.properties?.borderRadius || 8}
            onChange={(e) => handlePropertyChange('borderRadius', parseInt(e.target.value))}
          />
          
          <Slider
            label="Opacity"
            min={0}
            max={100}
            value={selectedComponent.properties?.opacity || 100}
            onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value))}
          />
        </PropertyGroup>

        {/* Content Properties */}
        <PropertyGroup
          title="Content"
          icon="Type"
          isOpen={openGroups.content}
          onToggle={() => toggleGroup('content')}
        >
          <Input
            label="Text Content"
            value={selectedComponent.properties?.text || ''}
            onChange={(e) => handlePropertyChange('text', e.target.value)}
            placeholder="Enter text content..."
          />
          
          <Select
            label="Text Size"
            value={selectedComponent.properties?.fontSize || 'md'}
            onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
            options={[
              { value: 'xs', label: 'Extra Small' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' }
            ]}
          />
          
          <Select
            label="Text Weight"
            value={selectedComponent.properties?.fontWeight || 'normal'}
            onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'normal', label: 'Normal' },
              { value: 'medium', label: 'Medium' },
              { value: 'semibold', label: 'Semi Bold' },
              { value: 'bold', label: 'Bold' }
            ]}
          />
          
          <Select
            label="Text Alignment"
            value={selectedComponent.properties?.textAlign || 'left'}
            onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' }
            ]}
          />
        </PropertyGroup>

        {/* Actions */}
{/* Hero Section Specific Properties */}
        {selectedComponent.type === 'hero' && (
          <PropertyGroup
            title="Hero Content"
            icon="Video"
            isOpen={openGroups.hero || true}
            onToggle={() => toggleGroup('hero')}
          >
            <Input
              label="Hero Title"
              value={selectedComponent.properties?.title || ''}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Welcome to Your App"
            />
            
            <Input
              label="Hero Subtitle"
              value={selectedComponent.properties?.subtitle || ''}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Build amazing experiences..."
            />
            
            <Input
              label="Video URL"
              value={selectedComponent.properties?.videoUrl || ''}
              onChange={(e) => handlePropertyChange('videoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            
            <Input
              label="Background Image URL"
              value={selectedComponent.properties?.backgroundImage || ''}
              onChange={(e) => handlePropertyChange('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            
            <Input
              label="CTA Button Text"
              value={selectedComponent.properties?.ctaText || ''}
              onChange={(e) => handlePropertyChange('ctaText', e.target.value)}
              placeholder="Get Started"
            />
          </PropertyGroup>
        )}

        <div className="pt-4 border-t border-slate-700 space-y-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              // Duplicate component logic
              console.log('Duplicate component:', selectedComponent.id);
            }}
          >
            <ApperIcon name="Copy" size={16} className="mr-2" />
            {isMobile ? "Duplicate" : "Duplicate Component"}
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={() => {
              // Delete component logic
              console.log('Delete component:', selectedComponent.id);
            }}
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            {isMobile ? "Delete" : "Delete Component"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;