import mockComponents from '@/services/mockData/components.json';

const ComponentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockComponents];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const component = mockComponents.find(comp => comp.Id === parseInt(id));
    if (!component) {
      throw new Error('Component not found');
    }
    return { ...component };
  },

  async create(componentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newComponent = {
      ...componentData,
      Id: Math.max(...mockComponents.map(c => c.Id)) + 1
    };
    mockComponents.push(newComponent);
    return { ...newComponent };
  },

  async update(id, componentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = mockComponents.findIndex(comp => comp.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Component not found');
    }
    mockComponents[index] = { ...componentData, Id: parseInt(id) };
    return { ...mockComponents[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockComponents.findIndex(comp => comp.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Component not found');
    }
    mockComponents.splice(index, 1);
    return { success: true };
  }
};

export default ComponentService;