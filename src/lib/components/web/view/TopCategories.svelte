<script>
    /*import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';*/
    import { CLOUDINARY_URL } from 'src/api/consts';
    import {page} from '$app/stores';
import { onMount } from 'svelte';
//import { indexdb_get_main_categories } from 'src/stores/dexie/api_wrapers';
import { userInfoStore } from 'src/stores/stores';
import { browser } from '$app/env';
import { Spinner } from 'sveltestrap';
import { get_topLevelCategories } from 'src/stores/sessionStorage/topLevelCategories';
/*import {ScrollSnapDraggable} from 'scroll-snap-slider/src/ScrollSnapDraggable.js';
import { ScrollSnapSlider  } from 'scroll-snap-slider'
*/
    let isDown = false;
    let startX;
    let scrollLeft;
    let slider;
    let isWalking = false;
    let categories_promise = get_topLevelCategories();
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
    $: {
        if(browser) {
            let page_href_top = $page.query.get('top');
            setTimeout (()=> {
                let el = document.querySelector(`.scroll-snap-slide[data-top-slug="${page_href_top}"]`);
                if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
                }
            },0)
        }
    }
    function slider_mouseup(e) {
        console.log('slider_mouseup');
        isDown = false;
        isWalking = false;
    }

    function slider_mouseleave(e) {
        console.log('slider_mouseleave');
        isDown = false;
        isWalking = false;
    }

    function slider_mousedown(e) {
        isDown = true;
        //slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        console.log('slider_mousedown');
    }

    function slider_mousemove(e) {
        console.log('slider_mousemove');
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX)// * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log('walk', walk);
        if(walk > 20 || walk < -20) {
            isWalking = true;
        }
    }
    
    function swiper_arrow_clicked(e) {
        let el = e.currentTarget;
        let direction = el.dataset.direction;
        debugger;
        if(direction == 'left') {
            slider.scrollBy({left: -200, behavior: 'smooth'});
            setTimeout(()=> {
                swiper_left_scroll_tracker -= 200;
            })
        }
        else {
            slider.scrollBy({left: 200, behavior: 'smooth'});
            setTimeout(()=> {
                swiper_left_scroll_tracker += 200;
            })
        }
    }
    $: swiper_left_scroll_tracker = slider ? slider.scrollLeft : 0;

</script>
<div class="wraper">
        <h6>קטגוריות ראשיות</h6>
        <div bind:this={slider} on:mousedown="{slider_mousedown}" on:mouseleave="{slider_mouseleave}" on:mouseup="{slider_mouseup}" on:mousemove={slider_mousemove} class="scroll-snap-slider">
                
                {#if $userInfoStore?.me?.campains?.length > 0} 
                    <div class="scroll-snap-slide" class:pointer-down={isWalking}  class:active={'campaigns' == $page.query.get('top')}>
                        <a href="?top=campaigns" class="category" >
                            <img src="https://res.cloudinary.com/ms-global/image/upload/v1660132407/msAssets/Group_10_copy_10_3_-removebg-preview_1_uq2t66.png" alt="מבצעים">
                            <div>מבצעים</div>
                        </a>
                    </div>
                {/if}
                <div class="scroll-snap-slide" class:pointer-down={isWalking}  class:active={'new' == $page.query.get('top')}>
                    <a href="?top=new" class="category" >
                        <img src="https://res.cloudinary.com/ms-global/image/upload/v1660122508/msAssets/icons8-new-product-64_gikxga.png" alt="חדשים">
                        <div>חדשים</div>
                    </a>
                </div>
                {#await categories_promise}
                    {#each [1,2,3,4,5,6,7,8,8] as i}
                        <div class="scroll-snap-slide">
                            <a href="#" class="category" >
                                <img src="https://res.cloudinary.com/ms-global/image/upload/v1640084351/undefined.png" alt="...">
                                <div><Spinner/></div>
                            </a>
                        </div>
                    {/each}
                {:then categories}          
                    {#each categories as category}
                        <div class="scroll-snap-slide" class:pointer-down={isWalking} data-top-slug={category.slug} class:active={category.slug == $page.query.get('top')}>
                            <a href="?top={category.slug}" class="category" >
                                <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                                <div>{category.name}</div>
                            </a>
                        </div>
                    {/each}
                {/await}
        </div>
        <!--<br>
        offsetWidth: {slider?.offsetWidth} <br>
        scrollLeft: {slider?.scrollLeft} <br>
        scrollWidth: {slider?.scrollWidth} <br>-->
        <div class="swiper-arrow swiper-arrow-right" data-direction='right' on:click="{swiper_arrow_clicked}" class:active={swiper_left_scroll_tracker < -10} >
            <img src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="arrow">
        </div>
        <div class="swiper-arrow swiper-arrow-left" data-direction='left' on:click="{swiper_arrow_clicked}" class:active={swiper_left_scroll_tracker + slider?.scrollWidth - slider?.offsetWidth > 10} >
            <img src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="arrow">
        </div>
    </div>
<style lang="scss">
    .wraper {
        background: #d7d7d77a;
        padding-bottom: 19.19px;
        //padding-top: 20px;
        width: 98%;
        margin-right: auto;
        margin-left: auto;
        box-shadow: 0px 0px 10px 0px #0000005d;
        border-radius: 15px;
        /* padding-left: 20px; */
        padding-right: 20px;
        margin-bottom: 10px;
        position: relative;
    }
    .swiper-arrow  {
        background-color: #f5f5f5f5;
        border-radius: 50%;
        padding: 5px;
        display: none;
        cursor: pointer;
        img {
            width: 30px;
            height: 30px;
        }
        &.active {
            display: block;
        }
        &:hover {
            background-color: #c7c6c6;
            img {
                transform: scale(1.2);
            }
        }
    }
    .swiper-arrow-right {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 1;
    }
    .swiper-arrow-left {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: rotate(180deg) translateY(50%);
        cursor: pointer;
        z-index: 1;
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

            &.pointer-down {
                cursor: grabbing;
                pointer-events: none;
            }
            a.category {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width:100%;
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