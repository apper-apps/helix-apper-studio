import mockProjects from '@/services/mockData/projects.json';

const ProjectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...mockProjects];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = mockProjects.find(proj => proj.Id === parseInt(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 450));
    const newProject = {
      ...projectData,
      Id: Math.max(...mockProjects.map(p => p.Id)) + 1
    };
    mockProjects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockProjects.findIndex(proj => proj.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    mockProjects[index] = { ...projectData, Id: parseInt(id) };
    return { ...mockProjects[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProjects.findIndex(proj => proj.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    mockProjects.splice(index, 1);
    return { success: true };
  }
};

export default ProjectService;