import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';

const ExportDialog = ({ 
  isOpen = false, 
  onClose, 
  onExport,
  projectName = 'my-app',
  className = '' 
}) => {
  const [exportFormat, setExportFormat] = useState('html');
  const [fileName, setFileName] = useState(projectName);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'html', label: 'Static HTML/CSS/JS' },
    { value: 'react', label: 'React Components' },
    { value: 'vue', label: 'Vue Components' },
    { value: 'figma', label: 'Figma Design File' }
  ];

  const handleExport = async () => {
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        format: exportFormat,
        fileName: fileName.trim(),
        includeAssets,
        timestamp: new Date().toISOString()
      };
      
      onExport?.(exportData);
      toast.success(`Successfully exported as ${exportFormat.toUpperCase()}`);
      onClose?.();
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
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
            className={`bg-surface rounded-xl border border-slate-700 shadow-2xl w-full max-w-md ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Download" size={20} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">Export Project</h2>
                    <p className="text-sm text-slate-400">Download your app as code</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                  disabled={isExporting}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <Select
                label="Export Format"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                options={formatOptions}
                disabled={isExporting}
              />
              
              <Input
                label="File Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                disabled={isExporting}
              />
              
              <div className="flex items-center space-x-2">
                <input
                  id="includeAssets"
                  type="checkbox"
                  checked={includeAssets}
                  onChange={(e) => setIncludeAssets(e.target.checked)}
                  disabled={isExporting}
                  className="w-4 h-4 text-primary bg-slate-700 border-slate-600 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="includeAssets" className="text-sm text-slate-300">
                  Include assets and dependencies
                </label>
              </div>
              
              {/* Export Info */}
              <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Info" size={16} className="text-info" />
                  <span className="text-sm font-medium text-slate-300">Export Details</span>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>• Format: {formatOptions.find(f => f.value === exportFormat)?.label}</p>
                  <p>• Size: ~2.5 MB (estimated)</p>
                  <p>• Dependencies: {includeAssets ? 'Included' : 'External'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <Button 
                variant="secondary" 
                onClick={onClose}
                disabled={isExporting}
              >
                Cancel
              </Button>
              
              <Button
                variant="accent"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader" size={16} />
                    </motion.div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Download" size={16} />
                    <span>Export Project</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportDialog;