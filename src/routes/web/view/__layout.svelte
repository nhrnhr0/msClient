<script context="module">
    import { browser } from "$app/env";
    import { CLOUDINARY_URL } from "src/api/consts";
    import {page} from '$app/stores';
    
    export async function load({ fetch, page, session, contex}) {
    if (browser) {
        console.log(`browser ${page.path} load`);
    }else {
        console.log(`server ${page.path} load`);
    }
    let main_categories = await indexdb_get_main_categories();
    return {
        props: {
            main_categories,
        }
    };
}
</script>
<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';
import { indexdb_get_main_categories } from "src/stores/dexie/api_wrapers";

    export let main_categories = [];
</script>

<Swiper
    class="categories-swiper"
    slidesPerView={'5.7'}
    spaceBetween={10}
    loop="{false}"
    speed= "{150}"
    allowTouchMove="{true}"
    preventClicks="{false}"
    resistanceRatio="{0.45}"
    navigation="{true}"
    breakpoints='{{
        "270": {
            slidesPerView: "2.2",
            spaceBetween: 10,
        },
        "400": {
            slidesPerView: "2.7",
            spaceBetween: 10,
        },
        "500": {
            slidesPerView: "3.2",
            spaceBetween: 10,
        },
        "600": {
            slidesPerView: "3.7",
            spaceBetween: 10,
        },
        "700": {
            slidesPerView: "4.2",
            spaceBetween: 10,
        },
        "800": {
            slidesPerView: "4.7",
            spaceBetween: 10,
        },
        "900": {
            slidesPerView: "5.2",
            spaceBetween: 10,
        },
    }}'
    >
    {#each main_categories as category}
        <SwiperSlide>
            <div class="category">
                <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                <div>{category.name}</div>
            </div>
        </SwiperSlide>
    {/each}
</Swiper>

<slot/>

<style lang="scss">
    :global(#main_wraper) {
        height: 100vh;
    }
    :global(.swiper.categories-swiper) {
        width: 100%;
        padding-left: 2px;
        padding-right: 2px;
        
        :global(.swiper-button-disabled) {
            display: none;
        }
        :global(.swiper-wrapper) {
            max-height: 65px;
            :global(.swiper-slide) {
                
                :global(.category) {
                    background-color: #eee;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    border: 1px solid #ccc;
                    width: 100%;
                    height: 100%;
                    img {
                        justify-self: flex-start;
                        width: 40px;
                        height: 40px;
                    }
                    div {
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
</style>