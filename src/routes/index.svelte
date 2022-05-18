<script context="module">
  import Header from "$lib/header.svelte"
  import About from "$lib/about.svelte"
  import CartDisclaimer from "$lib/cart-disclaimer.svelte"
  import LogoSwiper from "$lib/swipers/logoSwiper.svelte"
  import {
    all_swipers,
    userDetailModalStore,
    albumsJsonStore,
    cartModalStore,
    successModalStore,
    productModalStore,
    categoryModalStore,
    productImageModalStore,
    loginModalStore,
    sizesJsonStore,
    colorsJsonStore,
    userInfoStore,

  } from './../stores/stores'
  import {
    ALBUMS_API_URL,
    SIZES_API_URL,
    COLORS_API_URL,
    LOGOS_API_URL,
    MAIN_PAGE_API
  } from './../api/consts';

  import {
    api_get_user_campains, fetch_wraper
  } from './../api/api'
  import {
    browser
  } from '$app/env';
  import {
    getCookie
  } from '$lib/utils/cookies';
  import {
    activeModalsStore
  } from "$lib/modals/modalManager";
  export async function load({
    fetch,
    page
  }) {
    let params = page.params;
    console.log('load: ', params);
    /*
    console.log('getting: ', ALBUMS_API_URL);
    let albums_response = await fetch(ALBUMS_API_URL, { method: 'GET', redirect: 'follow'});
    let albums_json = await albums_response.json();
    albums_json = albums_json.filter(album => album.is_public)
    
    let logos_response = await fetch(LOGOS_API_URL, {method: 'GET', redirect: 'follow'})
    let logos_json = await logos_response.json();

    let sizes_response = await fetch(SIZES_API_URL, {method: 'GET', redirect: 'follow'})
    let sizes_json = await sizes_response.json();

    let colors_response = await fetch(COLORS_API_URL, {method: 'GET', redirect: 'follow'})
    let colors_json = await colors_response.json();
    let sizes_ret = {};

    for(let i = 0; i < sizes_json.length; i++) {
      sizes_ret[sizes_json[i].id] =  sizes_json[i];
    }

    let colors_ret = {};
    for(let i = 0; i < colors_json.length; i++) {
      colors_ret[colors_json[i].id] =  colors_json[i];
    }*/
    //MAIN_PAGE_API
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
    let products = {};
    //only on server
    if (!browser) {
      for (let i = 0; i < albums_json.length; i++) {
        let productResponse = await get_album_details(albums_json[i].id, fetch)

        products[albums_json[i].id] = productResponse;
      }
    }
    return {
      props: {
        colors: colors_ret,
        sizes: sizes_ret,
        albums: albums_json,
        logos: logos_json,
        all_products: products
      }
    };
  }

  const meta_data = {
    title: 'M.S. Global',
    description: `מתמחה באספקת מגוון רחב של מוצרים למוסדות ולחנויות ברחבי הארץ    ביגוד • הנעלה • הלבשה תחתונה • טקסטיל לבית • תיקים ופאוצ'ים • משק בית • חשמל לבית • כלי מטבח • משחקים וצעצועים • תחזוקה לבית • ספורט • גאדג'טים ועוד...`,
    keywords: `ביגוד • הנעלה • הלבשה תחתונה • טקסטיל לבית • תיקים ופאוצ'ים • משק בית • חשמל לבית • כלי מטבח • משחקים וצעצועים • תחזוקה לבית • ספורט • גאדג'טים ועוד...`,
    image: 'https://res.cloudinary.com/ms-global/image/upload/v1641224100/msAssets/favicon_hbwcui.jpg',
  }
</script>




<svelte:head>
  <title>{meta_data.title}</title>
  <link rel="icon" href="{meta_data.image}" />
  <meta name="title" content="{meta_data.title}">
  <meta name="description" content="{meta_data.description}">
  <meta name="keywords" content="{meta_data.keywords}" />


  <meta property="og:title" content="{meta_data.title}" />
  <meta property="og:description" content={meta_data.description} />
  <meta property="og:image" content={meta_data.image} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="M.S. Global" />
  <meta property="og:locale" content="IL" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="{meta_data.title}">
  <meta property="twitter:description" content="{meta_data.description}">
  <meta property="twitter:image" content="{meta_data.image}">
</svelte:head>
<svelte:window on:resize="{window_resize}" bind:scrollY={y_scroll} />
<Header />
{#if ($userInfoStore == undefined || $userInfoStore.isLogin == false)}
  <About />
{/if}
<LogoSwiper {logos} />
{#if ($userInfoStore == undefined || $userInfoStore.isLogin == false)}
  <CartDisclaimer />
{/if}
{#if $userInfoStore.isLogin == true && $userInfoStore.me && $userInfoStore.me.show_prices == true}
<div class="tax-text">
  המחירים באתר אינם כוללים מע"מ
</div>
{/if}
<!--
<FavoritesSidePopup />
-->

<!--
{#if $campainsStore}
  {#each $campainsStore as campain}
    <div class="title-wraper">
      <button class="title btn">
        {campain.name}
      </button>
    </div>

    <PricesSwiper data={campain}/>
  {/each}

  
{/if}
-->

{#each albums as album, i(album.id)}



	<CatalogSwiper album={album} bind:this={$all_swipers[album.id]} loaded_data={all_products[album.id]}/>

  {#if i == 5 && ($userInfoStore == undefined || $userInfoStore.isLogin == false)}
    <CallToActionForm/>
  {/if}

{/each}
{#if ($userInfoStore && $userInfoStore.isLogin == true)}
  <About />
{/if}
<ContentForm></ContentForm>
<BusinessOwnerPopup/>
<link rel="preload" as="image" href="https://img.icons8.com/external-becris-lineal-becris/48/000000/external-check-mintab-for-ios-becris-lineal-becris-1.png">

<script>

  import CatalogSwiper from '$lib/swipers/catalogSwiper.svelte';
  import { onMount } from "svelte";
import { get_album_details, request_csrf_token  } from "./../api/api";
import ContentForm from '$lib/contentForm.svelte';
import { bind } from 'svelte/internal';
import { stateQuery} from './../stores/queryStore'
import { logStore } from "../stores/logStore";
import { campainsStore } from '../stores/stores';

import {sl_disable, sl_enable} from "$lib/utils/scroll-lock";
import CallToActionForm from '$lib/components/CallToActionForm.svelte';
import BusinessOwnerPopup from "$lib/components/BusinessOwnerPopup.svelte";
import { flashy_page_view } from "$lib/flashy";
//import FavoritesSidePopup from '$lib/components/FavoritesSidePopup.svelte';
  
  export let colors;
  export let sizes;
  export let albums;
  export let logos;
  export let all_products;
  let y_scroll;
  //let campains;

  
  //export let onLoadCategory;
  //export let onLoadProduct;
  
  onMount(async()=> {

    flashy_page_view();
    window.onpopstate = function(event) {
      var pathArray = window.location.pathname.split('/');
      let vals = {}
      for(let i = 1; i < pathArray.length; i+=2) {
        vals[pathArray[i]] = pathArray[i+1];
      }
      let categoryId, productId;
      if(vals.category) {
        categoryId = vals.category;
        let album = albums.filter(album => album.id == categoryId)[0];
        $categoryModalStore.setAlbum(album,false);
        if($categoryModalStore.isOpen() == false) {
          $categoryModalStore.toggleModal(false);
        }
        if(vals.products) {
          productId = vals.products;
          $productModalStore.setProduct(categoryId, productId,false);
          if($productModalStore.isOpen() == false) {
            $productModalStore.toggleModal(false);
          }
        }
      }
      

      if(productId == undefined && categoryId == undefined) {
        if($categoryModalStore.isOpen()) {
          $categoryModalStore.toggleModal(false);
        }
        if($productModalStore.isOpen()) {
          $productModalStore.toggleModal(false);
        }
      }
    };
    
    /*csrf_response.then(csrf_response => {
      if($userInfoStore && $userInfoStore.isLogin) {
        update_campains_albums();
      }else {
        console.log('user is not loged in');
      }
      
    });*/
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
    let csrf_response = await request_csrf_token();
    
    if(csrf_response.whoAmI && Object.keys(csrf_response.whoAmI).length != 0) {
      $userInfoStore.me = csrf_response.whoAmI;
      $userInfoStore.isLogin = true;
      console.log('user is loged in, updating campains');
      
      update_campains_with_local_data(csrf_response.whoAmI.campains);
      let username = $userInfoStore.me.username;
      window.$crisp.push(["set", "user:nickname", [username]]);
      window.$crisp.push(["set", "user:email", [$userInfoStore.me.email]]);
      //window.$crisp.push(["set", "user:phone", [$userInfoStore.me.phone]]);

    }else {
      console.log('user is not loged in');
      $userInfoStore = {
        isLogin: false,
        me: {}
      }
    } 
    albumsJsonStore.set(albums);
    console.log('albums: ', albums);
    
    
    let onLoadTask = sessionStorage.getItem('onLoadTask');
    if(onLoadTask) {
      onLoadTask = JSON.parse(onLoadTask);
      if (onLoadTask.type == 'product') {
        let prodId = onLoadTask.data.id;
        let cateId = onLoadTask.album;
        

        let albumObj = albums.filter(album => album.id == cateId)[0];
        if (albumObj) {
        $categoryModalStore.setAlbum(albumObj);
          $categoryModalStore.toggleModal();
          setTimeout(()=> {
            $productModalStore.toggleModal()
            $productModalStore.setProduct(cateId, prodId);
          },1);
        }
        
      }else if(onLoadTask.type == 'category') {
        let task_album = onLoadTask.data;
        let albumObj = albums.filter(album => album.id == task_album.id)[0];
        if(albumObj) {
          $categoryModalStore.toggleModal();
          $categoryModalStore.setAlbum(task_album);
        }
      }
      sessionStorage.removeItem('onLoadTask');
    }
    

    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

  });

  albumsJsonStore.subscribe(new_albums => {
    if(new_albums.length > 0) {
      albums = new_albums;
    }
    console.log('new albums subscriber: ', new_albums);
  });

  activeModalsStore.subscribe(modals => {
    if(browser) {

      if(Object.keys(modals).length == 0) {
        /*overflow-y: auto;
        margin-right: 0px;*/

        //document.body.classList.remove('my-modal-open');
        sl_disable();
        
      }
      else {
        /*overflow-y: hidden;
        margin-right: 0px;*/

        //document.body.classList.add('my-modal-open');
        sl_enable();
      }
    }
  });
  function update_campains_with_local_data(campains) {
    let campains_response = campains;
    campainsStore.set(campains_response);
    //let campain_album = campains_response[0].album;
    let temp_albums = albums;
    for(let i = 0; i < campains_response.length; i++) {
      let campain_album = campains_response[i].album;
      temp_albums.unshift(campain_album);
    }
    albumsJsonStore.set(temp_albums);
  }

  function window_resize(e) {
    console.log('window_resize');
    let swipers = $all_swipers;
    for( const[key, value] of Object.entries(swipers)) {
        value.update_swiper();
    };
  }
  /*async function update_campains_albums() {
    let campains_response = undefined;
    campains_response = await api_get_user_campains();
    campainsStore.set(campains_response);
    for(let i = 0; i < campains_response.length; i++) {
      let campain_album = campains_response[i].album;
      albums.unshift(campain_album);
    }
  }*/
  function openCategoryModal(album){
      $categoryModalStore.toggleModal();
      $categoryModalStore.setAlbum(album);
      logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה מכפתור סליידר',
                                'f':{
                                    'type':'category',
                                    'id':album.id,
                                    'ti':album.title, 
                                },
                                'w':{
                                    'type':'category',
                                    'id':album.id,
                                    'ti':album.title, 
                                }
                            }
                            );
    }



</script>

<style lang="scss">
  .tax-text {
    font-size: larger;
    color: #000000;
    font-weight: bold;
    margin-top: 5px;
    width: 100%;

    margin: auto;
    text-align: center;
    font-family: inherit;
  }


</style>