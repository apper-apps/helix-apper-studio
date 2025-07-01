import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ComponentTile from '@/components/molecules/ComponentTile';
import Input from '@/components/atoms/Input';

const ComponentSidebar = ({ 
  components = [], 
  onDragStart, 
  onDragEnd,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Components' },
    { value: 'layout', label: 'Layout' },
    { value: 'form', label: 'Forms' },
    { value: 'display', label: 'Display' },
    { value: 'navigation', label: 'Navigation' }
  ];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`w-80 bg-surface border-r border-slate-700 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Package" size={20} className="text-primary" />
          <h2 className="font-semibold text-slate-200">Components</h2>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Package" size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No components found</p>
            <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredComponents.map((component) => (
              <ComponentTile
                key={component.id}
                component={component}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSidebar;