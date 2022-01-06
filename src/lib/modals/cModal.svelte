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
    _modal_z_index_incrementor
  } from './../../stores/stores';
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Spinner
  } from 'sveltestrap';
  import {
    selectTextOnFocus
  } from '$lib/ui/inputActions';


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

  function likeBtnClicked(e) {
    let img = e.currentTarget.parentElement.querySelector('.product-image');
    let imgData = JSON.parse(e.currentTarget.dataset["img"]);
    if (cartStore.isInCart(imgData) == false) {
      cartStore.addToCart(imgData);
      flyToCart(img);
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
      document.querySelector(`#amount_${imgData.id}`).focus();
      /*
      cartStore.removeFromCart(imgData);
      logStore.addLog(
                            {
                                'a': 'הסר מהעגלה ממודל קטגוריה',
                                't': 'remove from cart',
                                'f': {
                                    'type':'category',
                                    'id':$current_album.id,
                                    'ti':$current_album.title
                                },
                                'w':{
                                    'type':'product',
                                    'id':imgData.id,
                                    'ti':imgData.title, 
                                }
                            }
                            );*/
    }

    //flyToCart(img);
    //$cartStore[imgData.id] = imgData;


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
        <h1 class="timer-title">{campain.name}</h1>
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
        <div class="category-item-img-wraper" on:click="{open_product(img)}" >
          <img class="product-image" width="250px" height="250px" src="{CLOUDINARY_URL}f_auto,w_auto/{img.cimage}" alt="{img.description}" />
          <div class="img-title">{img.title}</div>
        </div>
        <div  on:click={likeBtnClicked} data-img={JSON.stringify(img)} class="like-btn-wraper">
          {#if $cartStore[img.id] == undefined}
          <button  id="categoryModalLikeBtn" class="like-btn">
            <div class="img-wraper">
              <div class="btn-product-title">
                          {img.title}
              </div>
              <div class="action">
                  <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
                  <div class="text">
                    הוסף
                  </div>
              </div>
            </div>
            
          </button>
          {:else}

          <button  id="categoryModalLikeBtn" class="like-btn active">
            <div class="img-wraper">
              <div class="btn-product-title">
                          {img.title}
              </div>
              <div class="action">
                  



                <div class="amount-before">
                  <button class="delete-btn" on:click|stopPropagation="{remove_from_cart}" data-product-id="{img.id}">
                    <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>
                  </button>
                    <div class="amount-text">
                      כמות:
                    </div>
                  </div>
                  <div class="text">
                      <input id="amount_{img.id}" use:selectTextOnFocus class="item-amount" name="item_amount" min="1" max="9999" type="number" bind:value={$cartStore[img.id].amount} />
                  </div>
                  




                
            </div>
            </div>
            
          </button>

          {/if}
          <!--
          <button  id="categoryModalLikeBtn" class:active={$cartStore[img.id] != undefined} class="like-btn">
            <div class="img-wraper">
              <div class="btn-product-title">
                          {img.title}
              </div>
              <div class="action">
              {#if $cartStore[img.id] != undefined}
                  <img alt="V" src="https://img.icons8.com/external-becris-lineal-becris/48/000000/external-check-mintab-for-ios-becris-lineal-becris-1.png"/>
                  <div class="text">
                    נוסף
                  </div>
                {:else}
                  <img alt="plus" src="https://res.cloudinary.com/ms-global/image/upload/v1635236678/msAssets/icons8-plus-48_tlk4bt.png"/>
                  <div class="text">
                    הוסף
                  </div>
              {/if}
            </div>
            </div>
            
          </button>
          -->
        </div>
        <!--
        <div>
          <div class="like-btn" name="like-btn">
            <div class="like-wrapper">
              <a name="like-btn">
              <span name="like-btn">
                TODO:
              </span></a>
            </div>
          </div>
        </div>
        -->
      </div>
  
  
  
  
  
  
  
      {/each}
    </div>
  {/await}
  
  {#if $current_album}
  <h4 class="category-fotter">
    {#key $current_album.description}
      <SvelteMarkdown source={fotter} />
    {/key}
    </h4>
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
        height: 75px;
        font-weight: bold;
        //pointer-events: none;
        text-align: center;
        min-height: 40px;
        //word-break: break-all;


        background: #0000007a;
        border-radius: 25px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0;
        border: var(--swiper-slide-border) solid black;
        border-bottom-width: 0px;
        .text {
          display:inline-block;
          font-size: 1.5em;
          
        }
        
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
          @media (hover: hover) {
            .btn-product-title {
              display:none;
            }
          }
          img {
            width:40px;
            height: 40px;
          }
          .btn-product-title {
            font-size: 1.2em;
            //text-overflow: ellipsis;
            overflow: hidden;
            white-space: normal;
            word-break: break-all;
            
            width: auto;
            height: 1.5em; 
            
            
            
          }
          .action {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .text {
              display: inline-block;
              font-size: 1em;
              input.item-amount {
                text-align: center;
                border: none;
                background: transparent;
                border-radius: 999999px;
                border-bottom-left-radius: 0px;
                border-top-left-radius: 0px;
                padding: 0;
                margin: 0;
                margin-left: 5px;
                font-weight: bold;
                direction: rtl;
                &:focus {
                  outline: none;
                }
              }
            }

            .amount-before {
              font-size: 1.2em;
              display:flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
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
                  fill:red;
                }
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


/* Modal */

.modal .modal_content {
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
          @media screen and (max-width: 900px) {
            grid-template-columns: repeat(3, auto);
          }
          @media screen and (max-width: 600px) {
            grid-template-columns: repeat(2, auto);
            
          }
          @media screen and (max-width: 400px) {
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
        display: grid;
    grid-column: 1fr 1fr 1fr;
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
    @media screen and (max-width: 490px) {
      grid-template-columns: repeat(2, 1fr);
      //max-width: 155px;
    }
    .category-item {
      cursor: pointer;
      padding: 5px;
      flex:1;
      flex-grow: 0;
      flex-shrink: 1;
      .category-item-img-wraper {
        

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

      .category-item-img-wraper {
        img {
          height: auto;
          /*padding: 5px;*/
          border-radius: 0px;
          border-top-right-radius: 15px;
          border-top-left-radius: 15px;


          &:hover {
            transform: scale(1.0);
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
          }

          &:hover+.img-title {
            display: block;
            transition: transform 0.2s;
            //transform: translate(-50%, -80%);
            font-weight: 700;
          }
          
        }
      }

      .img-title {
        /*position: absolute;
        display: none;
        color: white;
        z-index: 2000;
        bottom: 50%;
        transform: translate(-50%, 0%);
        //top: 0px;
        font-size: 1.5em;

        left: 50%;
        pointer-events: none;
        text-align: center;*/
        position: absolute;
        display: none;
        color: white;
        z-index: 2000;
        /* bottom: 50%; */
        /* transform: translate(-50%, 0%); */
        font-size: 1.5em;
        /* left: 50%; */
        pointer-events: none;
        top: 50%;
        text-align: center;
        width: 100%;
      
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