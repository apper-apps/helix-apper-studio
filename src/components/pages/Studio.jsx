import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ComponentSidebar from '@/components/organisms/ComponentSidebar';
import CanvasArea from '@/components/organisms/CanvasArea';
import PropertiesPanel from '@/components/organisms/PropertiesPanel';
import TopToolbar from '@/components/organisms/TopToolbar';
import TemplateGallery from '@/components/organisms/TemplateGallery';
import ExportDialog from '@/components/organisms/ExportDialog';
import DeviceFrame from '@/components/molecules/DeviceFrame';
import ComponentService from '@/services/api/ComponentService';
import TemplateService from '@/services/api/TemplateService';
import ProjectService from '@/services/api/ProjectService';

const Studio = () => {
  // Data states
  const [components, setComponents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [availableComponents, setAvailableComponents] = useState([]);
  
  // UI states
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Project states
  const [projectName, setProjectName] = useState('Untitled Project');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [componentsData, templatesData] = await Promise.all([
        ComponentService.getAll(),
        TemplateService.getAll()
      ]);
      
      setAvailableComponents(componentsData);
      setTemplates(templatesData);
      
      // Initialize with empty project
      const initialState = { components: [], selectedComponent: null };
      setHistory([initialState]);
      setHistoryIndex(0);
      
    } catch (err) {
      setError('Failed to load studio data');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // History management
  const addToHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setComponents(prevState.components);
      setSelectedComponent(prevState.selectedComponent);
      setHistoryIndex(prevIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setComponents(nextState.components);
      setSelectedComponent(nextState.selectedComponent);
      setHistoryIndex(nextIndex);
    }
  };

  // Component management
  const handleDropComponent = (componentType, position) => {
    const newComponent = {
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: componentType.type,
      name: componentType.name,
      icon: componentType.icon,
      position,
      size: { width: 200, height: 100 },
      properties: {
        text: componentType.name,
        backgroundColor: '#1E293B',
        textColor: '#F1F5F9',
        borderRadius: 8,
        opacity: 100,
        fontSize: 'md',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    };
    
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent);
    
    addToHistory({ components: newComponents, selectedComponent: newComponent });
    toast.success(`${componentType.name} added to canvas`);
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleUpdateComponent = (componentId, updatedComponent) => {
    const newComponents = components.map(comp => 
      comp.id === componentId ? updatedComponent : comp
    );
    setComponents(newComponents);
    setSelectedComponent(updatedComponent);
    
    addToHistory({ components: newComponents, selectedComponent: updatedComponent });
  };

  const handleDeleteComponent = (componentId) => {
    const newComponents = components.filter(comp => comp.id !== componentId);
    setComponents(newComponents);
    setSelectedComponent(null);
    
    addToHistory({ components: newComponents, selectedComponent: null });
    toast.success('Component deleted');
  };

  // Template management
  const handleSelectTemplate = (template) => {
    if (template.components && template.components.length > 0) {
      setComponents(template.components);
      setSelectedComponent(null);
      addToHistory({ components: template.components, selectedComponent: null });
      toast.success(`${template.name} template loaded`);
    } else {
      // Blank template
      setComponents([]);
      setSelectedComponent(null);
      addToHistory({ components: [], selectedComponent: null });
      toast.success('Started with blank canvas');
    }
    setProjectName(template.name !== 'Blank Template' ? template.name : 'Untitled Project');
  };

  // Project actions
  const handleSave = async () => {
    try {
      const projectData = {
        name: projectName,
        components,
        globalStyles: {},
        lastModified: new Date().toISOString()
      };
      
      await ProjectService.create(projectData);
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Save error:', error);
    }
  };

  const handlePreview = (previewMode) => {
    setIsPreviewMode(previewMode);
    if (previewMode) {
      setSelectedComponent(null);
    }
  };

  const handleExport = (exportData) => {
    console.log('Exporting project:', exportData);
    // Export logic would go here
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Apper Studio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={loadInitialData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar
        projectName={projectName}
        onSave={handleSave}
        onPreview={handlePreview}
        onExport={() => setShowExportDialog(true)}
        onUndo={undo}
        onRedo={redo}
        onOpenTemplates={() => setShowTemplateGallery(true)}
        previewDevice={previewDevice}
        onDeviceChange={setPreviewDevice}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Sidebar */}
        {!isPreviewMode && (
          <ComponentSidebar
            components={availableComponents}
            onDragStart={() => {}}
            onDragEnd={() => {}}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isPreviewMode ? (
            <DeviceFrame device={previewDevice} className="flex-1 p-4">
              <div className="w-full h-full bg-white">
                {/* Preview content would render here */}
                <div className="p-8">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Preview Mode</h1>
                  <p className="text-gray-600">Your app preview will appear here.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        className="p-4 border rounded-lg shadow-sm"
                        style={{
                          backgroundColor: component.properties?.backgroundColor,
                          color: component.properties?.textColor,
                          borderRadius: `${component.properties?.borderRadius || 8}px`,
                          opacity: (component.properties?.opacity || 100) / 100
                        }}
                      >
                        {component.properties?.text || component.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DeviceFrame>
          ) : (
            <CanvasArea
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={handleSelectComponent}
              onDropComponent={handleDropComponent}
              onDeleteComponent={handleDeleteComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          )}
        </div>

        {/* Properties Panel */}
        {!isPreviewMode && (
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        )}
      </div>

      {/* Modals */}
      <TemplateGallery
        templates={templates}
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        projectName={projectName}
      />
    </div>
  );
};

export default Studio;