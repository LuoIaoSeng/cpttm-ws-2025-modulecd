<script setup>
import MapEditor from '@/components/MapEditor.vue';
import { ref } from 'vue';



const maps = ref([
    {
        level: 'level1',
        data: [
            ...new Array(20).fill(new Array(40).fill(0))
        ]
    }
])

const mapIndex = ref(0)

</script>

<template>

    <MapEditor :map="maps[mapIndex].data"></MapEditor>

</template>

<style scoped></style>
