<script context="module">
import { browser } from '$app/env';

    import LogoSwiper from 'src/lib/swipers/logoSwiper.svelte';
import { my_fetch } from 'src/network/my_fetch';
import { indexdb_get_main_categories } from 'src/stores/dexie/api_wrapers';
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
        let main_categories = await indexdb_get_main_categories();
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
        display: flex;
        flex-wrap: wrap;                  
        justify-content: center;         
    }
    .category {
        
        background: rgb(43, 43, 43);
        color: white;
        padding: 5px;
        margin: 10px;
        box-sizing: border-box;           
        transition: all 0.5s ease-in-out;
        //@include bg-gradient();
        cursor: pointer;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        text-align: center;
        max-width:160px;// calc(100% * (1/4) - 10px - 1px);
        min-width: 160px;
        
        a {
            box-sizing:border-box; /*Don't forget this*/

            text-decoration: none;
            color: white;
            display: flex;
            flex-direction: column;
            & img {
                transition: all 0.5s ease-in-out;

                width: 150px;
                height: 150px;
                margin: auto;
                @media screen and (max-width: 600px) {
                    width: 100px;
                    height: 100px;
                    
                }
            }
            & span {
                //position: absolute;
                font-size: 20px;
                text-align: center;
                color: white;
                background-color: rgba(255, 255, 255, 0);
                font-weight: bold;
                font-size: 22px;
                transition: all 0.5s ease-in-out;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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

        @media screen and(max-width: 570px) {
            max-width: 120px;
            min-width: 120px;
            padding: 4px;
            margin:5px;
            & a span {
                font-size: 16px;
            }
        }
    }
</style>