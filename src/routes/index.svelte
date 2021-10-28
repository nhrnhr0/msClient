<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
	import {albumsJsonStore, productModalStore, categoryModalStore,productImageModalStore, sizesJsonStore, colorsJsonStore} from './../stores/stores'
	import {ALBUMS_API_URL, SIZES_API_URL, COLORS_API_URL } from './../api/consts'
  import { browser } from '$app/env';


  export async function load({fetch, page}) {
    const qs = browser ? document.location.search : '';
    const query = new URLSearchParams(qs);
    const productQuery = (query.get('product') || '-1');
    const categoryQuery = query.get('category');
    let albums_response = await fetch(ALBUMS_API_URL, { method: 'GET', redirect: 'follow'});
    let albums_json = await albums_response.json();

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
    
    /*
*/
    return {
			props: {
        colors: colors_ret,
        sizes: sizes_ret,
        albums: albums_json,
        onLoadProduct: productQuery,
        onLoadCategory: categoryQuery
			}
		};
  }
  
</script>




<svelte:head>
	<title>Home</title>
</svelte:head>
<CategoryModal bind:this={$categoryModalStore}> </CategoryModal>
<ProductModal bind:this={$productModalStore}></ProductModal>
<ProductImageModal bind:this={$productImageModalStore}></ProductImageModal>
<Header />
<About />
<!--<TempModal bind:this={$tempModalStore}/>
<button on:click={()=>{$tempModalStore.toggleModal()}}>click me to open modal</button>-->
{#each albums as album}

		<div class="title-wraper">
			<button class="title btn" on:click={openCategoryModal(album)}>
				{album.title}
			</button>
		</div>

	<CatalogSwiper album={album}/>
	
{/each}

<script>

  import CatalogSwiper from '$lib/swipers/catalogSwiper.svelte';
  import CategoryModal from "$lib/modals/cModal.svelte";
  import ProductModal from "$lib/modals/pModal.svelte";
  import ProductImageModal from "$lib/modals/pImgModal.svelte";
  import { onMount } from "svelte";

  export let colors;
  export let sizes;
  export let albums;

  
  export let onLoadCategory;
  export let onLoadProduct;

  onMount(()=> {
    console.log('on mount: setting albums');
    albumsJsonStore.set(albums);
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
    if(onLoadCategory != '-1') {
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
    }
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