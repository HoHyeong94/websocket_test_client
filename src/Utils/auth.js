import create from "zustand"

export const userInfoStore = create(set => ({
    username: null,
    userID: null,
    setUsername: (name) => set({ username: name }),
    setUserID: (id) => set({userID: id})
}))

export function getUsername() {
    return userInfoStore.getState().username;
}

export function getUserID() {
    return userInfoStore.getState().userID;
}