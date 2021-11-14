<script>
  import {flyToCart} from './../utils/js/flyToCart';
  import {
    get_album_details
  } from './../../api/api';
  import SvelteMarkdown from 'svelte-markdown'

  import {
    writable
  } from 'svelte/store';

  import {
    albumsJsonStore,
    categoryModalStore,
    colorsJsonStore,
    productImageModalStore,
    productModalStore,
    sizesJsonStore
  } from './../../stores/stores'
  import {
    _modal_z_index_incrementor
  } from './../../stores/stores'

  import {
    CLOUDINARY_URL,
    STATIC_BASE
  } from './../../api/consts';
  import {
    stateQuery
  } from './../../stores/queryStore';
  import {
    cartStore
  } from './../../stores/cartStore';
  import Spinner from 'svelte-spinner';

import {pushMainPage, pushProductState } from './../../stores/urlManager';

import { logStore } from './../../stores/logStore';
import {Event} from '$lib/utils/js/Event'
    import {Magnifier} from '$lib/utils/js/Magnifier.js';

  let productData = writable();
  let current_album = writable();
  let all_products_in_category;
  let colorMarkup = '';
  let sizeMarkup = '';
  let modal_zIndex = 0;
  let _productId, _catalogId;
  let isLoaded = false;
  let isModalOpen = false;
  let loadingText = 'טוען...';
  let m, evt;
  export function isOpen() {
    return isModalOpen;
  }

  function getProduct() {
    return [_catalogId, _productId];
  }
  export function setProduct(catalogId, productId) {
    isLoaded = false;
    //$stateQuery['product'] = catalogId + ',' + productId;
    
    pushProductState(productId);
    _productId = productId;
    _catalogId = catalogId;
    modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
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
    let old_product = {'type':'product', 'id':$productData.id, 'ti': $productData.title}
    let newProductObj;
    for (let i = 0; i < all_products_in_category.length; i++) {
      if (all_products_in_category[i].id === $productData.id) {
        let newIndex = ((i + 1) % all_products_in_category.length);
        newProductObj = all_products_in_category[newIndex];
        console.log('setting new product: ', $current_album.id, all_products_in_category[newIndex].id);
        setProduct($current_album.id, all_products_in_category[newIndex].id);
        break;
      }
    }

    let new_product = {'type':'product', 'id':newProductObj.id, 'ti': newProductObj.title}
    logStore.addLog(
      {
      'a': 'פתיחת מוצר ממודל מוצר (כפתור הבא)',
      't': 'open product',
      'f': {
        ...old_product,
      },
      'w': {
        ...new_product,
      }
    });
    
  }

  function prevClick() {
    debugger;
    let old_product = {'type':'product', 'id':$productData.id, 'ti': $productData.title}
    let newProductObj;
    for (let i = 0; i < all_products_in_category.length; i++) {
      if (all_products_in_category[i].id === $productData.id) {
        let newIndex = (i - 1);
        newIndex = newIndex >= 0 ? newIndex : all_products_in_category.length - 1;
        newProductObj = all_products_in_category[newIndex];
        console.log('setting new product: ', $current_album.id, newProductObj.id);
        setProduct($current_album.id, newProductObj.id);
        break;
      }
    }
    let new_product = {'type':'product', 'id':newProductObj.id, 'ti': newProductObj.title}
    logStore.addLog(
      {
      'a': 'פתיחת מוצר ממודל מוצר (כפתור הקודם)',
      't': 'open product',
      'f': {
        ...old_product,
      },
      'w': {
        ...new_product,
      }
    });
    
  }

  function open_category() {

    if ($categoryModalStore.isOpen()) {
      $categoryModalStore.toggleModal();
    }
    $categoryModalStore.toggleModal();
    $categoryModalStore.setAlbum($current_album);
    /*if ($productModalStore.isOpen()) {
      $productModalStore.toggleModal();
    }*/
    

    debugger; 
    logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה ממודל מוצר',
                                'f': {
                                  'type': 'product',
                                  'id': $productData.id,
                                  'ti': $productData.title,
                                },
                                'w':{
                                    'type':'category',
                                    'id':$current_album.id,
                                    'ti':$current_album.title, 
                                }
                            }
                            );
  }

  productData.subscribe((data) => {
    colorMarkup = '';
    sizeMarkup = '';
    let colorMarkupLocal = '';
    let sizeMarkupLocal = '';
    if (data == undefined) {
      return;
    }
    for (var i = 0; i < data.colors.length; i++) {
      var col_id = data.colors[i];
      var col = $colorsJsonStore[col_id];
      colorMarkupLocal +=
        `<div class="color-box" title="${col.name}" alt="${col.name}" style="background:${col.color};"></div>`;
    }

    for (var i = 0; i < data.sizes.length; i++) {
      var size_id = data.sizes[i];
      var size = $sizesJsonStore[size_id];
      sizeMarkupLocal += `<div class="size-box">${size.size}</div>`;
    }

    console.log('new sizeMarkup: ', sizeMarkupLocal);
    console.log('new colorMarkup: ', colorMarkupLocal);
    colorMarkup = colorMarkupLocal;
    sizeMarkup = sizeMarkupLocal;
    setTimeout(()=> {
      evt = new Event(),
      m = new Magnifier(evt);
      m.attach({
          thumb: `#catalog-image-${$productData.id}`,
          largeWrapper: 'preview', 
          zoomable:true,
          zoom: 1.5,
          
      });
    },100);
    isLoaded = true;


  });


  export function toggleModal() {
    console.log('product toggleModal');
    isModalOpen = !isModalOpen;
    if (isModalOpen == false) {
      //$stateQuery['product'] = -1;
      
      pushMainPage();
    }

  }


  function likeBtnClicked() {
    console.log('like btn clicked');
    flyToCart(document.querySelector('.product-modal-img'))
    $cartStore[_productId] = $productData;
    
    
    logStore.addLog(
                            {
                                'a': 'הוסף לעגלה ממודל מוצר',
                                'f': {
                                  'type':'product',
                                    'id':$productData.id,
                                    'ti':$productData.title, 
                                },
                                'w':{
                                    'type':'product',
                                    'id':$productData.id,
                                    'ti':$productData.title, 
                                }
                            }
                            );
  }

  function openProductImageModal(e) {
    $productImageModalStore.setProduct($productData);
    $productImageModalStore.toggleModal();
  }
</script>




<div style="z-index: {modal_zIndex};" id="productModal" class="modal" class:active={isModalOpen}>
  <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>

  {#if isLoaded && isModalOpen && $productData && $productData.cimage}
        <div style="z-index: {modal_zIndex+10};" class="modal_content">
            <div class="modal-header">
                <button id="category-open-btn-{$current_album.id}" on:click={open_category}
                        class="title btn btn-outline-dark">{$current_album.title}
                    </button>
            </div>

            <div class="modal-body">
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
                          {#if $productData && $productData.description}
                            <SvelteMarkdown source={$productData.description} />
                          {/if}
                        </div>
                        
                    </div>
                    <div class="img-wraper">
                      <div class="img-inner-wraper">
                      <img class="product-modal-img" alt="{$productData.image}" id="catalog-image-{$productData.id}" src="{CLOUDINARY_URL}f_auto,w_500/{$productData.cimage}"
                        data-large-img-url="{CLOUDINARY_URL}f_auto,w_500/{$productData.cimage}"
                        data-large-img-wrapper="preview"/>
                    </div>
                  </div>
                    
                </div>
                <div class="magnifier-preview-wraper">
                  <div class="magnifier-preview example heading" id="preview"></div>
                </div>
            </div>


            <div class="modal-fotter">
                <button id="modal-prev-btn" class="btn modal-nav-btn" on:click={prevClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="prev">
                </button>
                <div  on:click={likeBtnClicked} class="like-btn-wraper">
                    <button  id="productModalLikeBtn" class:active={$cartStore[_productId] != undefined} class="like-btn">
                      <div class="img-wraper">
                        {#if $cartStore[_productId] != undefined}
                            <img alt="V" src="https://img.icons8.com/external-becris-lineal-becris/48/000000/external-check-mintab-for-ios-becris-lineal-becris-1.png"/>
                          {:else}
                            <img alt="plus" src="https://img.icons8.com/android/48/000000/plus.png"/>
                        {/if}
                      </div>
                      <div class="text">
                        {#if $cartStore[_productId] != undefined}
                          נוסף
                        {:else}
                          הוסף
                        {/if}
                      </div>
                    </button>
                  </div>
                <button id="modal-next-btn" class="btn modal-nav-btn" on:click={nextClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="next">
                </button>
            </div>
        </div>
    {:else}
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
      <div class="modal-header">
          <button
                  class="title btn btn-outline-dark">{loadingText}
              </button>
      </div>

      <div class="modal-body">
          <div class="inner-body">
              <div class="product-detail">
                  <div class="product-title">{loadingText}</div>
                  <hr>
                  <div class="product-properties">
                      <div class="product-color-wraper">
                          <div class="product-color">{loadingText}</div>
                      </div>
                      <div class="product-size-wraper">
                          <div class="product-size">{loadingText}</div>
                      </div>
                  </div>
                  <hr>
                  
                  <div class="product-description">
                    {loadingText}
                  </div>
                  
              </div>
              <div class="img-wraper">  
                  <Spinner
                size="200"
                speed="750"
                color="#A82124"
                thickness="2"
                gap="40"
            /></div>
          </div>
      </div>


      <div class="modal-fotter">
          <button id="modal-prev-btn" class="btn modal-nav-btn" on:click={prevClick}>
              <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="prev">
          </button>
          <div  on:click={likeBtnClicked} class="like-btn-wraper">
              <button  id="productModalLikeBtn" class="like-btn">
                <div class="img-wraper">
                      <img alt="plus" src="https://img.icons8.com/android/48/000000/plus.png"/>
                </div>
                <div class="text">
                  {loadingText}
                </div>
              </button>
            </div>
          <button id="modal-next-btn" class="btn modal-nav-btn" on:click={nextClick}>
              <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="next">
          </button>
      </div>
  </div>
    {/if}
</div>



<style lang="scss">
    @import '$lib/utils/css/magnifier.css';
    #preview {
    }
    .like-btn-wraper{
      cursor: pointer;
      &:hover {
          & .like-btn:not(.active) .text::after {
            content: ' להצעת מחיר'
          }
        } 
      .like-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        &.active {
          //border: 1px solid red;
          background: rgba(255, 255, 255, 0.478);
          color:rgb(70, 70, 70);

        }
        .text {
          display:inline-block;
          font-size: 1.7em;
        }
        .img-wraper {
          width:43px;
          height: 43px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        margin-top: 10px;
        margin-bottom: 10px;
        //visibility: visible;
        color: white;
        width: auto;
        text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
        z-index: 1;
        
        font-weight: bold;
        pointer-events: none;
        text-align: center;
        //word-break: break-all;


        background: #0000007a;
        border-radius: 25px;
        //border-top-right-radius: 0px;
        //border-top-left-radius: 0;
        //border: var(--swiper-slide-border) solid black;
        //border-bottom-width: 0px;
   
      }
    }

/*
*:focus {
  outline: 0;
}


.modal {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
  &.active {
    display:block;
  }
}

.modal .overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 995;
  background: rgba(0,0,0,0.85);
}

.modal .modal_content {
  overscroll-behavior: contain;


  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80%;
  overflow: auto;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,0.7);
  border-radius: 4px;
  width: 85%;
  text-align: center;



  .modal-fotter {
    @include bg-gradient();
    //max-height: 10%;
    display: flex;
    flex-direction: row;

    .header-logo {
      height: 35px;
    }

    .modal-title {
      font-weight: 700;
      font-size: 2.5em;
    }
  }
}


.modal .close_modal {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.5;
  background: none;
  border: none;
  transition: opacity 0.2s ease;
}

.modal .close_modal:hover {
  opacity: 0.9;
}
*/
#productModal {
.modal_content {
  display: flex;
  flex-direction: column;
  max-height: fit-content;
  .modal-header {
    height: 50px;
  }
  .modal-body {
      //background-color: rgba(255, 255, 255, 0.6);
      //background-blend-mode: lighten;
        width: 100%;
        max-width: initial!important;
        position: relative;

        .magnifier-preview-wraper {
          position: absolute;
          position: absolute;
          width: 100%;
          top: 0px;
          height: 100%;
          width: 50%;
          
          .magnifier-preview {
            width: 100%;
            height: 100%;
            line-height: 30px;
          }
        }

        .inner-body {
          height: auto;
        display: flex;
        flex-direction: row;


        .product-detail {
          overflow-y: scroll;
            //padding-right: 5px;
            flex: 1;
            min-width: 35%;
            padding-left: 10px;

            .product-title {
            font-size: 2em;
            font-weight: bolder;
            }

            .product-description {
            overflow-y: auto;
            font-size: 1.3em;
            font-weight: bold;
            }

            .product-properties {
              display: flex;
              flex-direction: column;
              .product-color-wraper {
              .product-color {
                  display: flex;
                  width: 100%;
                  justify-content: flex-start;
                  flex-grow: 1;
                  flex-shrink: 0;

                  :global(.color-box) {
                    margin: 3px;
                    max-width: 25px;
                    flex: 1;
                    height: 25px;
                    border: 1px black solid;
                    border-radius: 50%;

                    &:hover {
                        border: 2px red solid;
                    }
                  }
              }
              }

              .product-size-wraper {
                  .product-size {

                  display: flex;
                  width: 100%;
                  justify-content: flex-start;
                  flex-grow: 1;
                  flex-shrink: 0;

                  :global(.size-box) {
                      flex: 1;
                      border: 1px black solid;
                      margin: 3px;
                      min-width: 30px;
                      text-align: center;
                      font-weight: 700;

                      &:hover {
                      background-color: #3D3D3D;
                      color: white
                      }
                  }
                  }
              }
              }

        }

        .img-wraper {
            flex: 1;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            .img-inner-wraper{
              position: relative;
            }
            img {
              @include bg-image;
              //float: left;
              //border-radius: 15px;
              box-shadow: 10px 10px 5px rgb(133, 133, 133);
              line-height: 30px;
              
              
              width: auto;
              height: 100%;
              
            }
        }
        }
    }
    .modal-fotter {
      justify-content: space-evenly;

      .btn {
        padding: 0px;
        //outline: none;
        box-shadow: none;
      }

      .modal-nav-btn {
        img {
          width: 60px;
        }
      }

      #modal-next-btn {
        transform: rotate(180deg);
      }

      #modal-add-btn {
        cursor: pointer;

        /*a {
          padding: 5px !important;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
        }*/
      }

      #modal-add-btn:disabled {}

      @keyframes addToCartAnimation {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }
    }




}
}
</style>