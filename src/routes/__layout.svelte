<script context="module">
    //import { writable } from "svelte/store";
  
    //import { stateQuery} from './../stores/stores'
    //import { onMount } from "svelte";
    import { clear_all_db_data, clear_all_session_data } from "src/db.js";
    
  </script>

  <script>
    
    import "src/app.scss";
    import Navbar from "$lib/Navbar.svelte";
import { onDestroy, onMount } from "svelte";
import LoginPopup from "src/lib/popups/LoginPopup.svelte";
import CartPopup from "src/lib/popups/cartPopup.svelte";
import SuccessPopup from "src/lib/popups/successPopup.svelte";
import { cartPopupStore } from 'src/stores/popups/cartPopupStore';
import { page } from '$app/stores';
import { browser } from "$app/env";
    onMount(async()=>{
      // clear all dbs on startup.
      console.log('+++++++ WARNING: clearing all db data on startup. +++++++ ');
      await clear_all_db_data();
      await clear_all_session_data();
    })

    function calcAppHeight() {
        if(window) {
            const doc = document.documentElement;
            doc.style.setProperty('--vh', (window.innerHeight*.01) + 'px');
        }
    }

    onMount(() => {
        if(browser) {
            calcAppHeight();
            window.addEventListener('resize', calcAppHeight);
        }
    });
    onDestroy(() => {
        if(browser) {
            window.removeEventListener('resize', calcAppHeight);
        }
    });
    
    $: {
      if(browser && $page.path == '/main' || $page.path == '/main/') {
        window.document.documentElement.classList.add('const-size-page');
      }else if(browser){
        window.document.documentElement.classList.remove('const-size-page');
      }
    }
    /*
    $: {
      if (browser){
        if (full_size_page) {
          document.documentElement.style= 'height:100vh;height:fill-available;height:-webkit-fill-available;';
          document.body.style ='min-height:100vh;min-height:fill-available;min-height:-webkit-fill-available;';
        } else {
          document.documentElement.style = 'height: auto;';
          document.body.style = 'min-height: auto;';
        }
      }
    }*/
  </script>
  
  <svelte:head>
    <meta name="theme-color" content="#FFD700" />
  </svelte:head>
  <Navbar />
  
  <LoginPopup />
  <CartPopup />
  <SuccessPopup  />
  
  <div id="main_wraper" class="bg-wraper" class:make-small={$cartPopupStore.isSideOpen && !$cartPopupStore.sideFloating}>
      <slot />
  </div>
  <style lang="scss">
    :global(html.const-size-page) {
      // height: 100vh;
      // height: fill-available;
      height: -webkit-fill-available;
      height: -moz-available;
      :global(body) {
        height: 100vh;
        height: -webkit-fill-available;
        height: -moz-available;
        height: fill-available;
        overflow: hidden;
      }
    }
    #main_wraper {
      /*height: auto;
      &.const-page-size {
        height: 100vh;
        max-height: fill-available;
        max-height: -webkit-fill-available;
      }*/
      height: 100%;
      &.make-small {
        width: calc(100vw - 315px);
        position: absolute;
        left: 0px;
      }
    }
    
  </style>
  