<script export="module">
    import { inview } from 'svelte-inview';
    //import Lazy from 'svelte-lazy';
    import {CLOUDINARY_URL, STATIC_BASE} from '../../api/consts';

    import {
        get_album_details
    } from './../../api/api'
    export let album;
    // Import Swiper Svelte components
    import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';

    // Import Swiper styles
    import 'swiper/css';
    import "swiper/css/effect-coverflow"
    import "swiper/css/pagination"
    import "swiper/css/navigation";
    import "swiper/css/lazy"

    import {cartStore} from './../../stores/cartStore'
    import LazyImage from 'svelte-lazy-image';


    // import Swiper core and required modules
    import SwiperCore, {
        EffectCoverflow,
        Pagination,
        Navigation
    } from 'swiper';
    import Spinner from 'svelte-spinner';
    export let loaded_data;
    import {productModalStore} from './../../stores/stores'
import { onDestroy, onMount } from 'svelte';

import { flyToCart } from '$lib/utils/js/flyToCart';

import { logStore } from './../../stores/logStore';

    

    // install Swiper modules
    SwiperCore.use([EffectCoverflow, Pagination,Navigation]);
    //let data = get_album_details(album.id);
    let isLoaded = false;
    let mswiper;
    /*let data = get_album_details(album.id);
    let isLoaded = false;
    data.then((newData)=>{
        isLoaded = true;
        loaded_data = newData;
    });*/

    $: {
        if(isInView) {
            if(loaded_data == undefined) {
            let data = get_album_details(album.id);
            isLoaded = false;
            data.then((newData)=> {
                loaded_data = newData;
                isLoaded = true;
            });
            
            
        }
        }
    }
    let unsubCart = undefined;
    let lastCartLen = 0;
    function cartSubscripter(newCart) {
        if(mswiper) {
            setTimeout(()=> {
                mswiper.swiper().loopDestroy();
                mswiper.swiper().loopCreate();
            }),0
        }
    }
    onMount(()=> {
        //console.log('swiper on mount: ', loaded_data);
        unsubCart = cartStore.subscribe(cartSubscripter);
        
        /*window.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('.product-image').addEventListener("click", function(event) {
                //console.log(event.target);
            });
        });*/
    });
    onDestroy(()=> {
        if(unsubCart) {
            unsubCart();
        }
    })
    
    /*function swiperClicked(e) {
        e.preventDefault();
        //console.log('swiperClicked: ', e);        
        for (let i = 0; i < e.detail[0].length; i++) {
            let event = e.detail[0][i];
            if (event['target'] && event['target'].classList.contains('product-image')) {
                $productModalStore.setProduct(event['target'].dataset.catalogId, event['target'].dataset.productId);
                $productModalStore.open();
            }
        }
    }*/

    function get_product_by_id(imgId) {
        for(let i = 0; i < loaded_data.length; i++) {
            if(loaded_data[i].id == imgId) {
                return loaded_data[i];
            }
        }
        return undefined;
    }

    function swiperSlideClicked(E) {
        let dont_open_modal = false;
        // don't open the modal if the user use 2 fingers to zoom on slider
        for(let i = 0; i < E.detail[0].length;i++) {
            let item = E.detail[0][i];
            let len = item?.touches?.length || 0;
            if(len > 0) {
                dont_open_modal = true
            }
        }

        // handle clicks on add to card and image
        if(typeof(E) == 'object') {
            let detail = E.detail[0];
            for(let i = 0; i < detail.length; i++) {
                let target = detail[i].target;
                //console.log('>> \t', target);
                if(target) {
                    //console.log('>>>>> class list: >> \t', target.classList);

                    if(target.classList.contains('product-image') && dont_open_modal == false) {
                        $productModalStore.setProduct(target.dataset.catalogId, target.dataset.productId);
                        
                        $productModalStore.toggleModal();

                        logStore.addLog(
                            {
                                'a': 'פתיחת מוצר מסליידר',
                                't': 'open product',
                                'f':{
                                    'type':'slider',
                                    'id':album.id,
                                    'ti':album.title,
                                },
                                'w':{
                                    'type':'product',
                                    'id':target.dataset.productId,
                                    'ti':target.getAttribute('alt'), 
                                }
                            }
                            );

                    }else if(target.classList.contains('like-btn-wraper')) {
                        let currentProduct = get_product_by_id(target.dataset.productId);
                        if(cartStore.isInCart(currentProduct) == false) {
                            flyToCart(target.parentElement.querySelector('.product-image'));
                            cartStore.addToCart(currentProduct);
                            logStore.addLog(
                            {
                                'a': 'הוסף לעגלה מסליידר',
                                't': 'add to cart',
                                'f': {
                                    'type':'slider',
                                    'id':album.id,
                                    'ti':album.title
                                },
                                'w':{
                                    'type':'product',
                                    'id':target.dataset.productId,
                                    'ti':currentProduct.title, 
                                }
                            }
                            );
                        }else {
                            cartStore.removeFromCart(currentProduct);
                            logStore.addLog(
                            {
                                'a': 'הסר מהעגלה מסליידר',
                                't': 'remove from cart',
                                'f': {
                                    'type':'slider',
                                    'id':album.id,
                                    'ti':album.title
                                },
                                'w':{
                                    'type':'product',
                                    'id':target.dataset.productId,
                                    'ti':currentProduct.title, 
                                }
                            }
                            );
                        }
                        copySwiperduplicates(E);
                        
                        //$cart = $cart;
                        //console.log('cart: ', $cartStore);
                    }
                }
            }
        }
        

    }
    /*function swiperSlideClicked(catalogId, productId) {
        //console.log('swiperClicked2: ', catalogId, productId);
        $productModalStore.setProduct(catalogId, productId);
        $productModalStore.open();
    }*/
    export function fixDups() {
        setTimeout(()=>{
            mswiper.swiper().loopDestroy();
            mswiper.swiper().loopCreate();
        });
    }
    let slides = [];
    let isInView;
    function copySwiperduplicates(e) {
        /*console.log('===========> run slideChangeTransitionStart', e);
        let $wrapperEl = e.detail[0][0].$wrapperEl[0];
        let params = e.detail[0][0].params;
        let childs = $wrapperEl.querySelectorAll(('.' + (params.slideClass) + '.' + (params.slideDuplicateClass)))
        for(let i = 0; i < childs.length; i++) {
            let idx = childs[i].getAttribute('data-swiper-slide-index');
            let t = $wrapperEl.querySelector('.' + params.slideClass + '[data-swiper-slide-index="' + idx + '"]:not(.' + params.slideDuplicateClass + ')')
            childs[i].innerHTML = t.innerHTML;
        }
        */
       setTimeout(()=>{
            e.detail[0][0].loopDestroy();
            e.detail[0][0].loopCreate();
        });

    }
</script>
<div class="lazy-swiper-wraper" class:active="{isInView}" class:loaded="{isLoaded}"
use:inview

on:change={(event) => {
    //const { inview, entry, scrollDirection, observe, unobserve } = event.detail;
    isInView = event.detail.inView;
  }}
>
<!--<Lazy height={500}> -->
{#if isInView}
        <!--
            {#await data}
            <div class="loader-wraper">
            <Spinner
            size="200"
            speed="750"
            color="#A82124"
            thickness="2"
            gap="40"
        />
            </div>
        {:then d} 
        -->
        {#if loaded_data == undefined}
        <div class="loader-wraper">
            <Spinner
                size="200"
                speed="750"
                color="#A82124"
                thickness="2"
                gap="40"
            />
        </div>
        {:else}
                <Swiper
                bind:this={mswiper}
                effect="{'coverflow'}"
                centeredSlides="{true}"
                slidesPerView="{'5'}"
                observer="{true}"
                observeParents= "{true}"
                speed= "{50}"
                loop= "{true}"
                allowTouchMove="{true}"
                preventClicks="{false}"
                
                on:click={swiperSlideClicked}
                threshold={10}
                coverflowEffect='{{
                    "rotate": -13,
                    "stretch": 10,
                    "depth": 100,
                    "modifier": 1,
                    "slideShadows": false
                  }}'
                  breakpoints='{{
                        "220": {
                            "slidesPerView": 1.4,
                        },
                        "400": {
                            "slidesPerView": 2,
                        },
                        "600": {
                            "slidesPerView": 3,
                        },
                        "870": {
                            "slidesPerView": 3.3,
                        },
                        "960": {
                            "slidesPerView": 4,
                        },
                        "1100": {
                            "slidesPerView": 5,
                        }
                    }}'
                  pagination="{true}" 
                  navigation="{true}"
                  on:realIndexChange={(event) => {
                    //console.log('activeIndexChange: ', event);
                    //console.log('activeIndexChange: ', event.detail[0]);
                    let idx = event.detail[0][0].activeIndex;
                    //console.log('slide: ', slide);
                    //console.log('activeIndexChange: ', event.detail[0][0].activeIndex);
                    let productId = mswiper.swiper().slides[idx].querySelector('.product-image').dataset.productId
                    let product = get_product_by_id(productId);
                    logStore.addLog(
                            {
                                'a': 's',
                                't': 's',
                                'f': {
                                    'id':album.id,
                                },
                                'w':{
                                    'id':product.id,
                                }
                            }
                            );
                  }}
                >
                    {#each loaded_data as image,index (image.id)}
                        <SwiperSlide bind:this={slides[index]}>
                            <!--TODO: use only one cart active on the top and not one in the title, like button and more -->
                                <div class="img-title" class:active={$cartStore[image.id] != undefined}>
                                        {image.title}
                                </div>
                                <div class="slide-content" >
                                    <div class="img-wraper">
                                        
                                        <img  class="product-image" data-catalog-id="{album.id}" data-product-id="{image.id}" src="{CLOUDINARY_URL}f_auto,w_auto/{image.cimage}" alt="{image.title}">
                                        
                                    </div>
                                </div>
                                <div  class="like-btn-wraper" data-product-id="{image.id}">
                                    {#if $cartStore[image.id] == undefined}
                                        <button class="like-btn">
                                            <div class="img-wraper">
                                                <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
                                            </div>
                                            <div class="text">
                                                הוסף
                                            </div>
                                        </button>
                                    {:else}
                                        
                                        <button class="like-btn active">
                                            <div class="img-wraper">
                                                <img alt="V" src="https://res.cloudinary.com/ms-global/image/upload/v1639463503/msAssets/external-check-mintab-for-ios-becris-lineal-becris-1_dfwd0z.png"/>
                                            </div>
                                            <div class="text">
                                                    נוסף
                                            </div>
                                        </button>
                                    {/if}
                                  </div>
                            <!--</div>-->
                        </SwiperSlide>
                    {/each}
                    
              </Swiper>
        {/if}
    <!--
        {/await}
        -->
{/if}
<!--</Lazy>-->
</div>
<style lang="scss">
    :global(.swiper-wrapper) {
        margin-bottom: 50px;
    }
    :global(.swiper-pagination-bullets) {
        bottom: 24px;
    }
        .like-btn-wraper {
            cursor: pointer;
            width:100%;
            .like-btn {
                &.active {
                    @include bg-gradient();

                }
                /*&:hover {
                    &::after {
                        content: ' להצעת מחיר'
                    }
                }*/

                .img-wraper  {
                    img {
                        width:40px;
                    }
                }
                display: flex;
                justify-content: center;
                align-items: center;
                //visibility: visible;
                color: white;
                width: 100%;
                text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
                z-index: 2000;
                font-size: 1.5em;
                font-weight: bold;
                pointer-events: none;
                text-align: center;
                word-break: break-all;


                background: #0000007a;
                border-radius: 25px;
                border-top-right-radius: 0px;
                border-top-left-radius: 0;
                border: var(--swiper-slide-border) solid black;
                border-bottom-width: 0px;

                
            }
        }
        
    .loader-wraper {
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
.lazy-swiper-wraper {
    height: 408px !important;
    max-width: 99vw;
    margin: auto;
    @media all and (min-width: 1300px) and (max-width:1460px) { 
        height: 438px !important;
    }
    @media all and (min-width: 1460px)  { 
        height: 508px !important;
    }
    &.loaded:not(&.active) {
        //height: auto!important;
    }
}

    :global(.swiper-slide) {
        position: relative;
        &:hover {
            .img-title {
                visibility: visible;
                
            }    
        }
        .img-title {
                //display: none;
                visibility: hidden;
                color: white;
                width: 100%;
                text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
                z-index: 2000;
                font-size: 1.5em;
                font-weight: bold;
                pointer-events: none;
                text-align: center;
                word-break: break-word;

                position: absolute;
                top:0px;
                &.active {
                    visibility: visible;
                }
                //transform: translate(0, -100%);

                


                background: #0000007a;
                border-radius: 25px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0;
                border: var(--swiper-slide-border) solid black;
                border-bottom-width: 0px;

                &.active {
                    @include bg-gradient();
                }
            }
        .slide-content {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction:column;    
            overflow: visible;
            margin-top: 35px;
            //margin-bottom: 40px;;
            position: relative;
                @keyframes shine {
                    to {
                        background-position-x: -200%;
                    }
            }
            .img-wraper{
                //min-height: 200px;
                //min-width: 200px;
                background: rgb(170, 170, 170);
                background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                background: linear-gradient(110deg, rgb(197, 197, 197) 8%, rgb(207, 207, 207) 18%, rgb(197, 197, 197) 33%);
                border-radius: 5px;
                background-size: 200% 100%;
                animation: 1.5s shine linear infinite;

                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 100%;
                .product-image {
                    cursor: pointer;
                    border-top-width: 0px;
                    border: 2px solid black;
                    //border-bottom-width: 0px;
                    background: white;
                    background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);

                    width: 100%;
                    height: auto;
                    border-radius: 0px;
                }
            }

            
        }
    }
    :global(.swiper-slide-active) {
        .img-title {
                //display: block;
                visibility: visible;
        }
    }
    /*
        &.swiper-slide-active {
            .my-slick-slide {
                position: relative;
                .img-title {
                    border: 2px solid black;
                    border-bottom: 0px;

                    display: block !important;

                    position: absolute;
                color: white;
                width: 100%;
                text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
                z-index: 2000;
                -webkit-transform: translate(-50%, -100%);
                transform: translate(-50%, -100%);
                font-size: 2.5em;
                font-weight: bold;
                left: 50%;
                top: 0px;
                pointer-events: none;
                text-align: center;


                background: #0000007a;
                border-radius: 25px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0;
                border: var(--swiper-slide-border) solid black;
                border-bottom-width: 0px;
                }

                .product-image {
                    border-top: 0px;


                }
            }
        }

        .my-slick-slide {
            position: relative;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .like-btn {
                width: 100%;
                display: block;
                line-height: 40px;
                font-size: 1rem;
                font-weight: 700;
                text-decoration: none;
                border: 2px solid black;
                background: #0000007a;
                letter-spacing: 2px;
                text-align: center;
                position: relative;
                -webkit-transition: all .35s;
                transition: all .35s;
                color: white;
                border-radius: 25px;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-top-width: 0px;
            }


            .product-image {
                border-top-width: 0px;
            }

            .product-image {
                border: 2px solid black;
                //border-bottom-width: 0px;
                background: white;
                background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);

                width: 100%;
                height: auto;
                border-radius: 0px;

            }

            .img-title {
                display: none;
            }
        }
    }*/
</style>