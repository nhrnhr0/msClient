<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
	import {albumsJsonStore, productModalStore, categoryModalStore,sizesJsonStore, colorsJsonStore} from './../stores/stores'
	import {ALBUMS_API_URL, SIZES_API_URL, COLORS_API_URL } from './../api/consts'
	
  export async function load({fetch}) {
    let albums_response = await fetch(ALBUMS_API_URL, { method: 'GET', redirect: 'follow'});
    let albums_json = await albums_response.json();

    let sizes_response = await fetch(SIZES_API_URL, {method: 'GET', redirect: 'follow'})
    let sizes_json = await sizes_response.json();

    let colors_response = await fetch(COLORS_API_URL, {method: 'GET', redirect: 'follow'})
    let colors_json = await colors_response.json();


    
    /*
*/
    return {
			props: {
        colors: colors_json,
        sizes: sizes_json,
        albums: albums_json
			}
		};
  }
  
</script>




<svelte:head>
	<title>Home</title>
</svelte:head>
<CategoryModal bind:this={$categoryModalStore}> </CategoryModal>
<ProductModal bind:this={$productModalStore}></ProductModal>

<Header />
<About />
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
  import CategoryModal from "$lib/modals/categoryModal.svelte";
  import ProductModal from "$lib/modals/productModal.svelte";
  import { onMount } from "svelte";

  export let colors;
  export let sizes;
  export let albums;

  onMount(()=> {
    console.log('on mount: setting albums');
    albumsJsonStore.set(albums);
    sizesJsonStore.set(sizes);
    colorsJsonStore.set(colors);
  });

  function openCategoryModal(album){
      $categoryModalStore.setAlbum(album);
      $categoryModalStore.open();
    }

</script>

<style lang="scss">
.title-wraper {
  display: flex;
  justify-content: center;

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