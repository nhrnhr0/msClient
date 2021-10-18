<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"
	import {albumsJsonStore} from './../stores/stores'
	import {ALBUMS_API_URL} from './../api/consts'
	import {categoryModalStore} from './../stores/stores'
	fetch(ALBUMS_API_URL, { method: 'GET', redirect: 'follow'})
			.then(response => response.json())
			.then(result => {console.log(result);albumsJsonStore.set(result)})
			.catch(error => console.log('error', error));
	
	//setContext('categoryModal', categoryModal);


</script>



<svelte:head>
	<title>Home</title>
</svelte:head>
<CategoryModal bind:this={$categoryModalStore}> </CategoryModal>
<Header />
<About />
{#each $albumsJsonStore as album}

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
import { writable } from "svelte/store";


function openCategoryModal(album){
    $categoryModalStore.setAlbum(album);
    $categoryModalStore.open();
  }

</script>

<style lang="scss">
.title-wraper {
  display: flex;
  justify-content: center;

  .counter {
    direction: ltr;

    #year {
      display: none;
    }

    #month {
      display: none;
    }

  }

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