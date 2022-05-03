<script>
  import SvelteMarkdown from 'svelte-markdown';
  import {
    cartStore
  } from './../../stores/cartStore';
  import {
    activeModalsStore
  } from '$lib/modals/modalManager';
  import {
    CLOUDINARY_URL,
    STATIC_BASE
  } from '../../api/consts'
  import {
    get_album_details
  } from './../../api/api';
  import {
    writable
  } from 'svelte/store';
  import {
    albumsJsonStore,
    campainsStore,
    productModalStore,
    userInfoStore,
    _modal_z_index_incrementor
  } from './../../stores/stores';
  import {
Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Spinner
  } from 'sveltestrap';
  import { selectTextOnFocus } from '$lib/ui/inputActions';


  function remove_from_cart(e) {
    const productId = e.currentTarget.dataset.productId;
    const imgData = {
      'id': productId
    };
    console.log(e);
    cartStore.removeFromCart(imgData);
    logStore.addLog({
      'a': 'הסר מהעגלה ממודל קטגוריה',
      't': 'remove from cart',
      'f': {
        'type': 'category',
        'id': $current_album.id,
        'ti': $current_album.title
      },
      'w': {
        'type': 'product',
        'id': imgData.id,
        'ti': imgData.title,
      }
    });
  }
  let show_prices;
  $: {
    show_prices =  ($userInfoStore['me'] && Object.keys($userInfoStore['me']) != 0 && $userInfoStore['me'].show_prices == true)? true : false;
  }
  export let isModalOpen = false;
  export function toggleModal(push_url = true) {
    isModalOpen = !isModalOpen;
    activeModalsStore.modalToggle('cmodal', isModalOpen);
    if (isModalOpen == false) {
      //$stateQuery['category'] = '-1';
      if (push_url) {
        pushMainPage();
      }

    } else {

    }
  }
  export function isOpen() {
    return isModalOpen;
  }
  /*import {
    stateQuery
  } from './../../stores/queryStore';*/
  import {
    flyToCart
  } from '$lib/utils/js/flyToCart';
  import {
    pushCategoryState,
    pushMainPage
  } from './../../stores/urlManager';
  import {
    logStore
  } from './../../stores/logStore';
  import {productCartModalStore} from './../../stores/stores';

  import MyCountdown from '$lib/components/MyCountdown.svelte';
  let products = [];
  let current_album = new writable({});
  let title = 'loading'
  let desctiption = '';
  let fotter = '';
  let modal_zIndex = 0;
  let is_campain = false;
  let campain;
  export function setAlbum(album, push_url = true) {
    current_album.set(album);
    desctiption = album.description;
    fotter = album.fotter;
    products = get_album_details(album.id);
    title = album.title;
    modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
    if (album.is_campain) {
      for (let i = 0; i < $campainsStore.length; i++) {
        if ($campainsStore[i].album.id == album.id) {
          is_campain = true;
          campain = $campainsStore[i];
          break;
        }
      }
    }
    is_campain = album.is_campain;
    //$stateQuery['category'] = album.id;
    if (push_url) {
      pushCategoryState(album.id);
    }
    setTimeout(() => {
      modal_body.scrollTop = 0;
    }, 30);
  }

  function open_product(img) {
    let catalogId = $current_album.id

    if ($productModalStore.isOpen()) {
      $productModalStore.toggleModal();
    }
    $productModalStore.toggleModal();
    $productModalStore.setProduct(catalogId, img.id);

    logStore.addLog({
      'a': 'פתיחת מוצר ממודל קטגוריה',
      't': 'open product',
      'f': {
        'type': 'category',
        'id': $current_album.id,
        'ti': $current_album.title,
      },
      'w': {
        'type': 'product',
        'id': img.id,
        'ti': img.title,
      }
    });
  }

  function likeBtnClicked(img) {
    //console.log('likeBtnClicked', e);
    //let img = e.currentTarget.parentElement.querySelector('.product-image');
    let imgData = img;// JSON.parse(e.currentTarget.dataset["img"]);
    if (cartStore.isInCart(imgData) == false) {
      cartStore.addToCart(imgData);
      //flyToCart(img);
      logStore.addLog({
        'a': 'הוסף לעגלה ממודל קטגוריה',
        't': 'add to cart',
        'f': {
          'type': 'category',
          'id': $current_album.id,
          'ti': $current_album.title
        },
        'w': {
          'type': 'product',
          'id': imgData.id,
          'ti': imgData.title,
        }
      });
    } else {
    }
    open_edit_amount_dialog(imgData);
    
    //open_edit_amount_dialog(imgData.id);

    //flyToCart(img);
    //$cartStore[imgData.id] = imgData;


  }
  function open_edit_amount_dialog(product) {
    console.log('open_edit_amount_dialog', product);
    $productCartModalStore.toggleModal(product.id);
  }
  let modal_body;

  function changeCategory(alb) {


    logStore.addLog({
      'a': 'פתיחת קטגוריה ממודל קטגוריה',
      't': 'open category',
      'f': {
        'type': 'category',
        'id': $current_album.id,
        'ti': $current_album.title,
      },
      'w': {
        'type': 'category',
        'id': alb.id,
        'ti': alb.title,
      }
    });
    setAlbum(alb);
  }
</script>


<div id="categoryModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
  <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
  <div class="modal_content" style="z-index: {modal_zIndex+10};">
    <div class="modal-header">
      <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
      <h5 class="modal-title">{$current_album.title}</h5>

      <div class="modal-header-links">

        <Dropdown id="modalCategoryList" class="category-menu">
          <DropdownToggle color="none" caret class="btn btn-outline-dark" aria-label="menu">


            כל הקטגוריות


          </DropdownToggle>
          <DropdownMenu>
            {#each $albumsJsonStore as alb}
              <DropdownItem>
                <button on:click={changeCategory(alb)} class="btn btn-dark" class:selected={$current_album.id==alb.id}>
                  {alb.title}
                </button>
              </DropdownItem>        
            {/each}
          </DropdownMenu>
        </Dropdown>
        <!--
        <nav class="navbar navbar-expand">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#categoryNavbarNavDropdown"
              aria-controls="categoryNavbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="categoryNavbarNavDropdown"
              bis_skin_checked="1">
              <ul class="navbar-nav align-self-end flex-wrap w-auto" id="categoryNav">
                {#each $albumsJsonStore as alb}
                    <li class="nav-item">
                      <a class="nav-link" aria-label="open category" role="button"><button on:click={setAlbum(alb)} class="btn btn-dark">{alb.title}</button></a>
                    </li>
                {/each}
                <li class="nav-item dropdown d-none">
                  <a class="btn btn-secondary dropdown-toggle" href="#"  role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        -->
      </div>
      
      <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
    </div>
    <div class="modal-body" bind:this={modal_body}>



      {#if $current_album}
      <h4 class="category-description">
        {#key $current_album.description}
        <SvelteMarkdown source={desctiption} />
        {/key}
      </h4>  
      
    {/if}
    {#if is_campain}
      <div class="timer">
        <h1 class="timer-title">{campain.album.title}</h1>
        <MyCountdown mainTextClr="black" borderClr='transperent' date={campain.endTime} />
      </div>
    {/if}
  
  {#await products}
  <Spinner
    size="200"
    speed="750"
    color="#A82124"
    thickness="2"
    gap="40"
  />  
  {:then prods} 
    <div class="category-items">
      {#each prods as img}
        <div class="category-item" data-category-prod-id="{img.id}">
          <div class="image-and-title-wraper">
            
            <div class="category-item-img-wraper" on:click="{open_product(img)}" >
              
              <img class="product-image" width="250px" height="250px" src="{CLOUDINARY_URL}f_auto,w_auto/{img.cimage}" alt="{img.description}" />
              {#if $userInfoStore && $userInfoStore.isLogin && $userInfoStore.me && $userInfoStore.me.is_superuser}
                  <div class="phisical_barcode-icon">
                      {img.has_physical_barcode? '✅':'❌'}
                  </div>
              {/if}
              {#if img.out_of_stock}
                <img src="https://res.cloudinary.com/ms-global/image/upload/v1648713887/msAssets/pngfind.com-pubg-player-png-5352359_1_bepovk.png" class="sold-out-icon" alt="מלאי לא זמין"/>
              {/if}
              <div class="price-tag" class:active={show_prices && img.out_of_stock == false} >{img.price + '₪'}</div>
            </div>
            <div class="img-title">{img.title}</div>
          </div>
          <div data-img={JSON.stringify(img)} class="like-btn-wraper"> <!--    -->
            <div class="like-btn like-btn-small">
              <button class:gold={$cartStore[img.id] != undefined} class="action-btn add-to-cart-btn" on:click="{likeBtnClicked(img)}">
                  {#if $cartStore[img.id] == undefined}
                    הוסף
                  {:else}
                    ✔️ נוסף({$cartStore[img.id].amount})
                  {/if}
              </button>
              <button class="action-btn read-more-btn" on:click={open_product(img)}>
                  פרטים
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/await}
  
  {#if $current_album}
    {#if $userInfoStore.isLogin == false}
      <h4 class="category-fotter">
        {#key $current_album.description}
          <SvelteMarkdown source={fotter} />
        {/key}
        </h4>
    {/if}
  {/if}
  
  
  
    </div>
    <div class="modal-footer">
      <img class="header-logo header-logo-r" alt="M.S. Global" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" />
      <h6 class="modal-title">{$current_album.title}</h6>
      <img class="header-logo header-logo-l" alt="M.S. Global" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" />
    </div>

    
    <!-- End of Dynamic Section -->
    

  
  
  
  
  
  
  
  
  
  </div>
</div>



<style lang="scss">
  .sold-out-icon {
        position: absolute;
        z-index: 1;
        border: none;
        background: none;
        //transform: translate(-50%, 0);

        width: 140px;
        height: auto;
        top: 30px;
        right: 0px;
    }

      .like-btn-wraper{
        display: flex;
        justify-content: center;
        align-items: center;
        flex:1;
        
      .like-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        //margin-top: 10px;
        margin-bottom: 10px;
        //visibility: visible;
        color: white;
        text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
        z-index: 1;
        //height: 75px;
        font-weight: bold;
        //pointer-events: none;
        text-align: center;
        min-height: 40px;
        //word-break: break-all;


        //background: #0000007a;
        border-radius: 25px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0;
        border: var(--swiper-slide-border) solid black;
        border-bottom-width: 0px;
        
        &.active {
          @include bg-gradient();
          //border: 1px solid red;
          //background: rgba(255, 255, 255, 0.478);
          //color:rgb(70, 70, 70);

        }
        
        .img-wraper {
          
          display: inline-flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          hr {
            height: 0px;
            border: 1px solid black;
            width: 100%;
            margin: 0px;
          }
          @media (hover: hover) {
            /*
            .btn-product-title {
              display:none;
            }
            hr {
              display:none;
            }*/
          }
          img {
            width:40px;
            height: 40px;
          }
          /*.btn-product-title {
            font-size: 1.2em;
            //text-overflow: ellipsis;
            overflow: hidden;
            white-space: normal;
            word-break: break-all;
            
            width: auto;
            height: 1.5em; 
            
            
            
          }*/
          .action {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .amount-before {
              width: 100%;
              display: flex;
              justify-content: space-around;
              align-items: center;
              flex: 1;
              .delete-btn {
                border: none;
                background: none;
                @media screen and (max-width: 357px) and (min-width: 330px){
                  padding: 0px;
                }
                &:hover {
                  svg {
                    fill: red;
                  
                  }
                }
              }
            
              .amount-text {
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: white;
                //width: 100%;
                
                
                flex-direction: column;
                .text {
                  font-size: 1em;
                  font-weight: bold;
                  
                  width: 100%;
                  @media screen and (max-width: 1115px) {
                    font-size: 0.9em;
                  }
                  @media screen and (max-width: 1040) {
                    font-size: 1em;
                  }
                  
                  @media screen and (max-width: 902px){
                    font-size: 0.8em;
                  
                  }
                  @media screen and (max-width: 840px){
                    font-size: 1em;
                    
                  }
                  @media screen and (max-width: 690px) {
                    font-size: 0.8em;
                  }
                  @media screen and (max-width: 600px) {
                    font-size: 0.75em;
                    font-weight: normal;
                  }
                  @media screen and (max-width: 555px) {
                    font-size: 1em;
                    font-weight: bold;
                  }
                  @media screen and (max-width: 469px) {
                    font-size: 0.9em;
                  }
                  @media screen and (max-width: 439px) {
                    font-size: 0.75em;
                  }
                  @media screen and (max-width: 330px) {
                    font-size: 1em;
                  }

                  input.amount-input {
                    height: 1.5em;
                    width: 1.5em;
                    border: none;
                    text-align: center;
                    background: none;
                    font-weight: bold;
                    outline: none;
                    width: 100%;;
                    /** remove arrows https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp*/
                    /* Chrome, Safari, Edge, Opera */
                    &::-webkit-outer-spin-button,
                    &::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    /* Firefox */
                      -moz-appearance: textfield;
                  }
                }
                .edit-amount-btn {
                  font-size: 1.2em;
                  padding-right: 10%;
                  padding-left: 10%;
                  font-weight: bold;
                }
              }
            }
            .like-btn-small {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    * {
                        margin: 0;
                        width: 100%;
                        flex:1;
                        flex-grow: 1;
                        flex-shrink: 0;
                    }
                    :global(.add-to-cart-btn){
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        display: inline-block;
                        font-weight: 400;
                        line-height: 1.5;
                        color: #212529;
                        text-align: center;
                        text-decoration: none;
                        vertical-align: middle;
                        cursor: pointer;
                        user-select: none;
                        border: 1px solid transparent;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        border-radius: 0.25rem;
                        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;

                        border-bottom-right-radius: 25px;
                    }
                    :global(.read-more-btn) {
                        width: 100%;
                        display: inline-block;
                        font-weight: 400; 
                        line-height: 1.5;
                        color: #212529;
                        text-align: center;
                        text-decoration: none;
                        vertical-align: middle;
                        cursor: pointer;
                        user-select: none;
                        border: 1px solid transparent;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        border-radius: 0.25rem;
                        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        border-bottom-left-radius: 25px;
                    }
                }
          }
          @media (hover: hover){
            .action {
              .text {
                font-size: 1.34em;
              }
            }
            &.active {
              .action {
                .text {
                  font-size: 1em;
                }
              }
            }
          }
          @media (hover: hover) {

          }
        }
        
      }
    }
:global(#modalCategoryList.show) {
}


  *:focus {
  outline: 0;
}


.phisical_barcode-icon {
        position: absolute;
        top: 90%;
        right: 10px;
        width: 20px;
        height: 20px;
        z-index: 1;
    }
/* Modal */

.modal .modal_content {
  @media screen and (max-width: 400px) {
    width: 95%;
  }
  .modal-title {
      font-size: 1.5em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  .modal-header {
    justify-content: space-between;
    
    
    .modal-header-links {
      flex:4;
      
      :global(.category-menu) {
        :global(.dropdown-menu.show) {
          max-height: 80vh;
          overflow-y: auto;
          left: 0%!important;
          @media screen and (max-width: 1100px) {
            grid-template-columns: repeat(4, 1fr);
            
          }
          @media screen and (max-width: 975px) {
            grid-template-columns: repeat(3, auto);
          }
          @media screen and (max-width: 770px) {
            grid-template-columns: repeat(2, auto);
            
          }
          @media screen and (max-width: 530px) {
            grid-template-columns: repeat(1, 1fr);
          }

          :global(.dropdown-item) {
            :global(.btn-dark.selected) {
              background-color: rgb(223, 223, 223);
              color: black;
              box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
            }
          }
        }
      }
    }
    h5 {
      flex:4;
    }

  }
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;

  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
  height: 90%;
  overflow: auto;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,0.7);
  border-radius: 4px;
  width: 90%;
  text-align: center;
  
  .modal-body{
    overflow-y: scroll;
    direction: ltr;
    @media screen and (max-width: 420px) {
      padding:0.25em;
      
    }
    .timer {
      padding-top:15px;
      padding-bottom: 15px;
      margin-bottom: 5px;
      //@include bg-gradient();
      @include bg-image();
      //@include bg-image-vars(rgb(253, 253, 253), rgba(218, 218, 218, 0.5));
      .timer-title {
        text-align: center;
        padding:0px;
        margin: 0px;
      }
    }
  .category-items {
    direction: rtl;
    display: grid;
    grid-auto-rows: 1fr;
    grid-auto-flow: row;
    grid-template-columns: repeat(5, 1fr);
    @media screen and (max-width: 1040px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media screen and (max-width: 840px) {
      grid-template-columns: repeat(3, 1fr);
      .amount-text {
        display: none;
      }
      /**
      color: black;
      text-shadow: none;
      font-weight: bold;
      */
      .category-item{
        .like-btn-wraper  {
          .like-btn {
            .img-wraper {
              .btn-product-title {
                font-size: 1em;
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 555px) {
      grid-template-columns: repeat(2, 1fr);
      //max-width: 155px;
    }
    @media screen and (max-width:330px){
      grid-template-columns: repeat(1, 1fr);
      .category-item{
        padding: 25px!important;
      }
    }
    .image-and-title-wraper {
      position: relative;
    }
    .category-item {
      cursor: pointer;
      padding: 5px;
      flex:1;
      height: 100%;
      width: 100%;
      .category-item-img-wraper {
        position: relative;
        .price-tag {
                    position: absolute;
                    bottom: 5px;
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

        &:hover {
          background-color: black;
          transform: scale(1.0);
          z-index: 1;
        }

        .product-image {
          width: 100%;
          height: auto;
          z-index: 2;
          @include bg-image;

          &:hover {
            transform: scale(1.0);
            -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            -webkit-mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
            mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
          }
        }
      }

      position: relative;
      .img-title {
          position: absolute;
          //display: none;
          color: white;
          z-index: 2000;
          font-size: 1.2em;
          pointer-events: none;
          top: 0%;
          text-align: center;
          width: 100%;
          z-index: 9999;


          
          color: white;
          //text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
          z-index: 1;
          font-weight: bold;
          background: #0000007a;
          border-radius: 25px;
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0;
          border: var(--swiper-slide-border) solid black;
          border-bottom-width: 0px;
        }
      .category-item-img-wraper {

        img.product-image {
          height: auto;
          /*padding: 5px;*/
          border-radius: 0px;
          border-top-right-radius: 25px;
          border-top-left-radius: 25px;


          &:hover {
            //transform: scale(1.0);
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
            + .img-title {
              display: block!important;;
              transition: transform 0.2s;
              //transform: translate(-50%, -80%);
              font-weight: 700;
            }
          }

          
        }
        
      }

      
    }
  }
  }



  .modal-footer {
    @include bg-gradient();
    //max-height: 10%;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    padding: 0px;
    .header-logo {
      height: 35px;
    }

    .modal-title {
      font-weight: 700;
      font-size: x-large;
      
    }
    @media screen and (max-width: 600px) {
      padding:0px;
      .header-logo {
        display: none;
      }
      .modal-title {
        margin:auto;
      }
    }
  }
}



</style>