<script>
    import {
        CLOUDINARY_URL
    } from "src/api/consts";
    import {
        Spinner
    } from "sveltestrap";
    import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';
    import {
        page
    } from '$app/stores';
    import 'swiper/css';
    import {
        browser
    } from "$app/env";
    import {
        goto
    } from "$app/navigation";
    export let albums = undefined;
    let my_albums;
    let loading = false;
    let slider;
    // when products changes set the categories_promise_innder to a promise which will be resolved when the categories are loaded.
    
    $: {
        //console.log('$:', albums) ;
        if (albums == undefined) {
            loading = true;
        }else {
            my_albums = [...albums];
            loading = false;
        }
    }
    /*function slideClick(swier, e) {
        console.log('slide clicked');
        let albumId = e.target.closest('.category').dataset.albumId;
        $page.query.set('album_id', albumId);
        debugger;
        goto($page.path + '?' + $page.query.toString());
    }*/

    function slider_click(e) {
        console.log('slider_click');
        let albumSlug = e.currentTarget.dataset.albumSlug;
        //$page.query.set('album_id', albumId);
        let new_query = new URLSearchParams($page.query);

        // the side category clicked is already the selected one, so we need to unselect it or if we are on a product page, we need to go back to the side category page (album).
        if($page.query.get('album') == albumSlug) { 
            if($page.query.get('product_id') == undefined) {
                new_query.delete('album');
            }
        } else {
            new_query.set('album', albumSlug);
        }
        new_query.delete('product_id'); // handle if side category is clicked inside a product page, we go for the side category
        let new_url = $page.path + '?' + new_query.toString();
        goto(new_url);
    }
</script>
<div class="background-wraper">
    <h6>תתי קטגוריות</h6>
    <div class="album-swiper-wraper" class:loading={loading}>
        <div bind:this={slider} class="scroll-snap-slider"> <!-- on:mousedown="{slider_mousedown}" on:mouseleave="{slider_mouseleave}" on:mouseup="{slider_mouseup}" on:mousemove={slider_mousemove}  -->
            
            {#if loading}
                <div class="spinner-wraper">
                    <div class="inner">
                        <Spinner />
                    </div>
                </div>
            {/if}
            {#each my_albums || [] as category}
            
                <div on:click="{slider_click}" class="scroll-snap-slide" class:active={category.slug == $page.query.get('album')} data-album-slug={category.slug}>
                    <div class="card">
                        <img width="25px" height="25px" src="{CLOUDINARY_URL}{category.cimage}" alt="{category.title}">
                        <div>{category.title}</div>
                    </div>
                </div>
            {/each}
        </div>
        
    </div>
</div>
<style lang="scss">
    .background-wraper {
        
        background: #d7d7d77a;
        //padding-bottom: 10px;
        //padding-top: 20px;
        height: 100%;
        box-shadow: 0px 0px 10px 0px #0000005d;
        border-radius: 15px;
        //border:1px solid red;
        margin-left: 10px;
        margin-right: 10px;
        h6 {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 3px;
        }
    }
    .album-swiper-wraper {
        
        position: relative;
        width: auto;
        height: 100%;
        height: calc(100vh - 146px);
        height: calc(100vh - 246px);
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        //border:1px solid blue;
        // hide scrollbar
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
        }
        //height: calc(100vh - 150px);
        &.loading {
            .spinner-wraper {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(184, 184, 184, 0.671);
                
                z-index: 1;
                :global(.inner) {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }


        .scroll-snap-slider {
            width: 225px;
            height: auto;
            overflow: hidden;
            margin-left: 15px;
            margin-right: 15px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            overflow-x: scroll;
            overflow-y: hidden;
            margin-bottom: 10px;
            


            will-change: transform;
        user-select: none;
        cursor: pointer;
        scroll-behavior: auto;
        -ms-overflow-style: none; /* IE 10+ */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }
        .scroll-snap-slide {
            
            display: flex;
            flex:1;
            
            background: rgba(255, 255, 255, 0.384);
            border-radius: 5px;
            margin: 5px 0px;
            //min-width: 150px;
            width:100%;
            height: 100%;
            
            overflow: hidden;
            position: relative;
            justify-content: space-between;
            &:hover {
                background: rgba(114, 114, 114, 0.3);
            }
            .card {
                width: 100%;;

                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                img {
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                }
                div {
                    margin-right: 10px;
                }
            }
            
            &.active {
                background: rgba(104, 103, 103, 0.548);
            }
        }
        }
    }
</style>