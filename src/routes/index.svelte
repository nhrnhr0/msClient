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
	<CatalogSwiper album={album}/>
	
{/each}

<script>

import CatalogSwiper from '$lib/swipers/catalogSwiper.svelte';
import CategoryModal from "$lib/modals/categoryModal.svelte";
import { writable } from "svelte/store";




</script>

<style>

</style>