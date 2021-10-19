<script>
import { get_album_details } from './../../api/api';

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
import { writable } from 'svelte/store';

import {albumsJsonStore} from './../../stores/stores'

import {STATIC_BASE} from './../../api/consts'
    let productData = writable();
    let current_album = writable();
    export function setProduct(catalogId, productId) {
        // find album data from id:
        
        current_album.set($albumsJsonStore.filter((val) => {
            console.log('hey hey: val=', val);
            return val.id == catalogId;
        })[0]);


        let productsPromise = get_album_details(catalogId);
        let colorMarkup  = '';
        let sizeMarkup = '';
        productData.subscribe((data)=> {
            debugger;
            if(data == undefined) {
                return;
            }
            for (var i = 0; i < data.colors.length; i++) {
                var col_id = data.colors[i];
                colorMarkup += `<div class="color-box" title="${col.name}" alt="${col.name}" style="background:${col.color};"></div>`;
            }

            for (var i = 0; i < data.sizes.length; i++) {
                var size_id = data.sizes[i];
                sizeMarkup += `<div class="size-box">${size.size}</div>`;
            }

            console.log('new sizeMarkup: ', sizeMarkup);
            console.log('new colorMarkup: ', colorMarkup);
        });


        productsPromise.then((v)=>{
            for(let i = 0; i < v.length;i++) {
                console.log('productId: ', productId, '\t V: ', v[i].id);
                if(v[i].id == productId) {
                    productData.set(v[i]);
                    break;
                }
            }
        })
    }
</script>
<div class="productModalWraper">
    <Modal id="productModal" isOpen={_open} {toggle}>
        {#if $productData }
            <ModalHeader {toggle}>
                <button data-album-id=""
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
                                <div class="product-color">'colorMarkup'</div>
                            </div>
                            <div class="product-size-wraper">
                                <div class="product-size">'sizeMarkup'</div>
                            </div>
                        </div>
                        <hr>
                        
                        <div class="product-description">marked(img.description)</div>
                        
                    </div>
                    <div class="img-wraper" ><img alt="{$productData.image}" id="catalog-image-{$productData.id}" src="{STATIC_BASE}{$productData.image}"/></div>
                </div>
                <div class="inner-footer">
                </div>


            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        {/if}
    </Modal>
</div>



<style lang="scss">

</style>