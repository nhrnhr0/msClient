<script context="module">
    //import { writable } from "svelte/store";
  
    //import { stateQuery} from './../stores/stores'
    //import { onMount } from "svelte";
    //import { clear_all_db_data } from "src/db.js";
    
  </script>

  <script>
    
    import "src/app.scss";
    import Navbar from "$lib/Navbar.svelte";
    /*onMount(async()=>{
      // clear all dbs on startup.
      debugger;
      await clear_all_db_data();

    })*/
  </script>
  
  <svelte:head>
    <meta name="theme-color" content="#FFD700" />
  </svelte:head>
  <Navbar />
  
  <div id="main_wraper" class="bg-wraper">
    <slot />
  </div>
  
  <style lang="scss">
    #main_wraper {
      height: 100vh;
    }

  </style>
  