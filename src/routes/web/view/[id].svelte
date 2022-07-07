<script context="module">
import { browser } from "$app/env";
import { CLOUDINARY_URL } from "src/api/consts";
import { session_get_main_categories } from "src/stores/sessionStorageApi";
import {page} from '$app/stores';

    export async function load({ fetch, page, session, contex}) {
        if (browser) {
            console.log(`browser ${page.path} load`);
        }else {
            console.log(`server ${page.path} load`);
        }
        let main_categories = await session_get_main_categories();
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

    export let main_categories = [];
</script>
<Swiper
    class="categories-swiper"
    slidesPerView={'5.7'}
    spaceBetween={10}
    loop="{false}"
    speed= "{1000}"
    allowTouchMove="{true}"
    preventClicks="{false}"
    resistanceRatio="{0.65}"
    navigation="{true}"
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
<div class="spacer"></div>
<style lang="scss">
    .spacer {
        height: 500px;
    }
      :global(.categories-swiper) {
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