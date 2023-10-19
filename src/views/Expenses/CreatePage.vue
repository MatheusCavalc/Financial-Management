<script setup lang="ts">
import { IonContent, IonPage, onIonViewDidEnter, useIonRouter } from '@ionic/vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ref } from 'vue'
import { IonDatetime, IonButtons, IonButton } from '@ionic/vue';

const db = ref<SQLiteDBConnection>();
const sqlite = ref<SQLiteConnection>();

const router = useIonRouter();

let name = ref<string>('')
let value = ref<string>('')
let expense_date = ref<string>('')
let expense_due_date = ref<string>('')

let openDatePickerExpenseDate = ref<boolean>(false)
let openDatePickerExpenseDue = ref<boolean>(false)

onIonViewDidEnter(async () => {
    sqlite.value = new SQLiteConnection(CapacitorSQLite)
    const ret = await sqlite.value.checkConnectionsConsistency();
    const isConn = (await sqlite.value.isConnection("db_vite", false)).result;
    if (ret.result && isConn) {
        db.value = await sqlite.value.retrieveConnection("db_vite", false);
    } else {
        db.value = await sqlite.value.createConnection("db_vite", false, "no-encryption", 1, false);
    }
});

const createExpense = async () => {
    try {
        await db.value?.open()
        await db.value?.query(
            `INSERT INTO expenses (id,name,value,expense_date,expense_due) values (?,?,?,?,?);`,
            [Date.now(), name.value, value.value, expense_date.value, expense_due_date.value]
        );
    } catch (error) {
        console.log((error as Error).message);
    } finally {
        await db.value?.close()
        name.value = value.value = expense_date.value = expense_due_date.value = ''
        openDatePickerExpenseDate.value = openDatePickerExpenseDue.value = false
        router.push('/');
    }
};
</script>

<template>
    <IonPage>
        <IonContent>
            <MainLayout namePage="New Expense">
                <main class="p-4">
                    <div class="mt-4">
                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" name="name" id="name" v-model="name"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="name"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                        </div>

                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" name="value" id="value" v-model="value"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="value"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Value</label>
                        </div>

                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" name="expense_date" id="expense_date" v-model="expense_date"
                                @click="openDatePickerExpenseDate = true"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="expense_date"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Value</label>
                            <div class="mt-4" v-if="openDatePickerExpenseDate">
                                <IonDatetime v-model="expense_date">
                                </IonDatetime>
                            </div>
                        </div>

                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" name="expense_due_date" id="expense_due_date" v-model="expense_due_date"
                                @click="openDatePickerExpenseDue = true"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="expense_due_date"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Value</label>
                            <div class="mt-4" v-if="openDatePickerExpenseDue">
                                <IonDatetime v-model="expense_due_date">
                                </IonDatetime>
                            </div>
                        </div>
                        <!--
                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" onfocus="(this.type='date')" onblur="(this.type='text')" name="expense_date"
                                id="expense_date" v-model="expense_date"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="expense_date"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date</label>
                        </div>
                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" onfocus="(this.type='date')" onblur="(this.type='text')"
                                name="expense_due_date" id="expense_due_date" v-model="expense_due_date"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                                placeholder=" " required />
                            <label for="expense_due_date"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Due
                                Date</label>
                        </div>
                        -->
                        <button @click="createExpense"
                            class="text-white bg-emerald-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                    </div>
                </main>
            </MainLayout>
        </IonContent>
    </IonPage>
</template>