<script export="module">
    import Lazy from 'svelte-lazy';
    import {STATIC_BASE} from '../../api/consts'

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
    import "swiper/css/navigation"

    // import Swiper core and required modules
    import SwiperCore, {
        EffectCoverflow,
        Pagination,
        Navigation
    } from 'swiper';
    import Spinner from 'svelte-spinner';
    import {productModalStore} from './../../stores/stores'
import { onMount } from 'svelte';

    // install Swiper modules
    SwiperCore.use([EffectCoverflow, Pagination,Navigation]);
    //let data = get_album_details(album.id);
    let data = get_album_details(album.id);

    onMount(()=> {
        window.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('.product-image').addEventListener("click", function(event) {
                console.log(event.target);
            });
        });
    })
    
    function swiperClicked(e) {
        e.preventDefault();
        console.log('swiperClicked: ', e);        
        for (let i = 0; i < e.detail[0].length; i++) {
            let event = e.detail[0][i];
            if (event['target'] && event['target'].classList.contains('product-image')) {
                $productModalStore.setProduct(event['target'].dataset.catalogId, event['target'].dataset.productId);
                $productModalStore.open();
            }
        }
    }

    function swiperClicked2(catalogId, productId) {
        console.log('swiperClicked2: ', catalogId, productId);
    }
</script>
<Lazy height={500}>
        {#await data}
                <Spinner
                size="200"
                speed="750"
                color="#A82124"
                thickness="2"
                gap="40"
            />
        {:then d} 
                <Swiper
                effect="{'coverflow'}"
                centeredSlides="{true}"
                slidesPerView="{'5'}"
                loopedSlides="{'8'}"
                speed= "{125}"
                loop= "{true}"
                threshold="50px"
                allowTouchMove="{true}"
                preventClicks="{false}"

                coverflowEffect='{{
                    "rotate": -13,
                    "stretch": 10,
                    "depth": 100,
                    "modifier": 1,
                    "slideShadows": false
                  }}'
                  pagination="{true}" 
                  navigation="{true}"
                >
                    {#each d as image}
                        <SwiperSlide>
                            <div class="slide-content">
                                <div class="img-title">
                                        {image.title}
                                </div>
                                    <div class="img-wraper" >
                                        <img  class="product-image" on:click="{swiperClicked2(album.id, image.id)}" data-catalog-id="{album.id}" data-product-id="{image.id}" src="{STATIC_BASE}{image.image}" alt="{image.title}">
                                    </div>
                                <button class="like-btn">הוסף</button>
                            </div>
                        </SwiperSlide>
                    {/each}
              </Swiper>
        {/await}
</Lazy>

<style lang="scss">
    :global(.swiper-slide) {
        
        .slide-content {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction:column;    
            overflow: visible;
            margin-top: 70px;
            margin-bottom: 40px;;
            position: relative;
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
                transform: translate(0, -100%);

                


                background: #0000007a;
                border-radius: 25px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0;
                border: var(--swiper-slide-border) solid black;
                border-bottom-width: 0px;
            }
            .product-image {
                border-top-width: 0px;
                border: 2px solid black;
                //border-bottom-width: 0px;
                background: white;
                background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);

                width: 100%;
                height: auto;
                border-radius: 0px;
            }

            .like-btn {
                visibility: visible;
                color: white;
                width: 100%;
                text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
                z-index: 2000;
                font-size: 2.5em;
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
    }
    :global(.swiper-slide-active) {
        .slide-content {
            .img-title {
                //display: block;
                visibility: visible;

                
            }
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