<script context="module">
    //import { writable } from "svelte/store";
  
    //import { stateQuery} from './../stores/stores'
    //import { onMount } from "svelte";
    import { clear_all_db_data, clear_all_session_data } from "src/db.js";
    
  </script>

  <script>
    
    import "src/app.scss";
    import Navbar from "$lib/Navbar.svelte";
import { onMount } from "svelte";
import LoginPopup from "src/lib/popups/LoginPopup.svelte";
    onMount(async()=>{
      // clear all dbs on startup.
      console.log('+++++++ WARNING: clearing all db data on startup. +++++++ ');
      await clear_all_db_data();
      await clear_all_session_data();

    })
  </script>
  
  <svelte:head>
    <meta name="theme-color" content="#FFD700" />
  </svelte:head>
  <Navbar />

  <LoginPopup />
  
  <div id="main_wraper" class="bg-wraper">
    <slot />
  </div>
  
  <style lang="scss">
    

  </style>
  