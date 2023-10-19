<script setup lang="ts">
import { IonContent, IonPage, onIonViewDidEnter, onIonViewWillLeave } from '@ionic/vue';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import MainLayout from '@/layouts/MainLayout.vue';
import ChartHome from '@/components/ChartHome.vue';
import { ref } from 'vue';

const expenses = ref<any>();
const db = ref<SQLiteDBConnection>();
const sqlite = ref<SQLiteConnection>();

const valuesMonth = ref<any>([]);

onIonViewDidEnter(async () => {
  sqlite.value = new SQLiteConnection(CapacitorSQLite)
  const ret = await sqlite.value.checkConnectionsConsistency();
  const isConn = (await sqlite.value.isConnection("db_vite", false)).result;
  if (ret.result && isConn) {
    db.value = await sqlite.value.retrieveConnection("db_vite", false);
  } else {
    db.value = await sqlite.value.createConnection("db_vite", false, "no-encryption", 1, false);
  }

  loadData();
});

onIonViewWillLeave(async () => {
  await sqlite.value?.closeConnection("db_vite", false);
  valuesMonth.value = [];
})

const loadData = async () => {
  try {
    await db.value?.open()
    const respSelect = await db.value?.query(`
      SELECT
        SUM(CASE WHEN strftime('%d', expense_date) <= '07' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_1,
        SUM(CASE WHEN strftime('%d', expense_date) <= '14' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_2,
        SUM(CASE WHEN strftime('%d', expense_date) <= '21' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_3,
        SUM(CASE WHEN strftime('%d', expense_date) <= '28' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_4
      FROM expenses
      WHERE strftime('%m', expense_date) = strftime('%m', 'now');
    `);
    //console.log(`res: ${JSON.stringify(respSelect)}`);
    expenses.value = respSelect?.values

    for (const key in expenses.value[0]) {
      if (key !== "rowid") {
        valuesMonth.value.push(expenses.value[0][key]);
      }
    }

    //console.log("Array de valores:", valuesMonth.value);

  } catch (error) {
    console.log(error)
  } finally {
    await db.value?.close()
  }
}
</script>

<template>
  <IonPage>
    <IonContent>
      <MainLayout namePage="Home">

        <div class="bg-emerald-600 p-6 text-white">
          <p class="text-2xl text-white font-semibold">${{ valuesMonth[valuesMonth.length - 1] }}</p>
        </div>

        <div>
          <ChartHome :values="valuesMonth" />
        </div>

      </MainLayout>
    </IonContent>
  </IonPage>
</template>
