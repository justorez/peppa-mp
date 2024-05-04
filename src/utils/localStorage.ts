export default {
    setItem(key: string, value: string) {
        uni.setStorageSync(key, value)
    },
    getItem(key: string) {
        return uni.getStorageSync(key)
    }
}
