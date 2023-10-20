<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps(['expensesList'])
</script>

<template>
    <div class="relative h-screen">
        <div class="bg-emerald-600 h-6"></div>
        <div class="bg-emerald-100 h-full"></div>

        <div class="absolute -top-3 left-0 w-full">
            <div class="py-4 px-10 w-full">
                <div v-for="expense in expensesList" :key="expense.id"
                    class="bg-white flex justify-between py-2 px-5 rounded-lg mb-3 shadow-2xl">
                    <p class="text-emerald-600 font-semibold">{{ expense.name }}</p>
                    <p>${{ expense.value }}</p>
                </div>
            </div>
        </div>
    </div>
</template>