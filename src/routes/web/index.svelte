<script context="module">
import { browser } from '$app/env';

    import LogoSwiper from 'src/lib/swipers/logoSwiper.svelte';
import { my_fetch } from 'src/network/my_fetch';
import { session_get_main_categories } from 'src/stores/sessionStorageApi';
    import {CLOUDINARY_URL, LOGOS_API_URL} from './../../api/consts';
    // function load
    // get the logos
    export async function load({ fetch, page, session, contex}) {
        if (browser) {
            console.log('browser web/index load');

        }else {
            console.log('server web/index load');
        }

        let response = await my_fetch(LOGOS_API_URL, {
            method: 'GET',
        }, fetch);  
        let logos = await response.json();
        let main_categories = await session_get_main_categories();
        return {
            props: {
                logos,
                main_categories,
            }
        };
        
    }
    
    
</script>
<script>
    export let logos = [];
    export let main_categories = [];
</script>
<LogoSwiper logos={logos} />

<!--
    grid of 4 main categories with the image and the name
    each category has a link to the category page
--> 
<div class="categories">
    {#each main_categories as category}
        <div class="category">
            <a href="web/view/{category.id}/">
                <img src="{CLOUDINARY_URL}{category.get_image}" alt="{category.name}">
                <span>{category.name}</span>
            </a>
        </div>
    {/each}
</div>

<style lang="scss">
    .categories {
        /*display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;
        margin-top: 20px;*/
        display: flex;
        flex-wrap: wrap;                  /*  allow items to wrap  */
        justify-content: center;          /*  horizontally center items  */
    }
    .category {
        //width: calc(100% * (1/4) - 10px - 1px);
        // flex:1;
        // flex-grow: 0;
        // flex-shrink: 1;
        // display: flex;
        // flex-direction: row;
        // align-items: center;
        // justify-content: center;
        // text-align: center;
        // position: relative;
        flex-basis: calc(25% - 30px); /*  subtract the margin from the width  */
        background: rgb(43, 43, 43);
        color: white;
        padding: 5px;
        margin: 10px;
        box-sizing: border-box;           /*  make padding be included in the set width  */
        transition: all 0.5s ease-in-out;
        //@include bg-gradient();
        cursor: pointer;
        a {
            text-decoration: none;
            color: white;
            display: flex;
            flex-direction: column;
            & img {
                transition: all 0.5s ease-in-out;

                width: 150px;
                height: 150px;
                margin: auto;
            }
            & span {
                //position: absolute;
                font-size: 20px;
                text-align: center;
                color: white;
                background-color: rgba(255, 255, 255, 0);
                font-weight: bold;
                font-size: 22px;
            }
        }
        &:hover, &:focus {
            
            background: rgb(43, 43, 43);
            color: white;
            a {
                color: white;
                & img {
                    transform: scale(1.1);
                    filter: brightness(0.8);
                }
                & span {
                    background-color: rgb(255, 255, 255);
                    color: black;
                }
            }
        }
    }
</style>