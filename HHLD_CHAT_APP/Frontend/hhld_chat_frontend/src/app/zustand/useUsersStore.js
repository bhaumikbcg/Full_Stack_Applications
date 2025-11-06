import {create} from 'zustand';

export const useUsersStore = create((set) => ({
    users: [],
    updateUsers: (users) => set({users: users}),//'set' fn given in zustand to update the values
}));