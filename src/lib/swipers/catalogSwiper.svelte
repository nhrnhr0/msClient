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
    import SwiperCore, {
        EffectCoverflow,
        Pagination,
        Navigation
    } from 'swiper';
    import Spinner from 'svelte-spinner';
    import {cartStore} from './../../stores/cartStore'
    import LazyImage from 'svelte-lazy-image';


    // import Swiper core and required modules
    
    
    export let loaded_data;
    import {productModalStore, productCartModalStore, userInfoStore, singleAmountPopupStore} from './../../stores/stores';
import { onDestroy, onMount } from 'svelte';

//import { flyToCart } from '$lib/utils/js/flyToCart';

import { logStore } from './../../stores/logStore';
import { selectTextOnFocus } from '$lib/ui/inputActions';
import SvelteTooltip from 'svelte-tooltip';
import QuestionLabel from '$lib/components/questionLabel.svelte';
//import FaveIcon from '$lib/components/faveIcon.svelte';
//import { fave_list } from './../../stores/faveStore';

    

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
    function open_single_amount_dialog(product_id,product_title) {
        $singleAmountPopupStore.toggleModal(product_id, product_title);
    }
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
        E.stopPropagation();
        E.preventDefault();
        let dont_open_modal = false;
        // don't open the modal if the user use 2 fingers to zoom on slider
        for(let i = 0; i < E.detail[0].length;i++) {
            let item = E.detail[0][i];
            let len = item?.touches?.length || 0;
            if(len > 0) {
                dont_open_modal = true
            }
        }

        // handle clicks on add to cart and image
        if(typeof(E) == 'object') {
            let detail = E.detail[0];
            for(let i = 0; i < detail.length; i++) {
                let target = detail[i].target;
                //console.log('>> \t', target);
                debugger;
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
                            //flyToCart(target.parentElement.querySelector('.product-image'));
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
                            copySwiperduplicates(E);
                        } else {

                        }

                        if(currentProduct.show_sizes_popup) {
                                open_edit_amount_dialog(currentProduct.id);
                        }else {
                            open_single_amount_dialog(currentProduct.id, currentProduct.title);
                            /*
                            const selector = '#slider_amount_input_'+currentProduct.id;
                            const query = document.querySelectorAll(selector);
                            if(query.length == 0) {
                                setTimeout(()=> {
                                    const query2 = document.querySelectorAll(selector);
                                    if(query2.length > 0) {
                                        query2[0].focus();
                                    }
                                },5);
                            }else {
                                query[0].focus();
                            }*/

                        }
                    }else if(target.classList.contains('delete-btn-click-area')) {
                        // delete product from cart
                        debugger;
                        let mslide = target.closest('.swiper-slide')
                        let pid = mslide.dataset.productId;
                        cartStore.removeFromCartById(pid);
                    }
                    
                }
            }
        }
        

    }

    $: {
        if (mswiper) {
            fixDups();
        }
    }
    /*function swiperSlideClicked(catalogId, productId) {
        //console.log('swiperClicked2: ', catalogId, productId);
        $productModalStore.setProduct(catalogId, productId);
        $productModalStore.open();
    }*/

    function remove_from_cart(productId) {
        cartStore.removeFromCartById(productId);
    }
    function open_edit_amount_dialog(product_id) {
        $productCartModalStore.set_product(product_id);
        setTimeout(()=> {
            $productCartModalStore.toggleModal();
        }, 5);
    }
    export function update_swiper() {
        //TODO: update swipers
    }
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
    function validate_input_value_change(e, mod) {
            let num = parseInt(e.target.value);
            let newNum = round(num, mod, 0);
            e.target.value = newNum;
            console.log('validate_input_value_change: ', num, newNum);

        
    }
    function round(number, increment) {
        return Math.ceil((number) / increment ) * increment;
    }
    const inview_options = {
        rootMargin: '450px',
    }


    const show_prices = ($userInfoStore['me'] && Object.keys($userInfoStore['me']) != 0 && $userInfoStore['me'].show_prices == true)? true : false;
</script>
<div class="lazy-swiper-wraper" class:active="{isInView}" class:loaded="{isLoaded}"
use:inview="{inview_options}"

on:change={(event) => {
    const { inview, entry, scrollDirection, observe, unobserve } = event.detail;
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
                resizeReInit={true},
                effect="{'coverflow'}"
                centeredSlides="{true}"
                slidesPerView="{'5'}"
                observer="{true}"
                observeParents= "{true}"
                rebuildOnUpdate="{true}"
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
                        <SwiperSlide bind:this={slides[index]} data-product-id="{image.id}">
                            <!--TODO: use only one cart active on the top and not one in the title, like button and more -->
                                <div class="img-title" class:active={$cartStore[image.id] != undefined}>
                                    <div class="content">
                                        {image.title}
                                    </div>
                                    
                                </div>
                                <div class="slide-content" >
                                    <div class="img-wraper">
                                        <div class="delete-btn delete-btn-click-area" class:show={$cartStore[image.id] != undefined}>
                                            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="30px" height="30px" class="delete-btn-click-area"><path class="delete-btn-click-area" d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>
                                        </div>
                                        <!--
                                        <button class="swiper-star-btn" on:click={(e)=>{fave_list.addToFaveList(image.id)}}>
                                            <FaveIcon class="swiper-star" name={$fave_list.isInList(image.id) ? 'star-full': 'star'} />
                                        </button>
                                        -->
                                        <div class="question-wraper">
                                            <SvelteTooltip tip="שאל על המוצר" left>
                                                <QuestionLabel class="swiper-question" product_id={image.id} product_name={image.title} width='35px'  />
                                            </SvelteTooltip>
                                        </div>
                                        <img  class="product-image" data-catalog-id="{album.id}" data-product-id="{image.id}" src="{CLOUDINARY_URL}f_auto,w_auto/{image.cimage}" alt="{image.title}">
                                        <div class="price-tag" class:active={show_prices} >{image.client_price + '₪'}</div>
                                    </div> 
                                </div>
                                
                                <div  class="like-btn-wraper" class:active={$cartStore[image.id] != undefined} data-product-id="{image.id}">
                                    {#if $cartStore[image.id] == undefined}
                                        <div class="like-btn">
                                            <div class="img-wraper">
                                                <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
                                            </div>
                                            <div class="text">
                                                הוסף
                                            </div>
                                        </div>
                                    {:else}
                                        
                                        <div class="like-btn active">
                                            <div class="img-wraper">
                                                
                                            </div>
                                            <div class="text">
                                                    <span class="text">
                                                        
                                                        {#if $cartStore[image.id].show_sizes_popup}
                                                            <div class="sizes-popup-btn">
                                                                <div class="amount">
                                                                    {$cartStore[image.id].amount}
                                                                </div>
                                                                <div class="sizes-popup-pre-text">
                                                                    לחץ לבחירת מידות
                                                                </div>
                                                            </div>
                                                        {:else}
                                                            <div class="amount-input-wraper">
                                                                <div class="amount-input-pre-text">
                                                                    כמות בסל:
                                                                </div>
                                                                <input type="number" id="slider_amount_input_{image.id}" disabled class="cart-amount" use:selectTextOnFocus bind:value="{$cartStore[image.id].amount}" min="1" max="9999"  data-product-id="{image.id}">
                                                            </div>
                                                        {/if}
                                                    </span>
                                            </div>
                                        </div>
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
    :global(.question-wraper) {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
    }
    :global(.swiper-question) {
        
        &:hover {
            cursor: pointer;
            background-color: rgba(87, 87, 87, 0.3);
        }
    }
    .swiper-star-btn{
        background:none;
        border: none;
        position: absolute;
        top: 10px;
        right: 5px;
    }
    :global(.swiper-star) {
        z-index: 1;
        border:1px solid blue;
        &.active {

            
        }
    }
    :global(.swiper) {
        :global(.default-tip) {
            
            transform: translate(0%, 15%);
        }
        :global(.swiper-button-next), :global(.swiper-button-prev) {
            transform: all 250ms ease-in-out;
            position: absolute;
            top: 100%;
            transform: translateY(-50%);
            overflow: visible;
            border-radius: 50%;
            
            &:hover {
                --swiper-navigation-size: 99px!important;
            }
        }
        :global(.swiper-button-next) {
            left: 80px;
        }
        :global(.swiper-button-prev) {
            right: 80px;
        }
    }
    :global(.swiper-wrapper) {
        margin-bottom: 50px;
    }
    :global(.swiper-pagination-bullets) {
        bottom: 24px;
    }
    /*.swiper-slide[data-is-in-cart="false"] {
        .img-title {
            .delete-btn {
                display: none;
            }
        }
    }*/
        .like-btn-wraper {
            cursor: pointer;
            width:100%;
            .like-btn {
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
                &.active {
                    .img-wraper {
                        .delete-btn {
                            background: none;
                            border: none;
                        }
                    }
                    width: 100%;
                    @include bg-gradient();
                    div.text {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        span.text {
                            width: 100%;
                            .sizes-popup-btn {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-size: large;
                                width: 100%;
                                height: 45px;
                                .sizes-popup-pre-text {
                                    display: inline-block;
                                    flex-grow: 1;
                                    flex:1;
                                }
                                .amount {
                                    display: inline;
                                    padding-right: 5%;
                                    padding-top: 8px;
                                    position: relative;
                                    &::before {
                                        content: "כמות בסל: ";
                                        position: absolute;
                                        left: 0;
                                        top: 0;

                                        width: 100px;
                                        
                                        transform: translate(-50%, -50%);
                                    }
                                }
                            }

                            /*input.cart-amount {
                                background: none;
                                border: none;
                                text-align: center;
                            }*/
                            .amount-input-wraper {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 100%;
                                height: 45px;
                                .amount-input-pre-text {
                                    display: inline-block;
                                    flex-grow: 1;
                                    flex:1;
                                }
                                input.cart-amount {
                                    background: none;
                                    border: none;
                                    text-align: center;
                                    border: 1px solid #777;
                                    margin-bottom: 10px;
                                    border-radius: 25px;
                                    margin-top: 10px;

                                }
                            }
                        }
                    }
                }

                .img-wraper  {
                    img {
                        width:40px;
                    }

                }
                

                
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
:global(.swiper-slide-prev .slide-content .img-wraper .price-tag) {
    left: 30px !important;;
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
                color: white;

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
                .delete-btn {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    z-index: 1;
                    border: none;
                    background: none;
                    display: none;
                    &.show {
                        display: block;
                        &:hover {
                            svg {
                                fill: red;
                            }
                        }
                    }
                    
                }
                
                .price-tag {
                    position: absolute;
                    bottom: 5px;
                    left:5px;
                    padding: 5px;
                    font-weight: bold;
                    border-radius: 25px;
                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                    display: none;
                    font-size: x-large;
                    color: black;
                    &.active {
                        display: block;
                    }
                }
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