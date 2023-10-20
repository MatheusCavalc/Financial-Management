<script setup lang="ts">
import { IonContent, IonPage, onIonViewDidEnter, onIonViewWillLeave } from '@ionic/vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ChartHome from '@/components/ChartHome.vue';
import LastExpenses from '@/components/LastExpenses.vue';
import { databaseQuery } from "@/store/index";
import { ref } from 'vue';

const queries = databaseQuery();

const valuesMonth = ref<any>('');
const listExpenses = ref<any>('');

onIonViewDidEnter(async () => {
  await queries.enterView();
  valuesMonth.value = queries.valuesMonth;
  listExpenses.value = queries.lastExpenses;
  console.log(listExpenses.value, valuesMonth.value, queries.lastExpenses);

});

onIonViewWillLeave(async () => {
  valuesMonth.value = []
  listExpenses.value = []
  await queries.leaveView();
})

//REALOAD DATA ON FORM REDIRECT
</script>

<template>
  <IonPage>
    <IonContent>
      <MainLayout namePage="Home">

        <div v-if="valuesMonth && listExpenses">
          <div class="bg-emerald-600 p-6 text-white">
            <p class="text-2xl text-white font-semibold">${{ valuesMonth[valuesMonth.length - 1] }}</p>
          </div>

          <div v-if="valuesMonth">
            <ChartHome :values="valuesMonth" />
          </div>

          <div v-if="listExpenses">
            <LastExpenses :expensesList="listExpenses[0]" />
          </div>
        </div>

      </MainLayout>
    </IonContent>
  </IonPage>
</template>
