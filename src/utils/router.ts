export default {
    back() {
        return uni.navigateBack()
    },
    push(url: string) {
        return uni.navigateTo({
            url
        })
    },
    replace(url: string) {
        return uni.redirectTo({ url })
    }
}
