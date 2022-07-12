<script context="module">
    import { browser } from "$app/env";
    import { CLOUDINARY_URL } from "src/api/consts";
    import {page} from '$app/stores';
    import TopCategories from "src/lib/components/web/view/TopCategories.svelte";
import { indexdb_get_main_categories } from "src/stores/dexie/api_wrapers";
import SideCategoeis from "src/lib/components/web/view/SideCategoeis.svelte";
import { get_albums } from "src/data/albums";
import { onMount } from "svelte";
    
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
    export let main_categories = [];
    let side_categories = null;
    let current_category = null;
    let last_id = $page.params.id;
    /*onMount(async () => {
        console.log('onMount'); 
            resetSideCategories();
    });*/
        $: {
            console.log('$:');
            console.log('last_id', last_id);
            console.log('$page.params.id', $page.params.id);
            console.log('side_categories', side_categories);
            if (last_id != $page.params.id || !side_categories) {
                resetSideCategories();
                last_id = $page.params.id;
            }
        }

        function resetSideCategories() {
            current_category = main_categories.filter(category => category.id.toString() === $page.params.id.toString())[0];
            let album_ids = current_category.albums;
            side_categories = get_albums(album_ids);
            console.log('resetSideCategories');
        }
</script>

<main>
    <TopCategories categories={main_categories} />
    <div class="my-row">
        <SideCategoeis categories_promise={side_categories} />      
        <!--
        <div class="side-categories">
            
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
                <div class="item">
                    <div class="icon"><img src="https://res.cloudinary.com/ms-global/image/upload/v1635672418/site/products/%D7%93%D7%91%D7%A7_3_%D7%A9%D7%A0%D7%99%D7%95%D7%AA_12_%D7%99%D7%97%D7%99%D7%93%D7%95%D7%AA_%D7%91%D7%93%D7%A3-removebg-preview_U5SNW32_3UO8HVU.png" alt=""></div>
                    <div class="text">
                        ביגוד וטקסטיל
                    </div>
                </div>
        </div>
        -->

        <slot/>
    </div>
</main>
<style lang="scss">
    :global(#main_wraper) {
            height: 100vh;
        }
    main {
        height: 100%;
        .my-row {
            display: flex;
        }
        /*.side-categories {
            background-color: #ccc;
            max-width: 255px;

            max-height: calc(100% - 50px);
            overflow: scroll;
            margin-right: 10px;
            border-radius: 5px;
            &::-webkit-scrollbar {
                //width: 5px;
            }
            .item {
                height: auto;
                background-color: #fff;
                border-bottom: 1px solid #ccc;
                padding: 15px;
                margin: 8px;
                display: flex;
                justify-content: start;
                align-items: center;
                .icon {
                    width: 20px;
                    height: 20px;
                    background-color: #ccc;
                    border-radius: 50%;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    margin-right: 10px;
                    
                }
            }
        }*/
        
        
    }
</style>