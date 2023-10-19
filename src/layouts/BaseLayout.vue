<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonBackButton, IonTitle, IonButtons } from '@ionic/vue';

const props = defineProps(['namePage', 'pageDefaultBackLink'])
</script>

<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton :default-href="pageDefaultBackLink" color="light"></IonBackButton>
                </IonButtons>
                <IonTitle>{{ namePage }}</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <slot />
        </IonContent>
    </IonPage>
</template>