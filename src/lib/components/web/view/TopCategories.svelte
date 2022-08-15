<script>
    /*import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';*/
    import { CLOUDINARY_URL } from 'src/api/consts';
    import {page} from '$app/stores';
import { onMount } from 'svelte';
import { indexdb_get_main_categories } from 'src/stores/dexie/api_wrapers';
import { userInfoStore } from 'src/stores/stores';
/*import {ScrollSnapDraggable} from 'scroll-snap-slider/src/ScrollSnapDraggable.js';
import { ScrollSnapSlider  } from 'scroll-snap-slider'
*/
    let isDown = false;
    let startX;
    let scrollLeft;
    let slider;
    // export let categories = [];
    // onMount(async () => {
    //     if (categories.length === 0) {
    //         console.log('load top level categories', categories);
    //         debugger;
    //     }
    //     else {
    //         debugger;
    //         console.log('categories already loaded', categories);
    //     }
    // });
    function slider_mouseup(e) {
        isDown = false;
    }

    function slider_mouseleave(e) {
        isDown = false;
    }

    function slider_mousedown(e) {
        isDown = true;
        //slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    function slider_mousemove(e) {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX)// * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log(walk);
    }
</script>
<div class="wraper">
        <h6>קטגוריות ראשיות</h6>
        <div bind:this={slider} on:mousedown="{slider_mousedown}" on:mouseleave="{slider_mouseleave}" on:mouseup="{slider_mouseup}" on:mousemove={slider_mousemove} class="scroll-snap-slider">
                
                {#if $userInfoStore?.me?.campains?.length > 0} 
                    <div class="scroll-snap-slide" class:active={'campaigns' == $page.query.get('top')}>
                        <a href="?top=campaigns" class="category" >
                            <img src="https://res.cloudinary.com/ms-global/image/upload/v1660132407/msAssets/Group_10_copy_10_3_-removebg-preview_1_uq2t66.png" alt="מבצעים">
                            <div>מבצעים</div>
                        </a>
                    </div>
                {/if}
                {#await indexdb_get_main_categories()}
                    hey
                {:then categories}          
                    {#each categories as category}
                        <div class="scroll-snap-slide" class:active={category.slug == $page.query.get('top')}>
                            <a href="?top={category.slug}" class="category" >
                                <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                                <div>{category.name}</div>
                            </a>
                        </div>
                    {/each}
                {/await}
        </div>
    </div>
<style lang="scss">
    .wraper {
        background: #d7d7d77a;
        padding-bottom: 10px;
        //padding-top: 20px;
        width: 98%;
        margin-right: auto;
        margin-left: auto;
        box-shadow: 0px 0px 10px 0px #0000005d;
        border-radius: 15px;
        /* padding-left: 20px; */
        padding-right: 20px;
        margin-bottom: 10px;
    }
    .scroll-snap-slider {
        //width: 100%;
        //height: 55px;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        overflow-x: scroll;
        overflow-y: hidden;
        margin-bottom: 10px;
        //border: 1px solid red;
        //scroll-snap-type: x mandatory;


        //transform: scale(0.98);
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
            margin: 0 5px;
            justify-content: center;
            align-items: center;
            min-width: 250px;
            height: 100%;
            align-content: center;
            overflow: hidden;
            position: relative;
            align-self: center;
            justify-self: center;
            align-items: center;
            justify-content: center;
            a {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                img {
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                }
            }
            
            &.active {
                background: rgba(104, 103, 103, 0.548);
            }
            &:hover {
                background: rgba(114, 114, 114, 0.3);
            }
        }
}
</style>