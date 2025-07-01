import mockTemplates from '@/services/mockData/templates.json';

const TemplateService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockTemplates];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const template = mockTemplates.find(temp => temp.Id === parseInt(id));
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  },

  async create(templateData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTemplate = {
      ...templateData,
      Id: Math.max(...mockTemplates.map(t => t.Id)) + 1
    };
    mockTemplates.push(newTemplate);
    return { ...newTemplate };
  },

  async update(id, templateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockTemplates.findIndex(temp => temp.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }
    mockTemplates[index] = { ...templateData, Id: parseInt(id) };
    return { ...mockTemplates[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = mockTemplates.findIndex(temp => temp.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }
    mockTemplates.splice(index, 1);
    return { success: true };
  }
};

export default TemplateService;