import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables
import './theme/variables.css';
*/

//Tailwind
import './theme/main.css'

//
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

customElements.define('jeep-sqlite', JeepSqlite);
console.log(`after customElements.define`);

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const platform = Capacitor.getPlatform();
    const sqlite = new SQLiteConnection(CapacitorSQLite)

    // ONLY WEB FUNCTIONALITY
    if (platform === "web") {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqliteEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined('jeep-sqlite');
      console.log(`after customElements.whenDefined`)

      // Initialize the Web store
      await sqlite.initWebStore();
      console.log(`after initWebStore`)
    }

    // example: database creation with standard SQLite statements 
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("db_vite", false)).result;
    let db = null;
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("db_vite", false);
    } else {
      db = await sqlite.createConnection("db_vite", false, "no-encryption", 1, false);
    }

    //manipulate database
    await db.open();
    console.log(`db: db_vite opened`);
    const queryCreateTable = `
        CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        value TEXT NOT NULL,
        expense_date TEXT NOT NULL,
        expense_due TEXT NOT NULL
        );
    `;
    const respCreateTable = await db.execute(queryCreateTable);
    console.log(`res: ${JSON.stringify(respCreateTable)}`);

    //add test record to db
    // Crie objetos Date para representar as datas
    //const expenseDate = new Date("2000-10-02T00:00:00Z");
    //const expenseDue = new Date("2000-10-02T00:00:00Z");

    //const respInsert = await db.query(
    //  `INSERT INTO expenses (id,name,value,expense_date,expense_due) values (?,?,?,?,?)`,
    //  [Date.now(), "NAME Test", "VALUE Test", expenseDate.toISOString(), expenseDue.toISOString()]
    //);
    //console.log(`res: ${JSON.stringify(respInsert)}`);

    //query db
    //const respSelect = await db.query(`SELECT * FROM expenses`);
    //console.log(`res: ${JSON.stringify(respSelect)}`);

    //drop table
    //const respDropTable = await db.execute(`DROP TABLE IF EXISTS expenses;`)
    //console.log(`res: ${JSON.stringify(respDropTable)}`);


    //
    await sqlite.closeConnection("db_vite", false);


    //ionic app initialization
    const app = createApp(App).use(IonicVue).use(router);
    router.isReady().then(() => {
      app.mount('#app');
    });
  } catch (e) {
    console.log(e)
  }
})

//ANDROID STUDIO