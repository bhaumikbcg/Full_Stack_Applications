import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  authName: '',
  updateAuthname: (name) => set({ authName : name }),//'set' fn given in zustand to update the values
}));