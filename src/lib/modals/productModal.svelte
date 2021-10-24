<script>
    import {
        get_album_details
    } from './../../api/api';
    import SvelteMarkdown from 'svelte-markdown'


    export let _open = false;
    export const toggle = () => (_open = !_open);
    export const open = () => (_open = true);
    export const close = () => (_open = false);
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader
    } from 'sveltestrap';
    import {
        writable
    } from 'svelte/store';

    import {
        albumsJsonStore,
        categoryModalStore,
        colorsJsonStore,
        sizesJsonStore
    } from './../../stores/stores'

    import {
        STATIC_BASE
    } from './../../api/consts'
    let productData = writable();
    let current_album = writable();
    let all_products_in_category;
    let colorMarkup = '';
    let sizeMarkup = '';
    
    export function setProduct(catalogId, productId) {
        // find album data from id:

        current_album.set($albumsJsonStore.filter((val) => {
            return val.id == catalogId;
        })[0]);


        let productsPromise = get_album_details(catalogId);
        productsPromise.then((v) => {
            all_products_in_category = v;
            for (let i = 0; i < v.length; i++) {
                if (v[i].id == productId) {
                    productData.set(v[i]);
                    break;
                }
            }
        });
    }

    function nextClick() {
        for(let i = 0; i < all_products_in_category.length; i++) {
            if(all_products_in_category[i].id === $productData.id) {
                let newIndex= ((i+1)%all_products_in_category.length);
                console.log('setting new product: ', $current_album.id, all_products_in_category[newIndex].id);
                setProduct($current_album.id, all_products_in_category[newIndex].id);
                break;
            }
        }
    }

    function prevClick() {
        for(let i = 0; i < all_products_in_category.length; i++) {
            if(all_products_in_category[i].id === $productData.id) {
                let newIndex= (i-1);
                newIndex = newIndex >= 0? newIndex: all_products_in_category.length-1;
                console.log('setting new product: ', $current_album.id, all_products_in_category[newIndex].id);
                setProduct($current_album.id, all_products_in_category[newIndex].id);
                break;
            }
        }
    }

    function open_category() {
        $categoryModalStore.setAlbum($current_album);
        $categoryModalStore.toggleModal();
        close();
    }

    productData.subscribe((data) => {
            colorMarkup = '';
            sizeMarkup = '';
            if (data == undefined) {
                return;
            }
            for (var i = 0; i < data.colors.length; i++) {
                var col_id = data.colors[i];
                var col = $colorsJsonStore[col_id];
                colorMarkup +=
                    `<div class="color-box" title="${col.name}" alt="${col.name}" style="background:${col.color};"></div>`;
            }

            for (var i = 0; i < data.sizes.length; i++) {
                var size_id = data.sizes[i];
                var size = $sizesJsonStore[size_id];
                sizeMarkup += `<div class="size-box">${size.size}</div>`;
            }

            console.log('new sizeMarkup: ', sizeMarkup);
            console.log('new colorMarkup: ', colorMarkup);
        });



</script>
<div class="productModalWraper">
    <Modal id="productModal" isOpen={_open} {toggle}>
        {#if $productData }
            <ModalHeader {toggle}>
                <button id="category-open-btn-{$current_album.id}" on:click={open_category}
                    class="title btn btn-outline-dark">{$current_album.title}
                </button>
            </ModalHeader>
            <ModalBody>
                
                <div class="inner-body">

                    <div class="product-detail">
                        <div class="product-title">{$productData.title}</div>
                        <hr>
                        <div class="product-properties">
                            <div class="product-color-wraper">
                                <div class="product-color">{@html colorMarkup}</div>
                            </div>
                            <div class="product-size-wraper">
                                <div class="product-size">{@html sizeMarkup}</div>
                            </div>
                        </div>
                        <hr>
                        
                        <div class="product-description">
                            <SvelteMarkdown source={$productData.description} />
                        </div>
                        
                    </div>
                    <div class="img-wraper" ><img alt="{$productData.image}" id="catalog-image-{$productData.id}" src="{STATIC_BASE}{$productData.image}"/></div>
                </div>
                <div class="inner-footer">
                </div>


            </ModalBody>
            <ModalFooter>
                <button id="modal-prev-btn" class="btn modal-nav-btn" on:click={prevClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="prev">
                </button>
                <button id="modal-next-btn" class="btn modal-nav-btn" on:click={nextClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="next">
                </button>
            </ModalFooter>
        {/if}
    </Modal>
</div>



<style lang="scss">

</style>