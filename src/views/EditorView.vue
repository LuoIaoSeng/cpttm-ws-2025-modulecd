<script setup>
import { NumX, NumY } from '@/assets/config';
import MapEditor from '@/components/MapEditor.vue';
import { ref } from 'vue';



const maps = ref([
    {
        level: 'level1',
        data: [
            ...new Array(NumY).fill(new Array(NumX).fill(0))
        ]
    }
])

maps.value.forEach((obj) => {
    // console.log(obj.data)
    obj.data[NumY - 1] = [...Array(NumX).fill(1)]
})

const mapIndex = ref(0)

</script>

<template>

    <MapEditor :map="maps[mapIndex].data"></MapEditor>

</template>

<style scoped></style>
