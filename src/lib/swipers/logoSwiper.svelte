
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
    <div class="logos-wraper">
    <h2 class="slider-title">בין לקוחותינו</h2>
    <div class="logo-section">
        <Swiper class="logo-swiper"
                slidesPerView="{'auto'}"
                
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
                centeredSlides="{true}"
                pagination="{false}" 
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
    </div>
    {:else}
    error
    {/if}

    <style lang="scss">
        .logos-wraper {
            /*background: rgba(182, 181, 181, 0.527);
            border-radius: 25px;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);*/
            margin-left: 25px;
            margin-right: 25px;
            :global(.logo-swiper) {
                padding-top: 0px!important;
                width: fit-content;
                max-width: 90vw!important;
                :global(.swiper-slide) {
                    width: fit-content;
                    :global(.img-wraper)  {
                        
                    }
                }
                @media screen and (max-width:840px) {
                    :global(.swiper-slide) {
                        :global(.img-wraper)  {
                            :global(img) {
                                height: 75px;
                            }
                        }
                    }
                }
            }
            .slider-title {
                //text-decoration: underline;
                font-size: 2.1rem;
                text-align: center;
                margin-top: 30px;
                //background-color: #f5f5f5;
            }
            .img-wraper {
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    height: 100px;
                    max-width: 100%;
                }
            }
        }
    </style>