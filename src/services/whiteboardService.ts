import api from './api';

// Types for Excalidraw data
export interface ExcalidrawData {
  elements: any[];
  appState: any;
  files?: any;
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Service for whiteboard/diagram operations
export const WhiteboardService = {
  // Get all saved diagrams
  getAllDiagrams: async () => {
    try {
      const response = await api.get('/whiteboards');
      return response.data;
    } catch (error) {
      console.error('Error fetching diagrams:', error);
      throw error;
    }
  },

  // Get a specific diagram by ID
  getDiagram: async (id: string) => {
    try {
      const response = await api.get(`/whiteboards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching diagram ${id}:`, error);
      throw error;
    }
  },

  // Save a new diagram
  saveDiagram: async (data: ExcalidrawData) => {
    try {
      const response = await api.post('/whiteboards', data);
      return response.data;
    } catch (error) {
      console.error('Error saving diagram:', error);
      throw error;
    }
  },

  // Update an existing diagram
  updateDiagram: async (id: string, data: ExcalidrawData) => {
    try {
      const response = await api.put(`/whiteboards/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating diagram ${id}:`, error);
      throw error;
    }
  },

  // Delete a diagram
  deleteDiagram: async (id: string) => {
    try {
      const response = await api.delete(`/whiteboards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting diagram ${id}:`, error);
      throw error;
    }
  },

  // Save diagram locally (as fallback when API is not available)
  saveLocal: (data: ExcalidrawData, name: string = 'excalidraw-diagram') => {
    try {
      localStorage.setItem(`excalidraw-${name}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving diagram locally:', error);
      return false;
    }
  },

  // Load diagram from local storage
  loadLocal: (name: string = 'excalidraw-diagram') => {
    try {
      const data = localStorage.getItem(`excalidraw-${name}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading diagram from local storage:', error);
      return null;
    }
  }
};

export default WhiteboardService; 