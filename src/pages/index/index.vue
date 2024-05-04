<script setup lang="ts">
import localStorage from '@/utils/localStorage'
import { ep } from '@/store'
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface Entrance {
    index: number
    percent: string
}
const entrances = ref<Entrance[]>([])

onShow(() => {
    entrances.value = new Array(52).fill(0).map((_, i) => {
        return {
            index: i + 1,
            percent: getProgress(i + 1)
        }
    })
})

function getProgress(i: number) {
    const str = localStorage.getItem(`completedList-${i}`)
    if (str) {
        const progressList = JSON.parse(str) as boolean[]
        const progress =
            (progressList.filter((x) => x).length / progressList.length) * 100
        return `${progress}%`
    } else {
        return '0'
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
            v-for="(item, i) in entrances"
            :key="i"
            class="w-full btn btn-outline"
            plain
            @click="go(item.index)"
        >
            <text>第 {{ String(item.index).padStart(2, '0') }} 集</text>
            <text :style="{ width: item.percent }"></text>
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
