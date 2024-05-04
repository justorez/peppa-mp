<script setup lang="ts">
import { usePage, useInput, useCheck } from './hooks'
import { ref, computed, watchEffect } from 'vue'
import { ep } from '@/store'
import Colors from '@/utils/colors'
import NumberBox from '@/components/number-box.vue'

const { input, noInput } = useInput()
const { check: checkSentence } = useCheck()
const { epNum, title, sentence, page, nextPage, markPage } = usePage(ep)

watchEffect(() => {
    uni.setNavigationBarTitle({
        title: `第 ${epNum.value} 集 ${title.value}`
    })
})

const result = ref(false)
const showResult = ref(false)
const nextButtonText = computed(() => (page.isLast ? '下一集' : '继续'))

function check() {
    if (noInput.value) return
    if (showResult.value && !result.value) return restore()
    if (showResult.value && result.value) return next()

    result.value = checkSentence(input.value, sentence.value.EN)
    showResult.value = true
    markPage(result.value)
}
function restore() {
    input.value = ''
    result.value = false
    showResult.value = false
}
function next() {
    restore()
    if (page.isLast) {
        ep.value = epNum.value + 1
    } else {
        nextPage()
    }
}
</script>

<template>
    <view class="p-5">
        <view class="flex items-center gap-2">
            <progress
                class="flex-1 h-4"
                :percent="page.percent"
                :stroke-width="12"
                :border-radius="5"
                :active-color="Colors.success"
            ></progress>
            <text>{{ page.completed }}/{{ page.total }}</text>
        </view>
        <view class="flex justify-center items-center">
            <view class="flex-1">
                <view class="mt-5 mb-3 text-lg flex justify-between items-end">
                    <view class="flex items-center gap-2">
                        <text>“{{ sentence.CN }}”</text>
                    </view>
                </view>
                <view
                    v-show="showResult"
                    class="mb-3 text-lg flex items-center"
                    :class="{
                        'text-success': result,
                        'text-error': !result
                    }"
                >
                    <text>"{{ sentence.EN }}"</text>
                    &nbsp;
                    <uni-icons
                        v-show="result"
                        type="checkmarkempty"
                        :color="Colors.success"
                        size="24"
                    />
                    <uni-icons
                        v-show="!result"
                        type="closeempty"
                        :color="Colors.error"
                        size="24"
                    />
                </view>
                <textarea
                    v-model="input"
                    class="w-full h-[450rpx] p-3 text-lg border rounded-md bg-gray-50"
                    placeholder="请输入上述台词的英文"
                    confirm-type="done"
                    :confirm-hold="true"
                    :show-confirm-bar="false"
                    @confirm="check"
                ></textarea>
            </view>
        </view>
        <view class="mt-5 flex justify-between items-start">
            <view class="flex items-center">
                <number-box
                    v-model="page.current"
                    :min="1"
                    :max="page.total"
                />
                &nbsp;&nbsp;/&nbsp;
                <text>{{ page.total }}</text>
            </view>
            <button
                v-show="!showResult"
                class="btn"
                :disabled="noInput"
                @click="check"
            >
                检查
            </button>
            <view
                v-show="showResult"
                class="flex items-center"
            >
                <button
                    class="btn btn-outline mr-3"
                    @click="restore"
                >
                    重试
                </button>
                <button
                    class="btn"
                    :class="{
                        'btn-success': result,
                        'btn-error': !result
                    }"
                    @click="next"
                >
                    {{ nextButtonText }}
                </button>
            </view>
        </view>
    </view>
</template>

<style lang="scss"></style>
