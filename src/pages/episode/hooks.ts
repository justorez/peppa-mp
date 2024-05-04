import EpisodeData from '@/assets/data.json'
import { ref, computed, watch, reactive } from 'vue'
import type { Ref } from 'vue'
import localStorage from '@/utils/localStorage'

export function usePage(ep: Ref<number>) {
    const epNum = computed(() =>
        Math.min(Math.max(1, ep.value), EpisodeData.length)
    )
    const episode = computed(() => EpisodeData[epNum.value - 1])
    const total = computed(() => episode.value.sentences.length)
    const title = computed(() => episode.value.titleCN)

    // progress
    // reactive path: ep -> progresslist -> localStorage
    // the above feature cannot be implemented with @vueuse,
    const progressKey = computed(() => `completedList-${epNum.value}`)
    const loadProgress = (): number[] => {
        const dataStr = localStorage.getItem(progressKey.value)
        let data = !dataStr
            ? new Array(total.value).fill(0)
            : JSON.parse(dataStr)
        data = data.map((d: number | boolean) => Number(d))
        if (/true|false/.test(dataStr || '')) {
            localStorage.setItem(progressKey.value, JSON.stringify(data))
        }
        return data
    }
    const progressList = ref(loadProgress())
    watch(ep, () => {
        progressList.value = loadProgress()
    })
    watch(
        progressList,
        (val) => {
            localStorage.setItem(progressKey.value, JSON.stringify(val))
        },
        { deep: true }
    )

    // start index
    const getStartIndex = () => {
        const index = progressList.value.findIndex((x) => !x)
        return index !== -1 ? index : total.value - 1
    }
    const index = ref(getStartIndex())
    watch(progressList, () => {
        index.value = getStartIndex()
    })

    const current = computed({
        get: () => index.value + 1,
        set: (val) => nextPage(val - 1)
    })
    const completed = computed(() => progressList.value.filter((x) => x).length)
    const page = reactive({
        index, // min value 0
        current, // min value 1
        total,
        completed,
        percent: computed(() => (completed.value / total.value) * 100),
        isLast: computed(() => current.value === total.value)
    })

    function nextPage(n?: number) {
        n = typeof n === 'number' ? Math.max(0, n) : page.index + 1
        page.index = Math.min(n, page.total - 1)
    }

    /**
     * mark current sentence as complete or not
     */
    function markPage(status: boolean | number) {
        progressList.value[page.index] = Number(status)
    }

    const sentence = computed(() => episode.value.sentences[page.index])

    return {
        epNum,
        title,
        page,
        sentence,
        nextPage,
        markPage
    }
}

export function useInput() {
    const input = ref('')
    watch(input, () => {
        input.value = input.value.replace(/\n/g, '')
    })
    const noInput = computed(() => !input.value)
    return { input, noInput }
}

export function useCheck() {
    function eq(value: string, other: string) {
        value = value
            .replace(/[.,?!]/g, ' ')
            .split(/\s+/)
            .join('')
        other = other
            .replace(/[.,?!]/g, ' ')
            .split(/\s+/)
            .join('')
        return value.toLowerCase() === other.toLowerCase()
    }

    const yesAudio = uni.createInnerAudioContext()
    const noAudio = uni.createInnerAudioContext()
    yesAudio.src = '/static/audio/yes.mp3'
    noAudio.src = '/static/audio/no.mp3'
    function check(input: string, answer: string, tone = true) {
        const result = eq(input, answer)
        if (tone && result) {
            yesAudio.play()
        } else if (tone && !result) {
            noAudio.play()
        }
        return result
    }

    return {
        eq,
        check
    }
}

export function useSpeech() {
    // 小程序没有 TTS 接口
    return { isSupported: false, speak: (text: string) => text }
}
