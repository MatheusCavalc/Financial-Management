<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import MainLayout from '@/layouts/MainLayout.vue';
</script>

<template>
  <IonPage>
    <IonContent>
      <MainLayout namePage="Home">
        <h1>Oi</h1>
      </MainLayout>
    </IonContent>
  </IonPage>
</template>
