import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TemplateCard from '@/components/molecules/TemplateCard';

const TemplateGallery = ({ 
  templates = [], 
  isOpen = false, 
  onClose, 
  onSelectTemplate,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'saas', label: 'SaaS' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'admin', label: 'Admin Panel' },
    { value: 'ecommerce', label: 'E-commerce' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    onSelectTemplate?.(template);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-surface rounded-xl border border-slate-700 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Layout" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">Template Gallery</h2>
                    <p className="text-sm text-slate-400">Choose a template to get started quickly</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Layout" size={64} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Templates Found</h3>
                  <p className="text-slate-400">Try adjusting your search or category filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.Id}
                      template={template}
                      onUse={handleUseTemplate}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUseTemplate({ Id: 0, name: 'Blank Template', components: [] })}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span>Start Blank</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateGallery;