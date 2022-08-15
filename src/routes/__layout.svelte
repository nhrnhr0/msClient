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
import CartPopup from "src/lib/popups/cartPopup.svelte";
import SuccessPopup from "src/lib/popups/successPopup.svelte";
import { cartPopupStore } from 'src/stores/popups/cartPopupStore';
import { page } from '$app/stores';
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
  <CartPopup />
  <SuccessPopup  />
  
  <div id="main_wraper" class="bg-wraper" class:const-page-size={$page.path == '/main'} class:make-small={$cartPopupStore.isSideOpen && !$cartPopupStore.sideFloating}>
    
      <slot />
  </div>
  <style lang="scss">
    #main_wraper {
      height: auto;
      &.const-page-size {
        height: 100vh;
        max-height: fill-available;
        max-height: -webkit-fill-available;
      }
      &.make-small {
        width: calc(100vw - 315px);
        position: absolute;
        left: 0px;
      }
    }
    
  </style>
  