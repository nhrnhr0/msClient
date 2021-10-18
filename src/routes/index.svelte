<script context="module">
	import Header from "$lib/header.svelte"
	import About from "$lib/about.svelte"

	import {ALBUMS_API_URL} from './../api/consts'

	let albumsJsonStore = writable([])

fetch(ALBUMS_API_URL, { method: 'GET', redirect: 'follow'})
	.then(response => response.json())
	.then(result => {console.log(result);albumsJsonStore.set(result)})
	.catch(error => console.log('error', error));
</script>



<svelte:head>
	<title>Home</title>
</svelte:head>

<Header />
<About />
{#each $albumsJsonStore as album}
	<CatalogSwiper album={album}/>
	
{/each}
	<Swiper spaceBetween={50} slidesPerView={3} loop={true} on:slideChange={()=> console.log('slide change')}
		on:swiper={(e) => console.log(e.detail[0])}
		>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/0//200/300.jpg?random=1" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/1/200/300.jpg?random=2" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/2/200/300.jpg?random=3" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/3/200/300.jpg?random=4" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/4/200/300.jpg?random=5" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/5/200/300.jpg?random=9" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/6/200/300.jpg?random=6" /></SwiperSlide>
		<SwiperSlide><img alt="" src="https://picsum.photos/id/7/200/300.jpg?random=7" /></SwiperSlide>

	</Swiper>

	


<script>
	// Import Swiper Svelte components
	import {
		Swiper,
		SwiperSlide
	} from 'swiper/svelte';

	// Import Swiper styles
	import 'swiper/css';
import { writable } from "svelte/store";
import CatalogSwiper from '$lib/swipers/catalogSwiper.svelte';




</script>

<style>

</style>