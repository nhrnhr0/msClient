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
    import {fly} from 'svelte/transition';
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
    let is_side_closed = false;
</script>

<div class="position-wraper">
    <div class="acordion-button" class:close={is_side_closed} on:click="{()=>{is_side_closed=!is_side_closed}}">
        <div class="text">
            {#if is_side_closed}
                פתח תתי קטגוריות
            {:else}
                כווץ תתי קטגוריות
            {/if}
        </div>
        <div class="acordion-button-icon">
            {#if is_side_closed}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"/></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"/></svg>
            {/if}
        </div></div>
    {#if is_side_closed == false}
    <div class="background-wraper" in:fly="{{x:200, duration:350}}" out:fly="{{x:200, duration:350}}">
            <h6>תתי קטגוריות</h6>
            <div class="album-swiper-wraper" class:loading={loading} >
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
    {/if}
</div>
<style lang="scss">
    .position-wraper {
        position: relative;
    }
    .acordion-button {
            position: absolute;
            left: 0px;
            top: 50%;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.726);
            height: auto;
            padding-bottom: 5px;
            padding-top: 5px;
            cursor: pointer;
            transform: translate(0%, -50%);
            &.close {
                left: auto;
                right: 0px;
                transform: translate(15%, -50%);
            }
            .text {
                color: white;
                writing-mode: vertical-rl;
            }
            .acordion-button-icon {
                width: 15px;
                height: 15px;
                margin: 0 5px;
                svg {
                    width: 100%;
                    height: 100%;
                    fill: white;
                }
            }

            &:hover {
                background-color: rgba(51, 51, 51, 0.616);
            }
        }
    .background-wraper {
        background: #d7d7d77a;
        //padding-bottom: 10px;
        //padding-top: 20px;
        height: 100%;
        height: calc(100vh - 211px);
        height: calc(calc(var(--vh, 1vh) * 100) - 211px);

        box-shadow: 0px 0px 10px 0px #0000005d;
        border-radius: 15px;
        //border:1px solid red;
        margin-left: 10px;
        margin-right: 10px;
        h6 {
            text-align: center;
            //margin-top: 10px;
            margin-bottom: 3px;
        }
        position: relative;
        
    }
    .album-swiper-wraper {
        
        position: relative;
        width: auto;
        /*height: 100%;
        height: calc(100vh - 146px);*/
        
        max-height: 100%;
        height: calc(100vh - 234px);
        height: calc(calc(var(--vh, 1vh) * 100) - 234px);
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
            margin-left: 20px;
            margin-right: 20px;
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
                background: rgb(239 238 238 / 88%);
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
    // 675 + 315 = 990
    @media screen and (max-width:990px) {
        .background-wraper {
            margin-left: 1px;
            margin-right: 1px;

            .album-swiper-wraper {
                .scroll-snap-slider {
                    width:min-content;
                    margin-right: 5px;
                    margin-left: 5px;
                }
            }
        }
    }
</style>