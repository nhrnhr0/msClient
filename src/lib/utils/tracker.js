import { fetch_wraper } from "src/api/api";
import { get } from "svelte/store";


let trackerInit = [];
if(browser) {
    trackerInit=JSON.parse(localStorage.getItem('log'));
    if(!trackerInit) {
        trackerInit=[];
    }
}
export let logger = writable(initUserData);

logger.appendEvent = (event) => {
    logger.update(log => [...log, event]);
}

logger.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('log', JSON.stringify(value));
    }
});

if(browser) {
    setInterval(() => {
        let data = get(logger);
        if (data.length > 0) {
            console.log('send log to server:', data);
            let response = fetch_wraper(`/api/log`, {method: 'POST', body: JSON.stringify(data)});
            response.then(() => {
                //console.log('log send');
                logger.set(initUserData);
            });
        }
    }, 1000);
}
