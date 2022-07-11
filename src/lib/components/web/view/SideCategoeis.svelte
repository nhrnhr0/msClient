<script>
import { CLOUDINARY_URL } from "src/api/consts";
import { Spinner } from "sveltestrap";
import { Swiper, SwiperSlide } from 'swiper/svelte';
import {page} from '$app/stores';
    import 'swiper/css';
import { browser } from "$app/env";
import { goto } from "$app/navigation";
    export let categories_promise = undefined;
    let categories_promise_innder = undefined;

    $: {
        browser && categories_promise && categories_promise.then(categories => {
            categories_promise_innder = categories;
            categories_promise = undefined;
        });
    }

    function slideClick(swier, e) {
        let albumId = e.target.closest('.category').dataset.albumId;

        // get from the album_ids from the $page.params
        // add the album_id to the album_ids if it doesn't exist
        // remove the album_id from the album_ids if it does exist
        // save the album_ids to the $page.params
        // navigate to the new url
        let current_albums_ids = undefined;
        debugger;
        if($page.params.album_ids) {
            current_albums_ids = $page.params.album_ids;
            current_albums_ids = current_albums_ids.split('-');
        }else {
            current_albums_ids = []
        }
        
        let new_albums_ids = current_albums_ids.includes(albumId) ? current_albums_ids.filter(id => id != albumId) : [...current_albums_ids, albumId];
        let current_url = $page.path;
        // replace the /albums/id1-id2-id3/ with /albums/new_albums_ids/ if it exists
        // otherwise add it after /view/id/
        
        let new_ids_url = new_albums_ids.length > 1? new_albums_ids.join('-'): (new_albums_ids.length == 0? '' :new_albums_ids[0]);
        let new_url = current_url.replace(/\/albums\/[^\/]+\/?/, `/albums/${new_ids_url}/`);
        if (new_url.indexOf('albums') == -1) {
            new_url = `${new_url}/albums/${new_albums_ids.join('-')}/`;
        }
debugger;
        // remove the /albums/id1-id1/ part if new_albums_ids is empty
        if (new_albums_ids.length == 0) {
            new_url = new_url.replace(/\/albums\/[^\/]+\/?/, '');
            new_url = new_url.replace('albums//', '');
        }
        goto(new_url);
    }
</script>
<div class="album-swiper-wraper">
    {JSON.stringify($page.params)}
    {#if categories_promise_innder}
        {#if categories_promise}
            <div class="spinner-wraper">
                <Spinner />
            </div>
        {/if}
        <Swiper
            class="album-swiper"
            direction={"vertical"}
            slidesPerView={'auto'}
            resistanceRatio="{0.45}"
            onClick="{slideClick}"
            >
                {#each categories_promise_innder as category}
                    {#if category.is_public}
                        <SwiperSlide>
                            <!--href="/web/view/{$page.params.id}/album/{category.id}"-->
                            <div class="category" data-album-id={category.id} class:active={($page.params.album_ids || '').split('-').includes(category.id.toString())}>
                                <img width="25px" height="25px" src="{CLOUDINARY_URL}{category.cimage}" alt="{category.title}">
                                <div>{category.title}</div>
                            </div>
                        </SwiperSlide>
                    {/if}
                {/each}
        </Swiper>
    {/if}
</div>

<!--
{#if categories_promise}
    {#await categories_promise}
        <Swiper></Swiper>
    {:then  categories} 
        <pre>
            {JSON.stringify(categories,null,4)}
        </pre>
    {/await}
{/if}
-->
<!--<Swiper
    class="side-categories-swiper"
    spaceBetween={10}
    loop="{false}"
    speed= "{150}"
    allowTouchMove="{true}"
    preventClicks="{false}"
    resistanceRatio="{0.45}"
    >
    {#each categories as category}
        <SwiperSlide>
            <div class="category">
                <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                <div>{category.name}</div>
            </div>
        </SwiperSlide>
    {/each}
</Swiper>-->
<style lang="scss">
    
    :global(.album-swiper-wraper) {
        border: 1px solid red;
        position: relative;
        .spinner-wraper {
            position: absolute;
            
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        width: fit-content;
        height: 100%;
        :global(.swiper.album-swiper) {
        
        width: 20rem;
        //width:35%;
        height: calc(100% - 60px);
        background-color: rgba(238, 238, 238, 0.582);
        padding: 10px;
        margin: 0 5px auto 0;
        border-radius: 10px;;   
            :global(.swiper-wrapper) {
                :global(.swiper-slide) {
                    height: 75px;
                    
                        padding-left: 15px;
                        margin: 10px;
                    :global(.category) {
                        background-color: rgba(134, 134, 134, 0.466);
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        border-radius: 10px;
                        &.active {
                            background-color: rgb(85, 85, 85);
                            color:white;
                        }
                        :global(img) {
                            width: 45px;
                            height: 45px;
                        }
                        :global(div) {
                            width: 100%;
                            height: 100%;
                            text-align: center;
                            font-size: 1.2rem;
                            font-weight: bold;
                            color: #fff;
                        }
                        
                    }
                }
            }
        }
    }
</style>