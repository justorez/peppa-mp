<script setup lang="ts">
import localStorage from '@/utils/localStorage'
import { ep } from '@/store'

function getProgress(i: number) {
    const str = localStorage.getItem(`completedList-${i}`)
    if (str) {
        const progressList = JSON.parse(str) as boolean[]
        const progress =
            (progressList.filter((x) => x).length / progressList.length) * 100
        return `${progress}%`
    } else {
        return 0
    }
}

async function go(i: number) {
    await uni.navigateTo({
        url: '/pages/episode/index'
    })
    ep.value = i
}
</script>

<template>
    <view class="entrance-list">
        <button
            v-for="i in 52"
            :key="i"
            class="w-full btn btn-outline"
            plain
            @click="go(i)"
        >
            <text>第 {{ String(i).padStart(2, '0') }} 集</text>
            <text :style="{ width: getProgress(i) }"></text>
        </button>
    </view>
</template>

<style lang="scss">
.entrance-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding: 20rpx;

    .btn {
        position: relative;
        overflow: hidden;
    }
    .btn text:first-child {
        position: relative;
        z-index: 5;
    }
    .btn text:last-child {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: #00a96e;
    }
}
</style>
