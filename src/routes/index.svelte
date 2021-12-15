<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
  import LogoSwiper from "$lib/swipers/logoSwiper.svelte"
	import {all_swipers,userDetailModalStore, albumsJsonStore,cartModalStore, successModalStore, productModalStore, categoryModalStore,productImageModalStore,loginModalStore, sizesJsonStore, colorsJsonStore, userInfoStore} from './../stores/stores'
	import {ALBUMS_API_URL, SIZES_API_URL, COLORS_API_URL, LOGOS_API_URL } from './../api/consts'
  import { browser } from '$app/env';
  import {getCookie} from '$lib/utils/cookies';

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
<!--<TempModal bind:this={$tempModalStore}/>
<button on:click={()=>{$tempModalStore.toggleModal()}}>click me to open modal</button>-->
<LoginModal bind:this={$loginModalStore}></LoginModal>
<ProductModal bind:this={$productModalStore}></ProductModal>
<ProductImageModal bind:this={$productImageModalStore}></ProductImageModal>
<CategoryModal bind:this={$categoryModalStore}> </CategoryModal>
<CartModal bind:this={$cartModalStore}></CartModal>
<SuccessModal bind:this={$successModalStore}></SuccessModal>
<UserDetailsModal bind:this={$userDetailModalStore}></UserDetailsModal>
{#each albums as album}

		<div class="title-wraper">
			<button class="title btn" on:click={openCategoryModal(album)}>
				{album.title}
			</button>
		</div>

	<CatalogSwiper album={album} bind:this={$all_swipers[album.id]} loaded_data={all_products[album.id]}/>
	
{/each}

<ContentForm></ContentForm>

<link rel="preload" as="image" href="https://img.icons8.com/external-becris-lineal-becris/48/000000/external-check-mintab-for-ios-becris-lineal-becris-1.png">

<script>

  import CatalogSwiper from '$lib/swipers/catalogSwiper.svelte';
  import CategoryModal from "$lib/modals/cModal.svelte";
  import ProductModal from "$lib/modals/pModal.svelte";
  import ProductImageModal from "$lib/modals/pImgModal.svelte";
  import CartModal from "$lib/modals/cartModal.svelte"
  import { onMount } from "svelte";
import { get_album_details, request_csrf_token  } from "./../api/api";
import ContentForm from '$lib/contentForm.svelte';
import SuccessModal from '$lib/modals/successModal.svelte';
import LoginModal from '$lib/modals/loginModal.svelte';
import UserDetailsModal from '$lib/modals/userDetailsModal.svelte';
import { bind } from 'svelte/internal';
import { stateQuery} from './../stores/queryStore'
import { logStore } from "../stores/logStore";

  export let colors;
  export let sizes;
  export let albums;
  export let logos;
  export let all_products;
  let y_scroll;

  
  //export let onLoadCategory;
  //export let onLoadProduct;
  

  onMount(()=> {
    console.log('protocol: ', location.protocol);
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
    let csrf_response = request_csrf_token();
    /*csrf_response.then(response => {
      if($userInfoStore.isLogin == false && $userInfoStore.refresh != null) {
        request_refresh_token().then(response => {
          $userInfoStore.refresh = response.refresh;
        })
      }
    });*/
      
    
    albumsJsonStore.set(albums);
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
    
    let onLoadTask = sessionStorage.getItem('onLoadTask');
    if(onLoadTask) {
      onLoadTask = JSON.parse(onLoadTask);
      if (onLoadTask.type == 'product') {
        let prodId = onLoadTask.data.id;
        let cateId = onLoadTask.data.albums[0];
        


        $categoryModalStore.setAlbum(albums.filter(album => album.id == cateId)[0]);
        
        $categoryModalStore.toggleModal();
        setTimeout(()=> {
          $productModalStore.toggleModal()
          $productModalStore.setProduct(cateId, prodId);
        },1);


        
      }else if(onLoadTask.type == 'category') {
        let album = onLoadTask.data;
        $categoryModalStore.toggleModal();
        $categoryModalStore.setAlbum(album);
      }
      sessionStorage.removeItem('onLoadTask');
    }
    
    /*if(onLoadCategory != '-1') {
      for(let i = 0; i < albums.length; i++) {
        if(albums[i].id == onLoadCategory) {
          openCategoryModal(albums[i]);

          break;
        }
      }
    }
    if(onLoadProduct != '-1') {
      let [prodId, cateId] = onLoadProduct.split(',');
      $productModalStore.toggleModal()
      $productModalStore.setProduct(prodId, cateId);
      
      //openProductModalFromId(cateId, prodId)
    }*/

    /*setTimeout(()=> {
      console.log('y_scroll: ', y_scroll)
      y_scroll = 0;
    },500);*/
  });


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
}
</style>