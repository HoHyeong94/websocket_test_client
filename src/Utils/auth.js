export const userInfo = getUserInfo();

export function getUserInfo() {
    return {
        type: "test",
        username: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
    }
}