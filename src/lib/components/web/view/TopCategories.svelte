<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';
    import { CLOUDINARY_URL } from 'src/api/consts';
    import {page} from '$app/stores';

    export let categories = [];
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
            {#each categories as category}
                <SwiperSlide>
                    <a href="/web/view/{category.id}" class="category" class:active={category.id == $page.params.id}>
                        <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                        <div>{category.name}</div>
                    </a>
                </SwiperSlide>
            {/each}
    </Swiper>
<style lang="scss">
    :global(.swiper.categories-swiper) {
            width: 95%;
            padding-left: 2px;
            padding-right: 2px;
            padding-bottom: 8px;
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
                        transition: all 0.2s ease-in-out;
                        :global(img) {
                            justify-self: flex-start;
                            width: 40px;
                            height: 40px;
                        }
                        :global(div) {
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        &.active {
                            background-color: rgb(85, 85, 85);
                            color:white;
                        }
                    }
                }
            }
        }
</style>