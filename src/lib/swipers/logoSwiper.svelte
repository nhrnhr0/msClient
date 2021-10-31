
<script>
    export let logos;
    import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';

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
                slidesPerView="{'5'}"
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
                                <img alt="{logo.title}" src="{logo.cimg}">
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
                height: 200px;
                max-width: 100%;
            }
        }
    </style>