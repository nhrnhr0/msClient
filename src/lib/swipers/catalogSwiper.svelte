
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
    import MyCountdown from "$lib/components/MyCountdown.svelte";

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
    import { Button } from "sveltestrap";

    // import Swiper core and required modules
    
    
    export let loaded_data;
    import {productModalStore, productCartModalStore, userInfoStore, singleAmountPopupStore, productQuestionModalStore, categoryModalStore, campainsStore} from './../../stores/stores';
import { onDestroy, onMount } from 'svelte';

//import { flyToCart } from '$lib/utils/js/flyToCart';

import { logStore } from './../../stores/logStore';
import { selectTextOnFocus } from '$lib/ui/inputActions';
import SvelteTooltip from 'svelte-tooltip';
import QuestionLabel from '$lib/components/questionLabel.svelte';
//import FaveBtn from '$lib/components/FaveBtn.svelte';
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
        console.log('====== toggle single amount popup');
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
                        }
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

                        
                    }else if(target.classList.contains('delete-btn-click-area')) {
                        // delete product from cart
                        let mslide = target.closest('.swiper-slide')
                        let pid = mslide.dataset.productId;
                        cartStore.removeFromCartById(pid);
                    }
                    else if(target.classList.contains('swiper-question-click-area')) {
                        //console.log('swiper question clicked');
                        
                        let mslide = target.closest('.swiper-slide');
                        let pid = mslide.dataset.productId;
                        let currentProduct = get_product_by_id(pid);
                        $productQuestionModalStore.toggleModal(currentProduct.id, currentProduct.title);
                    }
                    else if(target.classList.contains('read-more-btn') && dont_open_modal == false) {
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
                    }
                    else if(target.classList.contains('add-to-cart-btn')) {
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
                        }
                    }
                    else {
                        debugger;
                        console.log('unknown click');
                        console.log(target);
                        console.log(target.classList);
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
    function open_category_modal() {
        $categoryModalStore.toggleModal();
        $categoryModalStore.setAlbum(album);
    }
    function open_edit_amount_dialog(product_id) {
        //$productCartModalStore.set_product(product_id);
        $productCartModalStore.toggleModal(product_id);
        
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

    function background_click(e) {
        console.log('background_click: ', e);
        let classs = e.target.classList
        if(classs.contains('lazy-swiper-wraper') || classs.contains('swiper') || classs.contains('swiper-wrapper') || classs.contains('swiper-pagination')) {
            open_category_modal();
            return;
        }
        /*if(e.target.classList.contains('swiper-button-prev') || e.target.classList.contains('swiper-button-next')) {
            return;
        }else {
            
        }*/
    }
    function round(number, increment) {
        return Math.ceil((number) / increment ) * increment;
    }
    const inview_options = {
        rootMargin: '450px',
    }
    let active_hover = false;
    function clickable_category_mouse_leave(e) {
        active_hover = false;
    }
    function clickable_category_mouse_enter(e) {
        console.log(e.target);
        // swiper-wrapper, lazy-swiper-wraper, swiper
        if(e.target.classList.contains('swiper-wrapper') || e.target.classList.contains('lazy-swiper-wraper') || e.target.classList.contains('swiper') || e.target.classList.contains('swiper-pagination')) {
            active_hover = true;
        }else {
            active_hover = false;
        }
    }
    const show_prices = ($userInfoStore['me'] && Object.keys($userInfoStore['me']) != 0 && $userInfoStore['me'].show_prices == true)? true : false;
</script>
<div class="title-wraper" class:campain={album.is_campain}>
    <button class:active={active_hover} class="title btn"  on:click={open_category_modal(album)}>
        {album.title}

{#if album.is_campain}
  <MyCountdown date={$campainsStore.find(v => v.album.id == album.id)?.endTime}/>
{/if}

    </button>
</div>
<div class="lazy-swiper-wraper" on:focus="{clickable_category_mouse_enter}" on:mouseover="{clickable_category_mouse_enter}" on:blur="{clickable_category_mouse_enter}" on:mouseleave="{clickable_category_mouse_leave}"  on:click={(e)=>{background_click(e)}} class:active="{isInView}" class:loaded="{isLoaded}"
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
                navigation="{false}"
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
                        "750": {
                            "slidesPerView": 3.5,
                        },
                        "870": {
                            "slidesPerView": 3.7,
                        },
                        "960": {
                            "slidesPerView": 4,
                        },
                        "1020": {
                            "slidesPerView": 4,
                        },
                        "1400": {
                            "slidesPerView": 5,
                        }
                    }}'
                  pagination="{true}" 
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
                                        {#if image.out_of_stock}
                                            <img src="https://res.cloudinary.com/ms-global/image/upload/v1648713887/msAssets/pngfind.com-pubg-player-png-5352359_1_bepovk.png" class="sold-out-icon" alt="מלאי לא זמין"/>
                                        {/if}
                                        <!--
                                        <button class="swiper-star-btn" on:click={(e)=>{fave_list.addToFaveList(image.id)}}>
                                            <FaveIcon class="swiper-star" name={$fave_list.isInList(image.id) ? 'star-full': 'star'} />
                                        </button>
                                        -->
                                        <div class="question-wraper swiper-question-click-area">
                                            <SvelteTooltip tip="שאל על המוצר" left>
                                                <QuestionLabel class="swiper-question swiper-question-click-area" AllClassName={'swiper-question-click-area'} product_id={image.id} product_name={image.title} width='35px'  />
                                            </SvelteTooltip>
                                        </div>
                                        <img  class="product-image" data-catalog-id="{album.id}" data-product-id="{image.id}" src="{CLOUDINARY_URL}f_auto,w_auto/{image.cimage}" alt="{image.title}">
                                        <div class="price-tag" class:active={show_prices} >{image.client_price + '₪'}</div>
                                        <!--     <FaveBtn product_id={image.id}/>-->
                                    </div> 
                                </div>
                                
                                    {#if $cartStore[image.id] == undefined}
                                        <div class="like-btn like-btn-small">
                                            <button data-product-id={image.id} data-catalog-id={album.id} class="action-btn add-to-cart-btn">
                                                הוסף
                                            </button>
                                            <button data-product-id={image.id} data-catalog-id={album.id} class="action-btn read-more-btn">
                                                פרטים
                                            </button>
                                        </div>
                                        
                                    {:else}
                                    <div  class="like-btn-wraper" class:active={$cartStore[image.id] != undefined} data-product-id="{image.id}">

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
                                    </div>

                                    {/if}
                            <!--</div>-->
                        </SwiperSlide>
                    {/each}
                    
            </Swiper>
            
        <button on:click={(e)=>{mswiper.swiper().slideNext()}} class="nav-btn left">
            <img src="/arrow.svg" class="arrow arrow-left" alt="left arrow" />
        </button>
        <button on:click={(e)=>{mswiper.swiper().slidePrev()}} class="nav-btn right">
            <img src="/arrow.svg" class="arrow arrow-right" alt="right arrow"/>
        </button>
        {/if}
    <!--
        {/await}
        -->
{/if}
<!--</Lazy>-->
</div>
<style lang="scss">
    .sold-out-icon {
        position: absolute;
        z-index: 1;
        border: none;
        background: none;
        //transform: translate(-50%, 0);

        width: 140px;
        height: auto;
        top: 30px;
        right: 0px;
    }
    :global(.swiper-question-click-area) {
        cursor: pointer;
    }
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
        cursor: pointer;
        //padding-top: 60px;
        //padding-top: 93px;
        margin-top: 23px;
        margin-bottom: 0px;
        max-width: 85vw;
        :global(.default-tip) {
            
            transform: translate(0%, 15%);
        }
        :global(.swiper-button-next), :global(.swiper-button-prev) {
            &::after {
                font-family: ''!important;
                content: '';
            }
            transform: all 250ms ease-in-out;
            //position: absolute;
            //top: 100%;
            //transform: translateY(-50%);
            overflow: visible;
            
            //--swiper-navigation-size: 235px;
            &:hover {
                //--swiper-navigation-size: 270px;
                //--swiper-theme-color: #dd0e0e;
            }
        }
        :global(.swiper-button-prev) {
            /*background-image: url('/arrow.svg');
            border:1px solid red;
            background-size: contain;
            background-repeat: no-repeat;
            height: 78px;
            width: 78px;
            position: absolute;
            top: 100%;
            left: 0%;*/
            
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
            //cursor: pointer;
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
        .like-btn-small {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    * {
                        margin: 0;
                        width: 100%;
                        flex:1;
                        flex-grow: 1;
                        flex-shrink: 0;
                    }
                    .action-btn {
                        display: inline-block;
                        font-weight: 400;
                        line-height: 1.5;
                        color: #212529;
                        text-align: center;
                        text-decoration: none;
                        vertical-align: middle;
                        cursor: pointer;
                        user-select: none;
                        border: 1px solid transparent;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        border-radius: 0.25rem;
                        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        
                    }
                    
                }
        
    .loader-wraper {
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .title-wraper {
        margin-top: 60px;
  display: flex;
  justify-content: center;
  //padding-bottom: 50px;
  
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
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    &::before {
      content: 'לקטגוריית ';
      opacity: 1;
      font-size: 1.4rem;
    }

    &::after {
      content: ' לחץ כאן';
      opacity: 1;
      font-size: 1.4rem;
    }
    &:hover,&:focus, &.active {
      box-shadow: 0px 15px 20px black;
      transform: translateY(-7px);
      opacity: 0.8;
      //font-size: 2.2rem;
    }

    @media screen and (max-width: 685px) {
      &:before {
        content: 'לקטגוריית ';
        opacity: 1;
        font-size: 1.4rem;
      }
      &::after {
        content: ' לחץ כאן';
        opacity: 1;
        font-size: 1.4rem;
      }
    }
    @media screen and (max-width: 610px) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &::before, &::after {
        //flex:1;
        line-height: 0.8;
      }

    }
  /*@media screen and (max-width: 610px) {
      &:before {
        content: '';
        opacity: 1;
        font-size: 1.4rem;
      }
      &::after {
        content: '';
        opacity: 1;
        font-size: 1.4rem;
      }
    }*/
  }
  &.campain {
    
    .title {
      @media (min-width: 820px) {
          &::before {
          content: '';
          opacity: 1;
          font-size: 1.4rem;
        }

        &::after {
          content: '';
          opacity: 1;
          font-size: 1.4rem;
        }
      }
    }
  }
}
.lazy-swiper-wraper {
    cursor: pointer;
    //padding-top: 50px;
    position: relative;
    display: flex;
    height: 438px !important;
    max-width: 99vw;
    margin: auto;
    @media all and (min-width: 1300px) and (max-width:1460px) { 
        height: 498px !important;
    }
    @media all and (min-width: 1460px)  { 
        height: 568px !important;
    }
    &.loaded:not(&.active) {
        //height: auto!important;
    }

    .nav-btn {
        //display: none;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1;
        position: absolute;
        top: 35%;
        
        img {
            width: 75px;
            height: 75px;
        }
        &.left {
            border: 3px solid black;
            border-radius: 50%;
            left: 10px;
            
            transform: rotate(180deg)
        }
        
        &.right {
            border: 3px solid black;
            border-radius: 50%;
            right: 10px;
            
        } 
        &:hover {
            background: rgba(255, 255, 255, 0.678);
            border: 5px solid black;
            border-radius: 50%;
            &.left {
                transform: scale(1.1) rotate(180deg)
            }
            &.right {
                transform: scale(1.1)
            }
        }
        @media screen and (max-width: 1020px) {
            &.left {
                left: 1px;
            }
            &.right {
                right: 1px;
            }
        }
    
        
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