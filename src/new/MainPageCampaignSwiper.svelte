<script>
import { BASE_URL } from "src/api/consts";
import { my_fetch } from "src/network/my_fetch";
import { CLOUDINARY_URL } from "src/api/consts";

import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';
    
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
import PriceTag from "./priceTag.svelte";
import { onMount } from "svelte";
import { inview } from 'svelte-inview';

  let isInView;
  const options = {
    rootMargin: '500px',
    unobserveOnEnter: true,
  };
  const handleChange = ({ detail }) => {
    isInView = detail.inView;
    if(isInView){
        console.log("inview");
        first_in_view = true;
    }
  };

  $: {
    if(first_in_view) {
        fetch_campain();
    }
  }
    




SwiperCore.use([EffectCoverflow, Pagination,Navigation]);

    function swiper_clicked() {
        console.log("swiper clicked");
    }
    export let campain;
    let album_href;
    let images = undefined;
    let first_in_view = false;
    function fetch_campain() {
        debugger;
        let url = BASE_URL + '/my-api/get-album-images?album=' + campain.slug;
                debugger;
            my_fetch(url).then(response => {
                debugger;
                response.json().then(data => {
                    
                debugger;
                    images = data.results;
                });
            });
    }
    onMount(async ()=> {
        album_href = `/main?top=campaigns&album=${campain.slug}`;
    });
    
</script>
    <div class="category" use:inview="{options}" on:change="{handleChange}">
        <a href="{album_href}" class="category-title">
            <img class="category-img" src="{CLOUDINARY_URL}{campain.cimage}" alt="{campain.name}">
            {campain.name}
            <img class="category-img category-img-2" src="{CLOUDINARY_URL}{campain.cimage}" alt="{campain.title}">
        </a>
        
        {#if images}
<Swiper
        
        resizeReInit={true},
        effect="{'coverflow'}"
        centeredSlides="{true}"
        observer="{true}"
        observeParents= "{true}"
        rebuildOnUpdate="{true}"
        speed= "{50}"
        loop= "{true}"
        navigation="{true}"
        allowTouchMove="{true}"
        preventClicks="{false}"
        on:click={swiper_clicked}
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
                    "slidesPerView": 1.3,
                },
                "395": {
                    "slidesPerView": 1.5,
                },
                "440": {
                    "slidesPerView": 1.7,
                },
                "500": {
                    "slidesPerView": 2,
                },
                "600": {
                    "slidesPerView": 2.5,
                },
                "750": {
                    "slidesPerView": 3,
                },
                "870": {
                    "slidesPerView": 3,
                },
                "960": {
                    "slidesPerView": 3.5,
                },
                "1120": {
                    "slidesPerView": 4,
                },
                "1400": {
                    "slidesPerView": 5,
                }
            }}'
          pagination="{true}" 
        >
                {#each images as image}
                    <SwiperSlide data-product-id={image.id} data-href={album_href + '&product_id=' + image.id}>
                        <div class="product">
                            <div class="product-image">
                                <PriceTag price={image.price} new_price={image.new_price} top={'5px'} left={'10px'}/>
                                <img src="{CLOUDINARY_URL}{image.cimage}" alt="{image.title}">
                            </div>
                            <div class="product-title">{image.title}</div>
                            
                        </div>
                    </SwiperSlide>
                {/each}
    </Swiper>
    {/if}
</div>

<style lang="scss">
    .category {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;

        .category-title {
                display: flex;
                justify-content: center;
                padding: 5px 10px;
                width: 80%;
                margin:15px auto 15px auto;
                z-index: 1;
                font-size: 1.8em;
                font-weight: bold;
                text-align: center;
                word-break: break-word;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
                background: #ececece7;
                border-radius: 25px;
                color: black;
                transition: all 0.1s ease-in-out;
                &::before {
                    content: 'לקטגוריית\00a0 ';
                    display: none;
                }
                &::after {
                    content: '\00a0 לחץ כאן';
                    display: none;
                }
                &:hover {
                        background-color: #ececec4d;
                        &::after, &::before {
                            display: inline;
                            
                        }
                        //color: #fff;
                }

                .category-img {
                    width: auto;
                    height: 50px;
                    
                    object-fit: cover;
                    border-radius: 25px;
                }
                .category-img-2 {
                    //mirror image
                    transform: scaleX(-1);
                }
                
        }

        :global(.swiper) {
            width: 100%;
            :global(.swiper-wrapper) {
                :global(.swiper-slide) {
                    :global(.product) {
                        
                            display: flex;
                            flex-direction: column-reverse;
                            align-items: center;
                            text-decoration: none;
                            color: var(--color-1);
                            position: relative;
                            :global(.product-image) {
                                position: relative;
                                
                                cursor: pointer;
                                    border-top-width: 0px;
                                    border: 2px solid black;
                                    border-top: none;
                                    //border-bottom-width: 0px;
                                    background: white;
                                    background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                                :global(img) {

                                    width: 100%;
                                    height: auto;
                                    border-radius: 0px;
                                    &:hover {
                                        transform: scale(1.05) translateY(-5px);
                                        filter: brightness(1.1);
                                        transition: all 0.2s ease-in-out;

                                        //border-bottom-width: 0px;
                                    }
                                }
                            }
                            :global(.product-title) {
                                margin-top: 10px;
                                font-size: 14px;
                                font-weight: bold;
                                background: white;
                                background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                                padding: 5px;
                                border-radius: 0px;
                                width: 100%;
                                text-align: center;
                                border:2px solid black;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                width:100%;
                                white-space: nowrap;
                            }
                            :global(.product-price) {
                                position: absolute;
                                margin-top: 10px;
                                font-size: 14px;
                                font-weight: bold;
                                background: white;
                                background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                                padding: 5px;
                                bottom: 20px;
                                left:20px;
                                :global(.new-price) {
                                    color: var(--color-1);
                                }
                                :global(.old-price) {
                                    color: var(--color-2);
                                    text-decoration: line-through;
                                }
                                :global(.price) {
                                    color: var(--color-1);
                                }
                            }
                        
                    }
                }
            }
        }
    }
</style>