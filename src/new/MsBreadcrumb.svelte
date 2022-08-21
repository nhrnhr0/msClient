

<script>
    import {page} from '$app/stores';
    export let page_info;
import { get_topLevelCategories } from 'src/stores/sessionStorage/topLevelCategories';
    let breadcrumb_array = []; // array of breadcrumb items {title, url}
    $: {
        $page;
        reset_breadcrumb();
    }
    const BASE_MAIN_URL = '/main'
    async function reset_breadcrumb() {
        /*let slimInfoPromise = undefined;
        if($page.query.get('product_id')) {
            slimInfoPromise = find_or_get_slim_product_by_id($page.query.get('product_id'));
        }*/
        let new_breadcrumb_array = [{
            title: 'דף הבית',
            url: '/',
        }];
        breadcrumb_array = [];
        let top_category_slug= undefined;
        if($page.query.get('top')) {
            let categories = await get_topLevelCategories();
            categories.forEach(category => {
                if(category.slug == $page.query.get('top')) {
                    new_breadcrumb_array.push({
                        title: category.name,
                        url: BASE_MAIN_URL + '?top=' + category.slug
                    });
                    top_category_slug = category.slug;
                }
            });
            if(top_category_slug == undefined) {
                if($page.query.get('top') == 'new') {
                    new_breadcrumb_array.push({
                        title: 'חדשים',
                        url: BASE_MAIN_URL + '?top=new'
                    });
                    top_category_slug = 'new';
                }else if($page.query.get('top') == 'campaigns') {
                    new_breadcrumb_array.push({
                        title: 'מבצעים',
                        url: BASE_MAIN_URL + '?top=campaigns'
                    });
                    top_category_slug = 'campaigns';
                }
            }
            let album_slug= undefined;
            if($page.query.get('album')) {
                
                page_info.top_albums.forEach(album => {
                    if(album.slug == $page.query.get('album')) {
                        new_breadcrumb_array.push({
                            title: album.title,
                            url: BASE_MAIN_URL + '?top=' + top_category_slug + '&album=' + album.slug
                        });
                        album_slug = album.slug;
                    }
                }
                );
            }

            
                
                if($page.query.get('product_id')) {
                    //let product = page_info
                    let url = BASE_MAIN_URL + '?top=' + top_category_slug + '&product_id=' + page_info.productInfo.id;
                    if(album_slug) {
                        url += '&album=' + album_slug;
                    }
                    new_breadcrumb_array.push({
                        title: page_info.productInfo.title,
                        url: url
                    });
                }
        }
        
        breadcrumb_array = [...new_breadcrumb_array];
    }
</script>
<ul>
{#each breadcrumb_array as item, index }
    <li>
        <a href="{item.url}" class:active={index == breadcrumb_array.length - 1} >
            {item.title}
        </a>
        {#if index < breadcrumb_array.length - 1}
    <span>
                >>
            </span>
        {/if}
    </li>
{:else}
{/each}
</ul>
<style lang="scss">
    ul {
        list-style: none;
        padding: 0;
        margin-bottom: 0px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        li {
            display: inline-block;
            //margin-right: 10px;
            // not first
            padding-left: 3px;
            padding-right: 3px;
            width:fit-content;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            a {
                white-space: nowrap;
            }
            a.active {
                color: #000;
                text-decoration: none;
                pointer-events: none;
            }
        }
    }
    
    
</style>