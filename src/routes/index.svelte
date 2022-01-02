<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
  import CartDisclaimer from "$lib/cart-disclaimer.svelte"
  import LogoSwiper from "$lib/swipers/logoSwiper.svelte"
	import {all_swipers,userDetailModalStore, albumsJsonStore,cartModalStore, successModalStore, productModalStore, categoryModalStore,productImageModalStore,loginModalStore, sizesJsonStore, colorsJsonStore, userInfoStore} from './../stores/stores'
	import {ALBUMS_API_URL, SIZES_API_URL, COLORS_API_URL, LOGOS_API_URL } from './../api/consts';
  import {api_get_user_campains} from './../api/api'
  import { browser } from '$app/env';
  import {getCookie} from '$lib/utils/cookies';
  import {activeModalsStore} from "$lib/modals/modalManager";

  export async function load({fetch, page}) {
    console.log('load: ', page, page.path);
    //const qs = browser ? document.location.search : '';
    //const query = new URLSearchParams(qs);
    //const productQuery = (query.get('product') || '-1');
    //const categoryQuery = query.get('category');
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
    }
    let products = {};

    //TODO: remove the !browser on production build
    //if (!browser) {
      for(let i = 0; i < albums_json.length; i++) {
        let productResponse = await get_album_details(albums_json[i].id, fetch)
        
        products[albums_json[i].id] = productResponse;
      }
    //}

    
    /*
*/
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
    description: `מתמחה באספקת מגוון רחב של מוצרים למוסדות ולחנויות ברחבי הארץביגוד • הנעלה • הלבשה תחתונה • טקסטיל לבית • תיקים ופאוצ'ים • משק בית • חשמל לבית • כלי מטבח • משחקים וצעצועים • תחזוקה לבית • ספורט • גאדג'טים ועוד...`,
    keywords: `ביגוד • הנעלה • הלבשה תחתונה • טקסטיל לבית • תיקים ופאוצ'ים • משק בית • חשמל לבית • כלי מטבח • משחקים וצעצועים • תחזוקה לבית • ספורט • גאדג'טים ועוד...`,
    image: 'https://res.cloudinary.com/ms-global/image/upload/v1635432768/msAssets/global_favicon_mtnlkz.png',
  }
</script>




<svelte:head>
        <title>{meta_data.title}</title>
        <link rel="icon" href="https://res.cloudinary.com/ms-global/image/upload/v1635432768/msAssets/global_favicon_mtnlkz.png" />
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
<svelte:window bind:scrollY={y_scroll}/>
<Header />
<About />
<LogoSwiper {logos}/>
<CartDisclaimer />

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

{#each albums as album}

		<div class="title-wraper" class:campain={album.is_campain}>
			<button class="title btn"  on:click={openCategoryModal(album)}>
				{album.title}
        
        {#if album.is_campain}
          <MyCountdown date={$campainsStore.find(v => v.album.id == album.id).endTime}/>
        {/if}
        <!--
            <Countdown from="2023-11-09 09:30:00" dateFormat="YYYY-MM-DD H:m:s" zone="Europe/Athens" let:remaining>
              <div class="whatever">
                  {#if remaining.done === false}5
                  <span>{remaining.years} years</span>
                  <span>{remaining.months} months</span>
                  <span>{remaining.weeks} weeks</span>
                  <span>{remaining.days} days</span>
                  <span>{remaining.hours} hours</span>
                  <span>{remaining.minutes} minutes</span>
                  <span>{remaining.seconds} seconds</span>
                  {:else}
                  <h2>The time has come!</h2>
                  {/if}
              </div>
          </Countdown>
        -->
        
			</button>
		</div>

	<CatalogSwiper album={album} bind:this={$all_swipers[album.id]} loaded_data={all_products[album.id]}/>
{/each}

<ContentForm></ContentForm>

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
import MyCountdown from "$lib/components/MyCountdown.svelte";

  export let colors;
  export let sizes;
  export let albums;
  export let logos;
  export let all_products;
  let y_scroll;
  //let campains;

  
  //export let onLoadCategory;
  //export let onLoadProduct;

  function lsTest(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}
  onMount(async()=> {
    alert('userInfoStore: ' +  JSON.stringify($userInfoStore));
    
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
    let csrf_response = await request_csrf_token();
    alert('csrf_response: ' +  JSON.stringify(csrf_response));
    debugger;
    if(csrf_response.whoAmI && Object.keys(csrf_response.whoAmI).length != 0) {
      $userInfoStore.me = csrf_response.whoAmI;
      $userInfoStore.isLogin = true;
      console.log('user is loged in, updating campains');
      
      update_campains_with_local_data(csrf_response.campains);
    }else {
      console.log('user is not loged in');
      $userInfoStore = {
        isLogin: false,
        me: {}
      }
    } 
    alert('userInfoStore: ' +  JSON.stringify($userInfoStore));
    albumsJsonStore.set(albums);
    console.log('albums: ', albums);
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
    
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

  activeModalsStore.subscribe(modals => {
    if(browser) {

      if(Object.keys(modals).length == 0) {
        /*overflow-y: auto;
        margin-right: 0px;*/
        document.body.classList.remove('my-modal-open');
      }
      else {
        /*overflow-y: hidden;
        margin-right: 0px;*/
        document.body.classList.add('my-modal-open');
      }
      console.log('hey: ', Object.keys(modals).length);
    }
  });
  function update_campains_with_local_data(campains) {
    let campains_response = campains;
    campainsStore.set(campains_response);
    //let campain_album = campains_response[0].album;
    for(let i = 0; i < campains_response.length; i++) {
      let campain_album = campains_response[i].album;
      albums.unshift(campain_album);
    }
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


.title-wraper {
  display: flex;
  justify-content: center;
  padding-bottom: 50px;

  .title {
    opacity: 0.5;
    background-color: black;
    border-color: var(--clr-primery-gold);
    //margin-top: 25px;
    color: white;
    font-weight: bold;
    text-align: center;
    font-size: 2rem;
    width: 100%;
    margin-right: 20px;
    margin-left: 20px;

    &:hover,&:focus {
      @media (min-width: 820px) {
          &::before {
          content: '>> למעבר לקטגוריית ';
          opacity: 1;
          font-size: 1.4rem;
        }

        &::after {
          content: ' לחץ כאן <<';
          opacity: 1;
          font-size: 1.4rem;
        }
      }
      

      opacity: 0.8;
      //font-size: 2.2rem;

    }
  }
  &.campain {
    
    .title {
      @media (min-width: 820px) {
          &::before {
          content: '';
          opacity: 1;
          font-size: 1.4rem;
        }

        &::after {
          content: '';
          opacity: 1;
          font-size: 1.4rem;
        }
      }
    }
  }
}
</style>