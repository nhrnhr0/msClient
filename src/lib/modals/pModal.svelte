

<script>
  import {flyToCart} from './../utils/js/flyToCart';
  import {productCartModalStore, productQuestionModalStore, singleAmountPopupStore} from './../../stores/stores';
  import {
    get_album_details
  } from './../../api/api';
  import SvelteMarkdown from 'svelte-markdown';
  import { Button } from "sveltestrap";


  import {
    writable
  } from 'svelte/store';

  import {
    albumsJsonStore,
    campainsStore,
    categoryModalStore,
    colorsJsonStore,
    productImageModalStore,
    productModalStore,
    sizesJsonStore,
userInfoStore
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
    //import {Magnifier} from '$lib/utils/js/Magnifier.js';
    import { selectTextOnFocus } from '$lib/ui/inputActions';
    import {activeModalsStore } from '$lib/modals/modalManager';
import MyCountdown from '$lib/components/MyCountdown.svelte';
import QuestionLabel from '$lib/components/questionLabel.svelte';
import SingleAmountModal from './singleAmountModal.svelte';

  let productData = writable();
  let current_album = writable();
  let all_products_in_category;
  let colorMarkup = '';
  let sizeMarkup = '';
  let modal_zIndex = 0;
  let _productId, _catalogId;
  let isLoaded = false;
  let is_in_campain = undefined;
  let campain_id = undefined;
  let campain_title = undefined;
  let campain;
  let priceTable = undefined;
  export let isModalOpen = false;
  let loadingText = 'טוען...';
  let m, evt;
  let amount_input;

  let is_image_loaded = false;

  export function isOpen() {
    return isModalOpen;
  }

  function getProduct() {
    return [_catalogId, _productId];
  }
  export function setProduct(catalogId, productId, push_url = true) {
    isLoaded = false;
    is_image_loaded = false;
    //$stateQuery['product'] = catalogId + ',' + productId;
    
    if(push_url) {
      pushProductState(catalogId, productId);
    }
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
    let old_product = {'type':'product', 'id':$productData.id, 'ti': $productData.title}
    let newProductObj;
    for (let i = 0; i < all_products_in_category.length; i++) {
      if (all_products_in_category[i].id === $productData.id) {
        let newIndex = (i - 1);
        newIndex = newIndex >= 0 ? newIndex : all_products_in_category.length - 1;
        newProductObj = all_products_in_category[newIndex];
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

  let show_prices;
  $: {
    show_prices =  ($userInfoStore['me'] && Object.keys($userInfoStore['me']) != 0 && $userInfoStore['me'].show_prices == true)? true : false;
  }

  function open_category() {
    $categoryModalStore.setAlbum($current_album);
    if ($categoryModalStore.isOpen() == false) {
      $categoryModalStore.toggleModal();
    }
    
    

    if ($productModalStore.isOpen()) {
      $productModalStore.toggleModal(false);
    }
    

    logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה ממודל מוצר',
                                't': 'open category',
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
  let last_product_id = undefined;

  productData.subscribe((data) => {
    
    colorMarkup = '';
    sizeMarkup = '';
    let colorMarkupLocal = '';
    let sizeMarkupLocal = '';
    is_in_campain = false;
    campain_id = '';
    campain_title = '';
    campain = undefined;
    
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

    colorMarkup = colorMarkupLocal;
    sizeMarkup = sizeMarkupLocal;
    
    /*let newProduct= false;
    let is_magnifier_loaded = false;
    if (last_product_id != data.id) {
      newProduct = true;
      is_magnifier_loaded = false;
    }
    // waiting for isLoaded=true to init magnifier and retry init if fail after timeout
    setTimeout(()=> {
      
      if (window.matchMedia && !window.matchMedia("(hover: none)").matches) {
        let init_magnifier = ()=> {
          evt = new Event(),
          m = new Magnifier(evt);
          m.attach({
              thumb: `#catalog-image-${$productData.id}`,
              largeWrapper: 'preview', 
              zoomable:true,
              zoom: 2,
              mode: 'inside',
              
          });
          debugger;
          document.querySelectorAll('.magnifier-lens').forEach((lens)=> {
            debugger;
            lens.style.background = '#fff';
          });
          is_magnifier_loaded = true;
        }
        if (!is_magnifier_loaded) {
            init_magnifier();
            alert('init marginifier');
        }
      }      

    },150);
    */
    setTimeout(()=>{check_if_product_in_any_campain(data);}, 10);
    last_product_id = data.id;
    isLoaded = true;
  });

  function check_if_product_in_any_campain(data) {
    if($campainsStore) {
      for(let i = 0; i < $campainsStore.length; i++) {
        let camp = $campainsStore[i];
        let info;
        if(info = camp.products.find(val => val.catalogImage.id == data.id)) {
          is_in_campain = true;
          campain = camp;
          priceTable = info.priceTable;
          campain_title = camp.album.title;
          campain_id = camp.id;
          break;
        }
      }
    }else {
      return false;
    }
  }


  function should_use_pImg_modal() {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) {
      if(window.matchMedia("(max-width: 1100px)").matches && window.matchMedia("(min-width:500px)").matches) {
        return true;
      }
    }
    return false;
  }


  export function toggleModal(push_url=true) {
    isModalOpen = !isModalOpen;
    activeModalsStore.modalToggle('pModal', isModalOpen);
    if (isModalOpen == false) {
      //$stateQuery['product'] = -1;
      if(push_url) {
        pushMainPage();
      }
    }

  }


  function likeBtnClicked() {
    if(cartStore.isInCart($productData) == false) {
      flyToCart(document.querySelector('.product-modal-img'));
      logStore.addLog(
                            {
                                'a': 'הוסף לעגלה ממודל מוצר',
                                't': 'add to cart',
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
      cartStore.addToCart($productData);
      open_edit_amount_dialog();
    }
      //
    /*}else {
      document.querySelector('#productModalLikeBtn .text .item-amount').focus();
      
    }*/
    
    //$cartStore[_productId] = $productData;
    
    
    
  }
  let is_under_500px = ()=> { return window && window.matchMedia && window.matchMedia("(max-width:500px)").matches;}

  function openProductImageModal(e) {
    // open image in new tab
    let src = e.target.src
    window.open(src);
    /*
    if(should_use_pImg_modal()) {
      $productImageModalStore.setProduct($productData);
      $productImageModalStore.toggleModal();
    }*/
  }

  function remove_from_cart(e)  {
    e.stopPropagation();
    cartStore.removeFromCart($productData);
      logStore.addLog(
                            {
                                'a': 'הסר מעגל ממודל מוצר',
                                't': 'remove from cart',
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

  function open_edit_amount_dialog() {
    if(cartStore.isInCart($productData) == false) {
      return false;
    }
    if(cartStore.getProduct(_productId).show_sizes_popup == false) {
      $singleAmountPopupStore.toggleModal($productData.id, $productData.title);
      return false;
    }
    $productCartModalStore.toggleModal($productData.id);
    
  }
</script>




<div style="z-index: {modal_zIndex};" id="productModal" class="modal" class:active={isModalOpen}>
  <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
  {#if isLoaded && isModalOpen && $productData && $productData.cimage && $current_album}
        <div style="z-index: {modal_zIndex+10};" class="modal_content">
            <div class="modal-header">
              <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
                <button id="category-open-btn-{$current_album.id}" on:click={open_category}
                        class="title btn btn-outline-dark">{$current_album.title}
                    </button>
                    <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
            </div>

            <div class="modal-body">
                <div class="inner-body">
                    <div class="product-detail">
                        <div class="product-title">
                          <div class="title-text">
                            {$productData.title}
                          </div>
                        </div>
                        
                        <hr>
                        <div class="product-properties">
                            <div class="product-color-wraper">
                                <div class="product-color">{@html colorMarkup}</div>
                            </div>
                            <div class="product-size-wraper">
                                <div class="product-size">{@html sizeMarkup}</div>
                            </div>
                            <div class="product-packing-types">
                              {#if $productData.amountSinglePack != 0}
                                <div class="product-single-amount">
                                  כמות במארז: {$productData.amountSinglePack}
                                </div>
                              {/if}
                              {#if $productData.amountCarton != 0}
                                <div class="product-carton-amount">
                                  כמות בקרטון: {$productData.amountCarton}
                                </div>
                              {/if}
                            </div>


                            <!--
                            {#if $userInfoStore.isLogin}
                              <div class="product-packing-wraper"><b><u>שיטת אריזה: </u>
                              <span class="product-packing">{$productData.packing_type}</span>
                            </b></div>
                            {/if}
                            -->
                            {#if is_in_campain}
                              <div class="product-campains">
                                <table class="campain-table">
                                  <thead>
                                  <tr class="main-title">
                                    <th colspan="3">
                                      {campain_title}
                                      <br>
                                      <MyCountdown mainTextClr="black" borderClr='transperent' date={campain.endTime} />
                                    </th>
                                    
                                  </tr>
                                  <tr class="headers">
                                    <td>כמות
                                      </td>
                                    <td>מחיר ליח'
                                      </td>
                                    <td>מחיר ממולץ לצרכן
                                      </td>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {#each priceTable as price}
                                      <tr>
                                        <td>{price.amount}</td>
                                        <td>{price.cach_price}₪</td>
                                        <td>{price.credit_price}₪</td>
                                      </tr>
                                    {/each}
                                  </tbody>
                                </table>

                              </div>
                            {/if}
                        </div>
                        <hr>
                        
                        <div class="product-description">
                          {#if $productData && $productData.description}
                            <SvelteMarkdown source={$productData.description} />
                          {/if}
                          
                        </div>
                        <div  on:click={likeBtnClicked} class="like-btn-wraper">
                          {#if $cartStore[_productId] == undefined}
                              <button  id="productModalLikeBtn" class="like-btn">
                                <div class="text">
                                  הוסף
                              </div>
                                <div class="img-wraper">
                                  <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
                                </div>
                                
                              </button>
                          {:else}
                              <button on:click|preventDefault="{open_edit_amount_dialog}"  id="productModalLikeBtn" class="like-btn active">
                                <div class="amount-before">
                                  <Button color="danger" class="delete-btn action-btn" on:click="{remove_from_cart}" >
                                    <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="32px" height="32px"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>
                                  </Button>
                                  <label for="edit-btn" class="amount-in-cart-label">כמות בסל: {$cartStore[_productId].amount}</label>
                                  <Button color="primary" class="edit-amount-btn action-btn">ערוך</Button>
                                  <!--
                                  {#if $cartStore[_productId].show_sizes_popup}
                                    <div class="amount-text">
                                      <div class="text">
                                        לחץ לבחירת מידות
                                      </div>
                                      <div class="edit-amount-btn">
                                          {$cartStore[_productId].amount}
                                      </div>
                                    </div>
                                  {:else}
                                    <div class="amount-text">
                                      <div class="text">
                                        כמות בסל
                                      </div>
                                      <div class="edit-amount-btn">
                                        <input class="amount-input" disabled bind:this={amount_input} type="number" min="1" max="9999" bind:value="{$cartStore[_productId].amount}"/>
                                      </div>
                                    </div>
                                  {/if}
                                  -->
                                </div>
                                
                              </button>
                          {/if}
                          </div>
                    </div>
                    <div class="img-wraper"
                    style="padding-bottom:{(!is_image_loaded && is_under_500px())?"100%":"0%"}
                            
                    "
                    >
                      <div class="img-inner-wraper">
                        
                        <a href="{CLOUDINARY_URL}f_auto,w_500,h_500/{$productData.cimage}" target="_blank">
                        <img class:loaded={is_image_loaded} on:load={()=>{is_image_loaded = true}} on:error={()=>{is_image_loaded = false}} class="product-modal-img" 
                          alt="{$productData.image}" id="catalog-image-{$productData.id}"
                          src="{CLOUDINARY_URL}f_auto,w_500,h_500/{$productData.cimage}"
                          data-large-img-url="{CLOUDINARY_URL}f_auto,w_500,h_500/{$productData.cimage}"
                          />
                          
                        </a>
                        {#if is_image_loaded}
                          <button class="question-button btn btn-primary" on:click={()=> {$productQuestionModalStore.openModal($productData.id,$productData.title);}} >
                            יש לך שאלה?
                          </button>
                        
                          <div class="price-tag" class:active={show_prices} >{$productData.client_price + '₪'}</div>
                        {/if}
                      </div>
                      
                  </div>
                  <!--
                  <div class="magnifier-preview-wraper">
                    <div class="magnifier-preview example heading" id="preview"></div>
                  </div>
                  -->
                </div>
            </div>


            <div class="modal-fotter">
                <button id="modal-prev-btn" class="btn modal-nav-btn" on:click={prevClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="prev">
                </button>

                 
                <!--
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
                -->

                <button id="modal-next-btn" class="btn modal-nav-btn" on:click={nextClick}>
                    <img src="https://catalog.ms-global.co.il/static/assets/catalog/imgs/icons8-arrow-48.png" alt="next">
                </button>
            </div>
        </div>
    {:else}
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
      <div class="modal-header">
        <button title="Close" on:click={toggleModal} class="close-btn">x</button>
          <button
                  class="title btn btn-outline-dark">{loadingText}
              </button>
          <button title="Close" on:click={toggleModal} class="close-btn">x</button>
            
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
                      <!--
                      <div class="product-packing-wraper">
                          <div class="product-packing">{loadingText}</div>
                      </div>
                      -->
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
                  <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
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
    //@import '$lib/utils/css/magnifier.css';

    .like-btn-wraper{
      
      width: auto;
      height: auto;
      flex:1;
      max-width: 100%;
      /*@media (min-width: 820px) {
          & .like-btn:not(.active) .text::after {
            content: ' לסל';
            
          }
      }*/
      @media screen and (max-width: 819px) {
        //width: 200px;
        .amount-text {
          display: none;
        }
        .like-btn { 
          height: 50px;
        }
      }
      /*@media screen and (max-width: 819px) {
        width: 160px;
        height: 49px;
        
        .amount-text {
          display: none;
        }
      }*/
      
      .like-btn {
        
        background-color: var(--buy-btn-color);
        border: 1px solid var(--buy-btn-color);
        &:hover, &:focus {
              background-color: var(--buy-btn-color-hover);
              border: 1px solid var(--buy-btn-color-hover);
              box-shadow: 0 0 0 0.2rem var(--buy-btn-color-hover);
          }
        &.active {
          background-color: rgba(122, 117, 117, 0.589);
          border: transparent;
          &:hover, &:focus {
                background-color: rgba(105, 99, 99, 0.589);
                border: 1px solid rgba(105, 99, 99, 0.589);
                box-shadow: none;
                //box-shadow: 0 0 0 0.2rem rgba(105, 99, 99, 0.589);
            }
          //border: 1px solid red;
          
          //background: rgba(255, 255, 255, 0.478);
          //color:rgb(70, 70, 70);
          .amount-before {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            
            .amount-text {
              height: 100%;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              flex:1;
              .text {
                font-size: 0.8em;
                color: rgb(70, 70, 70);
                font-weight: bold;
                @media screen and (max-width: 550px) {
                  font-size: 0.7em;
                }
                @media screen and (max-width: 500px) {
                  font-size: 0.65em;
                  
                }
              }
              .edit-amount-btn {
                font-size: 0.8em;
                padding-right: 10%;
                padding-left: 10%;
                color: rgb(70, 70, 70);
                font-weight: bold;
                .amount-input {
                  width: 100%;
                  height: 100%;
                  border: none;
                  text-align: center;
                  font-weight: bold;
                  background: none;
                }

                
              }
            }
          }
        }
        @media screen and (max-width: 450px) {
          font-size: 0.8em;
        }
        
        .text {
          //flex: 1;
          font-size: 1.5em;
          color: black;
          text-shadow: none;
          text-align: center;
        }
        .img-wraper {
          display: inline-block!important;
          flex:0!important;
          width:30px;
          height: 30px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          img {
            width: auto;
            height: 100%;
          }
        }
        .amount-before {
          font-size: 1.7em;
          display:flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          :global(.action-btn) {
            width: 58px;
            height: 46px;
            margin: 5px;
          }
          .amount-in-cart-label {
            text-shadow: none;
            font-size: smaller;
            color: black;

          }
          :global(.edit-amount-btn) {
            //font-weight: bold;
          }
          .delete-btn {
            display:flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background: none;
            border: none;
            svg {
              fill: black;
            }
            &:hover svg {
              //fill:red;
            }
          }
        }
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
        color: white;
        width: 50%;
        text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
        z-index: 1;
        font-weight: bold;
        text-align: center;
        //background: #0000007a;
        border-radius: 25px;


      }


      @media screen and (max-height: 450px) {
        .like-btn {
          .img-wraper{
            width: 35px;
            height: 35px;
            img {
              width: 35px;
              height: 35px;
            }
          }
        }
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
  .question-button {
                /*border: 1px solid #444;
                border-radius: 5px;
                padding: 5px;
                display: inline;
                background: none;
                color: #444;
                font-size: 1.2em;
                font-weight: bolder;
                transition: all 0.2s ease;
                &:hover, &:focus {
                  background: #444;
                  color: white;
                }*/
              }
.modal_content {
  display: flex;
  flex-direction: column;
  max-height: fit-content;
  height: 90vh;
  height: calc(90vh - calc(90vh - 90%));
  overflow: hidden;
  @media screen and (max-width: 768px) {
    width: 94%;
    //height: 85%;
  }
  .modal-header {
    height: 50px;
    padding:0px;
    .close-btn {
      flex:1;
      
      flex-grow: 0;
      flex-shrink: 1;
      font-weight: bolder;
      border: none;
      background: none;
      font-size: 2rem;
      &:hover,&:focus {
        color:red;
      }
      &.left {
        padding-right:4%;
        padding-left: 2%;
      }
      &.right {
        padding-left:4%;
        padding-right: 2%;
      }
    }
  }
  .modal-body {
      //background-color: rgba(255, 255, 255, 0.6);
      //background-blend-mode: lighten;
        min-height: 63vh;
        height: 63vh;
        width: 100%;
        max-width: initial!important;
        position: relative;
        overflow:auto;
        @media screen and (max-height: 450px) {
          min-height: 50vh;
          height: 50vh;
        }
        @media screen and (max-width: 1100px) {
          overflow-y: auto;
        }


        .inner-body {
          height: auto;
          display: flex;
          flex-direction: row;
          @media screen and (max-width: 1100px) {
            position: relative;
            overflow: unset;
          }
          @media screen and (max-width: 500px) {
            flex-direction: column-reverse;
          }
          
        


        .product-detail {
          .product-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .title-text {
              font-size: 2em;
              font-weight: bolder;
            }
            
            }
            @media screen and (max-width: 850px) {
              font-size: 0.8rem;
            }
            @media screen and (max-width: 500px) {
              
            }
            overflow-y: auto;
            //padding-right: 5px;
            flex: 1;
            min-width: 35%;
            padding-left: 10px;
            @media screen and (max-width: 1100px) {
              flex:3;
              padding-left: 10px;
              overflow-y: auto;
            }
            @media screen and (max-width: 550px) {
              flex:2;
              padding-left: 10px;
              overflow-y: auto;
              .product-title {
                .title-text {
                  font-size: 1.7em;
                }
              }
            }


            

            .product-description {
            overflow-y: auto;
            font-size: 1.3em;
            font-weight: bold;
            @media screen and (max-width: 1100px) {
              font-size: 1.2em;
              
            }
            @media screen and (max-width: 800px) {
              font-size: 1.3em;
              //position: absolute;
              top:100%;
            }
            }

            .product-properties {
              display: flex;
              flex-direction: column;
              padding-left: 10px;
              
              .product-color-wraper {
              .product-color {
                  display: flex;
                  width: 100%;
                  justify-content: flex-start;
                  flex-grow: 1;
                  flex-shrink: 0;
                  flex-wrap: wrap;

                  :global(.color-box) {
                    margin: minmax(3px auto);
                    max-width: 25px;
                    flex: 1;
                    height: 25px;
                    border: 1px black solid;
                    border-radius: 50%;
                    flex-shrink: 1;
                    
                    flex-grow: 1;
                    margin:1%;

                    &:hover {
                        border: 2px red solid;
                    }
                  }
              }
              }
              /*.product-packing-wraper {
                padding-right: 1%;
                padding-top:2%;
                font-size: large;
              }*/
              .product-campains {
                table.campain-table {
                  width: 100%;
                  border-collapse: collapse;
                  border-spacing: 0;
                  font-size: 1.2em;
                  font-weight: bold;
                  --main-txt-clr: #000;
                  --main-bg-clr: #fff;
                  thead {
                    tr.main-title{
                      @include bg-gradient();
                      th {
                        font-size: xx-large;
                        text-align: center;
                        border-bottom: 1px solid black;
                        padding-bottom: 20px;
                      }
                      
                    }
                    tr.headers{
                      @include bg-gradient();
                      td {
                        word-wrap: break-word;
                        white-space: normal;
                        text-align: center;
                        border: 1px solid #444;
                      }
                    }
                  }
                  tbody {
                    text-align: center;
                    
                    // diffrent background color to odd and even rows
                    tr:nth-child(odd) {
                      background-color: rgb(195, 195, 195);
                    }tr:nth-child(even) {
                      background-color: rgb(139, 139, 139);
                    }
                    tr{
                      
                      td {
                        padding: 10px;
                        text-align: center;
                        border-bottom: 1px solid var(--main-txt-clr);
                        transition: all 1s ease;
                        :hover {
                          background-color: wheat;
                        }
                      }
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
                      text-align: center;
                      font-weight: 700;
                      
                      flex-grow: 1;
                      margin:1%;


                      &:hover {
                      background-color: #3D3D3D;
                      color: white
                      }
                  }
                  }
              }
              }
              .product-packing-types {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                & > div {
                  flex: 1;
                  padding: 1%;
                  text-align: center;
                  border: 1px black solid;
                  font-weight: bold;
                  font-size: 1.2em;
                    &:hover {
                      background-color: #3D3D3D;
                      color: white
                    }
                }
                
              }
        }

        .img-wraper {
            flex: 1;
            
            @media screen and (max-width: 1100px) {
              flex:2;
            }

            @media screen and (max-width: 500px) {
              //height: 0;
              //padding-bottom: 100%;
              
            }
            //cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            .img-inner-wraper{
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              .question-button {
                margin-top: 25px;
                width: auto;
              }
              .price-tag {
                    position: absolute;
                    top:5px;
                    left:5px;
                    padding: 5px;
                    font-weight: bold;
                    border-radius: 999px;
                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                    display: none;
                    font-size: x-large;
                    &.active {
                        display: block;
                    }
                }
            }
            img.product-modal-img {
              @include bg-image;
              //float: left;
              //border-radius: 15px;
              box-shadow: 10px 10px 5px rgb(133, 133, 133);
              line-height: 30px;
              
              
              width: auto;
              height: 100%;
              @media screen and (max-width: 1100px) {
                width: 100%;
                height: auto;
                max-width: 100%;
                max-height: 100%;
              }
                
              
            }
        }
        }
    }
    .modal-fotter {
      justify-content: center;
      height: 69px;
      overflow: hidden;
      align-items: center;
      position: relative;
      .btn {
        padding: 0px;
        //outline: none;
        box-shadow: none;
      }

      .modal-nav-btn {
        position: absolute;
        img {
          width: 60px;
          
          
          @media screen and (max-width: 450px) {
            width: auto;
          }
        }
      }

      #modal-next-btn {
        transform: rotate(180deg);
        left: 25px;
        @media screen and (max-width: 450px) {
          left: 4px;
        }
      }
      #modal-prev-btn {
        right: 25px;
        @media screen and (max-width: 450px) {
          right: 4px;
        }
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