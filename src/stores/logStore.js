import { writable } from "svelte/store";
import { browser } from '$app/env';
import { apiSendLogs } from "./../api/api";
import { get } from 'svelte/store';



// browser storage - logStore
let initLogData = [];
if(browser) {
    initLogData=JSON.parse(localStorage.getItem('log'));
    if(!initLogData) {
        initLogData=[];
    }
}
export let logStore = writable(initLogData);

logStore.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('log', JSON.stringify(value));
    }
});

logStore.addLog = (log) => {
    log.timestemp = new Date();
    logStore.update((value) => {
        value.push(log);
        return value;
    });
};


if(browser) {
    console.log('logStore.js creating interval loop! SHOULD CALLED ONLY once');
    setInterval(() => {
        sendLogsToServer();
    }, 1000 * 5 * 5);
}


function sendLogsToServer() {
    let logs = get(logStore);
    if(logs.length > 0) {
        console.log('logStore.js sending logs to server!', logs);
        apiSendLogs(logs).then(res => {
            console.log('logStore.js response from server', res);
            debugger;
            logStore.update((value) => {
                debugger;
                value.splice(0, res.rows.length);
                return value;
            });
        }).catch(err => {
            console.log('logStore.js error', err);
        });
    }
}