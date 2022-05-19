<script context="module">

import { onMount } from "svelte";
import Modal from 'svelte-simple-modal';

  
  export let sizes;
  export let colors;
</script>
<script>
    import { colorsJsonStore, sizesJsonStore } from "@src/stores/stores";
import { fetch_wraper,get_album_details } from "@src/api/api";
import { MAIN_PAGE_API } from "@src/api/consts";
import { browser } from "$app/env";
    onMount(async()=> {
        let response = await fetch_wraper(MAIN_PAGE_API, {
      method: 'GET',
      redirect: 'follow'
    }, fetch)

    
    let json = await response
    let logos_json = json.logos
    let albums_json = json.albums
    albums_json = albums_json.filter(album => album.is_public)
    let colors_json = json.colors
    let sizes_json = json.sizes
    let sizes_ret = {};
    for (let i = 0; i < sizes_json.length; i++) {
      sizes_ret[sizes_json[i].id] = sizes_json[i];
    }

    let colors_ret = {};
    for (let i = 0; i < colors_json.length; i++) {
      colors_ret[colors_json[i].id] = colors_json[i];
    }
        console.log('onMount __layout.reset.svelte dashboard');
        console.log('colors: ', colors_ret)
        console.log('sizes: ', sizes_ret)
        sizesJsonStore.set(sizes_ret);
        colorsJsonStore.set(colors_ret);
    })

    let selectedTab = 2;
    function selectTab(tab) {
        console.log('clicked')
        selectedTab = tab;

    }
</script>
  <svelte:head>
    <!-- import 
    https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.13.0/pivot.min.js
    https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
      https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.13.0/pivot.min.css
      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
  -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.13.0/pivot.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.13.0/pivot.min.css">
  </svelte:head>

  <nav>
    <div class="nav-wrapper">
        <ul class="nav-mobile">
            <li data-tab-id="1" on:click={()=>{selectTab(1)}} class:active={selectedTab == 1}>
                <a href="/dashboard/inv" >
                מלאי
                </a>
            </li>
            <li data-tab-id="2" on:click={()=>{selectTab(2)}} class:active={selectedTab == 2}>
                <a href="/dashboard/doc-stock-enter" >
                טפסי הכנסה למלאי
                </a>
            </li>
            <li data-tab-id="3" on:click={()=>{selectTab(3)}} class:active={selectedTab == 3}>
                <a href="#" >
                טפסי הוצאה מהמלאי
                </a>
            </li>
        </ul>
    </div>
</nav>

<style lang="scss">
  nav {
      .nav-wrapper {
          .nav-mobile {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
              list-style: none;
              li {
                  background-color: #f5f5f5;
                  padding: 7px;
                  border-radius: 5px;
                  cursor: pointer;
                  &.active {
                      background-color: #ffc107;
                  }
              }
          }
      }
  }

</style>
<Modal>
<slot></slot>
</Modal>