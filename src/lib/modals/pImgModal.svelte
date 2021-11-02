<script>
    import {
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import {Event} from '$lib/utils/js/Event'
    import {Magnifier} from '$lib/utils/js/Magnifier.js';
    
    import {
CLOUDINARY_URL,
    STATIC_BASE
    } from './../../api/consts';
    let isModalOpen = false;
    let modal_zIndex = 0;
    export let product = {'title':'loading...', 'image': ''};
    let m, evt;
    export function toggleModal() {
        isModalOpen = !isModalOpen;
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);


        }
    }
    export function isOpen() {
        return isModalOpen;
    }

    export function setProduct(p) {
        
        product = p
        setTimeout(()=> {
            evt = new Event(),
            m = new Magnifier(evt);
            m.attach({
                thumb: '#thumb',
                largeWrapper: 'preview', 
                zoomable:true,
                zoom: 1.5,
                
            });
        }, 100)
    }
</script>



<div style="z-index: {modal_zIndex};" id="productImageModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        <div class="modal-header">
            <h1>{product['title']}</h1>
        </div>

        <div class="modal-body">

            {#key product}
                <div class="content">
                    <!--<a class="magnifier-thumb-wrapper demo" href="#http://en.wikipedia.org/wiki/File:Starry_Night_Over_the_Rhone.jpg">-->
                    <div class="original-img">
                        <img alt="ge" id="thumb" src="{CLOUDINARY_URL}f_auto,w_auto/{product['cimage']}"
                        data-large-img-url="{CLOUDINARY_URL}f_auto,w_auto/{product['cimage']}"
                        data-large-img-wrapper="preview">
                    </div>
                    <!-- </a>-->
                    <div class="magnifier-preview example heading" id="preview">
                        

                    </div>
                </div>
            {/key}



        </div>


        <div class="modal-fotter">

        </div>
        <button title="Close" on:click={toggleModal} class="close_modal">x</button>
        <button title="Close" on:click={toggleModal} class="close_modal left">x</button>


    </div>
</div>

<style lang="scss">
    @import '$lib/utils/css/magnifier.css';
    .opaque {
        opacity: .5;
        background-color: #343232;
    }
    .original-img {
        border: solid 1px#555;
        text-align: center;
        line-height: 30px;
    }
    #preview {
        border: solid 1px#555;
        text-align: center;
        line-height: 30px;

        height: 500px;
        width: 500px;
    }
    .modal_content {
        max-height:95%;
        width: 95%;
        .modal-header {
            h1 {
                text-align: center;
                margin: auto;
            }
        }
        .modal-body{ 
            .content {
                display:flex;
                justify-content: center;
                align-items: center;
                .original-img {
                    position: relative;
                }

            }
        }
    }
    .img-wraper {
        height: 82vh;
        width: 100%;;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
</style>