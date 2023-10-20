import { defineStore } from 'pinia'
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ref } from 'vue';

export const databaseQuery = defineStore('queries', () => {
    const db = ref<SQLiteDBConnection>();
    const sqlite = ref<SQLiteConnection>();

    const expenses = ref<any>()
    const valuesMonth = ref<any>([]);
    const expensesList = ref<any>()
    const lastExpenses = ref<any>([])

    async function enterView() {
        sqlite.value = new SQLiteConnection(CapacitorSQLite)
        const ret = await sqlite.value.checkConnectionsConsistency();
        const isConn = (await sqlite.value.isConnection("db_vite", false)).result;
        if (ret.result && isConn) {
            db.value = await sqlite.value.retrieveConnection("db_vite", false);
        } else {
            db.value = await sqlite.value.createConnection("db_vite", false, "no-encryption", 1, false);
        }

        loadDataChartHome()
    }

    async function loadDataChartHome() {
        try {
            await db.value?.open()
            const respListExpenses = await db.value?.query(`
                SELECT * FROM expenses
            `);

            expensesList.value = respListExpenses?.values

            for (const key in expensesList.value) {
                if (key !== "rowid") {
                    lastExpenses.value.push(expensesList.value);
                }
            }
            
            console.log(respListExpenses?.values); //banco
            console.log(expensesList); //variavel
            console.log(lastExpenses); //funcionando
            
            
            //lastExpenses.value = respListExpenses?.values

            const respChartHome = await db.value?.query(`
                SELECT
                    SUM(CASE WHEN strftime('%d', expense_date) <= '07' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_1,
                    SUM(CASE WHEN strftime('%d', expense_date) <= '14' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_2,
                    SUM(CASE WHEN strftime('%d', expense_date) <= '21' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_3,
                    SUM(CASE WHEN strftime('%d', expense_date) <= '28' THEN CAST(REPLACE(value, ',', '.') AS DECIMAL(10, 2)) ELSE 0 END) AS interval_4
                FROM 
                    expenses
                WHERE 
                    strftime('%m', expense_date) = strftime('%m', 'now');
            `);
            //console.log(`res: ${JSON.stringify(respChartHome)}`);
            expenses.value = respChartHome?.values

            for (const key in expenses.value[0]) {
                if (key !== "rowid") {
                    valuesMonth.value.push(expenses.value[0][key]);
                }
            }

        } catch (error) {
            console.log(error)
        } finally {
            await db.value?.close()
        }
    }

    async function leaveView() {
        await sqlite.value?.closeConnection("db_vite", false);
        valuesMonth.value = [];
        lastExpenses.value = [];
    }

    return {
        valuesMonth,
        lastExpenses,
        expensesList,
        enterView,
        leaveView,
    }
})