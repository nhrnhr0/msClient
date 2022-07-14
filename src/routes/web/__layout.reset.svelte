<script context="module">

import { browser } from "$app/env";
import Navbar from "src/lib/Navbar.svelte";
import { session_get_all_colors, session_get_all_sizes, session_get_all_varients, } from "src/stores/sessionStorageApi";
import { onMount } from "svelte";

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
<!--
<svelte:head>
    <script>
        function googleTranslateElementInit() {
            let translate_element = new google.translate.TranslateElement({pageLanguage: 'he'}, 'google_translate_element');
            console.log('translate_element', translate_element);
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</svelte:head>-->

<Navbar></Navbar>

<div id="main_wraper" class="bg-wraper">
    <!--<div id="google_translate_element"></div>-->

<slot></slot>
</div>

<style lang="scss">
    #main_wraper {
        //border: 1px solid red;;
    }
</style>