<script>
    import {
        onDestroy,
        onMount
    } from "svelte";


    export let date;
    export let mainTextClr = "white";
    export let borderClr = '#d4af37';
    let remining_time;
    let is_running = false;
    onMount(() => {
        debugger;

        update_timer()
        is_running = true;
        //window.requestAnimationFrame(update_timer);
        update_timer();
    });
    onDestroy((() => {
        is_running = false;
    }));

    dateDiff.structure = {
        day: 86400 * 1000, // feel free to add your own row
        hour: 3600 * 1000,
        minute: 60 * 1000,
        second: 1 * 1000,
        milisecond: 1
    };

    function dateDiff(timestamp, structure = dateDiff.structure) {
        let delta = timestamp - new Date().getTime();
        if(delta < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                miliseconds: 0
            };
        }
        let res = {};

        for (let key in structure) {
            res[key] = Math.floor(delta / structure[key]);
            delta -= res[key] * structure[key];
        }

        return res;
    }

    function update_timer() {
        remining_time = dateDiff(new Date(date));
        if (is_running) {
            //window.requestAnimationFrame(update_timer);
            setTimeout(update_timer, 1000);
        }
    }


    
</script>
<!--
    timer that counts down from the current date to the date of the event
    update every second
    efficient
-->
{#if remining_time}
<div class="timer-container" style="--main-clr-text: {mainTextClr};--border-clr: {borderClr};">
    <div class="timer">
        <div class="timer-item secs">
            <span class="num">{remining_time.second}
                </span>
            <span class="label">שניות</span>
        </div>
        <div class="timer-item mins">
            <span class="num">{remining_time.minute}</span>
            <span class="label">דקות</span>
        </div>
        <div class="timer-item hours">
            <span class="num">{remining_time.hour}</span>
            <span class="label">שעות</span>
        </div>
        <div class="timer-item days">
            <span class="num">{remining_time.day}</span>
            <span class="label">ימים</span>
        </div>
    </div>
</div>
{/if}
<style lang="scss">
    .timer-container {
        
        .timer {

            display: flex;
            //max-width: 60%;
            
            margin: auto;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-top: 3px solid var(--border-clr);
            border-bottom: 3px solid var(--border-clr);
            
            
            
            width: fit-content;
            
            // change to 2 by 2 grid for mobile
            @media screen and (max-width: 500px) {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                //reverse the order of the grid
                grid-template-areas: "days hours" "mins secs";
            }

            .timer-item {
                &.days {
                    grid-area: days;
                }
                &.hours {
                    grid-area: hours;
                }
                &.mins {
                    grid-area: mins;
                }
                &.secs {
                    grid-area: secs;
                }

                flex: 1;
                min-width: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                

                .num {
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--main-clr-text);
                    .hide-500{
                        display: inline;
                        @media screen and (max-width: 500px) {
                            display: none;
                        }
                    }
                    
                }

                .label {
                    font-size: 1rem;
                    font-weight: bold;
                    color: var(--main-clr-text);
                }

                &:last-child {
                    border-top-left-radius: 25px;
                    border-bottom-left-radius: 25px;
                }

                &:first-child {
                    border-top-right-radius: 25px;
                    border-bottom-right-radius: 25px;
                }
                @media screen and (max-width: 500px) {
                    min-width: 80px;
                    
                    .num {
                        font-size: 1.5rem;
                    }
                    .label {
                        font-size: 0.7rem;
                    }
                    
                }
            }
        }
    }
</style>