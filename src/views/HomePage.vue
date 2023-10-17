<script setup lang="ts">
import { IonContent, IonPage, onIonViewDidEnter, onIonViewWillLeave } from '@ionic/vue';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import MainLayout from '@/layouts/MainLayout.vue';
import { ref } from 'vue';

const expenses = ref<any>();
const db = ref<SQLiteDBConnection>();
const sqlite = ref<SQLiteConnection>();

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
})

const loadData = async () => {
  try {
    await db.value?.open()
    const respSelect = await db.value?.query(`SELECT * FROM expenses`);
    console.log(`res: ${JSON.stringify(respSelect)}`);
    expenses.value = respSelect?.values
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
        <div v-for="expense in expenses" :key="expense?.id" class="flex justify-between rounded-lg border mb-2 p-4">
          <p>{{ expense.name }}</p>
          <p>{{ expense.value }}</p>
        </div>
      </MainLayout>
    </IonContent>
  </IonPage>
</template>
