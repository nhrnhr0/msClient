<script context="module">
    import { userInfoStore } from '.../../stores/stores';
    
</script>
<script>
    import { onMount } from "svelte"
    import { adming_get_campains } from '.../../api/api';
import { browser } from '$app/env';
    let campains_promise = adming_get_campains();
    // redirect user to the main page if they are not superusers
    userInfoStore.subscribe((state) => {
        if(browser) {
            console.log(state);
            if(state.isLogin == false) {
                window.location.replace("/"); 
            }else if(state.me.is_superuser == false) {
                window.location.replace("/"); 
            }else {

            }
        }
    });
</script>
<!-- only show content if the user is useruser -->
{#if $userInfoStore.isLogin && $userInfoStore.me.is_superuser}
<main>
    <h1 class="title">dashboard</h1>
    <!--
        table of the campains with the following columns:
        - is the campain active
        - name of the campain
        - number of users in the campain
        - number of products in the campain
        - start date
        - end date
        - open for more details button
    -->
    <table class="campain-table">
        <thead>
            <tr>
                <th>פעיל</th>
                <th>שם</th>
                <th>משתמשים</th>
                <th>מוצרים</th>
                <th>תאריך התחלה</th>
                <th>תאריך סיום</th>
                <th>פרטים נוספים</th>
            </tr>
        </thead>
        <tbody>
            {#await campains_promise}
                loading...
            {:then campains} 
                {#each campains as campain}
                <tr>
                    <td>{#if campain.is_active}<i class="fas fa-check"></i>{/if}</td>
                    <td>{campain.name}</td>
                    <td>{campain.users_count}</td>
                    <td>{campain.products_count}</td>
                    <td>{campain.start_date}</td>
                    <td>{campain.end_date}</td>
                    <td><a href="/admin/campain/{campain.id}">details</a></td>
                </tr>
                {/each}
            {/await}
        </tbody>
    </table>
</main>
{/if}

<style lang="scss">

    .title {
        font-size: 2em;
        text-align: center;
        margin-bottom: 1em;
    }
    .campain-table {
        width: 100%;
        border-collapse: collapse;
        // adding border the the table head and make the table body prettier
        th {
            border-bottom: 1px solid black;
            border-left: 1px solid black;
            border-right: 1px solid black;
        }

    }
</style>