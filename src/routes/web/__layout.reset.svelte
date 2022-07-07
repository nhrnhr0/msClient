<script context="module">

import { browser } from "$app/env";
import Navbar from "src/lib/Navbar.svelte";
import { session_get_all_colors, session_get_all_sizes, session_get_all_varients, session_get_main_categories } from "src/stores/sessionStorageApi";

// on load:
// get all sizes, colors, and varients on the server and pass them to the page to be stored in a store.
// if the data was requested from the store before the store was initialized, request the new data from the server.
// also get the top level categories and pass them to the page.
// if the data was requested from the store before the store was initialized, request the new data from the server.
    export async function load({ fetch, page, session, contex}) {
        if(browser) {
            session_get_all_colors();
            session_get_all_sizes();
            session_get_all_varients();
        }

        return {
            props: {
            }
        };
    }
</script>
<script>
</script>



<Navbar></Navbar>

<div id="main_wraper" class="bg-wraper">
<slot></slot>
</div>

<style lang="scss">
    
</style>