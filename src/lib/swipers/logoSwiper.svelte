
<script>
    export let logos;
    import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';
    import {CLOUDINARY_URL} from './../../api/consts'

    // Import Swiper styles
    import 'swiper/css';
    import "swiper/css/effect-coverflow"
    import "swiper/css/pagination"
    import "swiper/css/navigation";
    import SwiperCore, {
        Autoplay,
        EffectCoverflow,
        Pagination,
        Navigation
    } from 'swiper';
        // install Swiper modules
        SwiperCore.use([Autoplay, EffectCoverflow, Pagination,Navigation]);
</script>
    {#if logos}
    <div class="logo-section">
        <Swiper
                slidesPerView="{'7'}"
                breakpoints='{{
                    "220": {
                        "slidesPerView":2,
                    },
                    "400": {
                        "slidesPerView": 3.5,
                    },
                    "600": {
                        "slidesPerView": 4,
                    },
                    "820": {
                        "slidesPerView": 5,
                    },
                    "960": {
                        "slidesPerView": 6,
                    },
                    "1100": {
                        "slidesPerView": 7,
                    }
                }}'
                autoplay='{{
                    "delay": 50,
                    "disableOnInteraction": false
                  }}'
                  spaceBetween="{30}" 
                speed= "{2500}"
                loop= "{true}"
                allowTouchMove="{true}"
                preventClicks="{false}"
                observer="{true}"
                
                pagination="{true}" 
                navigation="{false}"
                
                >
                    {#each logos as logo}
                        <SwiperSlide>
                            <div class="img-wraper">
                                <img height="100px" width="auto" alt="{logo.title}" src="{CLOUDINARY_URL}f_auto,w_auto,h_100/{logo.cimg}">
                            </div>
                        </SwiperSlide>
                    {/each}
            </Swiper>
        </div>
    {:else}
    error
    {/if}

    <style lang="scss">
        .img-wraper {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                height: 100px;
                max-width: 100%;
            }
        }
    </style>