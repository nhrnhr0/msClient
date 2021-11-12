<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
  import LogoSwiper from "$lib/swipers/logoSwiper.svelte"
	import {all_swipers,userDetailModalStore, albumsJsonStore,cartModalStore, successModalStore, productModalStore, categoryModalStore,productImageModalStore,loginModalStore, sizesJsonStore, colorsJsonStore, userInfoStore} from './../stores/stores'
	import {ALBUMS_API_URL, SIZES_API_URL, COLORS_API_URL, LOGOS_API_URL } from './../api/consts'
  import { browser } from '$app/env';
  import {getCookie} from '$lib/utils/cookies';

  export async function load({fetch, page}) {
    //const qs = browser ? document.location.search : '';
    //const query = new URLSearchParams(qs);
    //const productQuery = (query.get('product') || '-1');
    //const categoryQuery = query.get('category');
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
  
</script>




<svelte:head>
	<title>M.S. Global</title>
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

  export let colors;
  export let sizes;
  export let albums;
  export let logos;
  export let all_products;
  let y_scroll;

  
  //export let onLoadCategory;
  //export let onLoadProduct;
  

  onMount(()=> {
    let csrf_response = request_csrf_token();
    /*csrf_response.then(response => {
      if($userInfoStore.isLogin == false && $userInfoStore.refresh != null) {
        request_refresh_token().then(response => {
          $userInfoStore.refresh = response.refresh;
        })
      }
    });*/
      
    console.log('on mount: setting albums');
    albumsJsonStore.set(albums);
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
    
    let onLoadTask = sessionStorage.getItem('onLoadTask');
    if(onLoadTask) {
      debugger;
      onLoadTask = JSON.parse(onLoadTask);
      if (onLoadTask.type == 'product') {
        let prodId = onLoadTask.data.id;
        let cateId = onLoadTask.data.albums[0];;
        $productModalStore.toggleModal()
        $productModalStore.setProduct(cateId, prodId);
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
          openCategoryModal(albums[i])
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

    &:hover {
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

      opacity: 0.8;
      //font-size: 2.2rem;

    }
  }
}
</style>