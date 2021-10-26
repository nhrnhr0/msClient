<script>
  import SvelteMarkdown from 'svelte-markdown'
  import {
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
    productModalStore,
    _modal_z_index_incrementor
  } from './../../stores/stores';
  import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle
        } from 'sveltestrap';

  let isModalOpen;
  export function toggleModal() {
    isModalOpen = !isModalOpen;
    if(isModalOpen == false) {
      $stateQuery['category']='-1';
    }
  }
  export function isOpen() {
    return isModalOpen;
  }
  import { stateQuery} from './../../stores/queryStore'
  let products = []
  let current_album = new writable({});
  let title = 'loading'
  let desctiption = '';
  let fotter = '';
  let modal_zIndex = 0;

  export function setAlbum(album) {
    current_album.set(album);
    desctiption = album.description;
    fotter = album.fotter;
    products = get_album_details(album.id);
    title = album.title;
    modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
    $stateQuery['category']=album.id;
  }

  function open_product(imgId) {
    let catalogId = $current_album.id
    
    if ($productModalStore.isOpen()) {
      $productModalStore.toggleModal();
    }
    $productModalStore.toggleModal();
    $productModalStore.setProduct(catalogId, imgId);
  }
</script>


<div id="categoryModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
  <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
  <div class="modal_content" style="z-index: {modal_zIndex+10};">
    <div class="modal-header">
      <h5 class="modal-title">{$current_album.title}</h5>

      <div class="modal-header-links">

        <Dropdown id="modalCategoryList">
          <DropdownToggle color="none" caret class="btn btn-outline-dark" aria-label="menu">  
            

              כל הקטגוריות
            

          </DropdownToggle>
          <DropdownMenu>            
            {#each $albumsJsonStore as alb}
              <DropdownItem>
                <button on:click={setAlbum(alb)} class="btn btn-dark">
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
    </div>
    <div class="modal-body">



      {#if $current_album}
      <h4 class="category-description">
        {#key $current_album.description}
        <SvelteMarkdown source={desctiption} />
        {/key}
      </h4>  
    {/if}
    
  
  {#await products}
    loading...
  {:then prods} 
    <div class="category-items">
      {#each prods as img}
        
  
  
  
  
      <div class="category-item" data-category-prod-id="{img.id}">
        <div class="category-item-img-wraper" on:click="{open_product(img.id)}" >
          <img class="product-image" width="250px" height="250px" src="{STATIC_BASE}{img.image}" alt="{img.description}" />
          <div class="img-title">{img.title}</div>
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
      <h5 class="modal-title">{$current_album.title}</h5>
      <img class="header-logo header-logo-l" alt="M.S. Global" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" />
    </div>

    
    <!-- End of Dynamic Section -->
    <button title="Close" on:click={toggleModal} class="close_modal">x</button>
  
  
  
  
  
  
  
  
  
  
  
  </div>
</div>



<style lang="scss">
:global(#modalCategoryList.show) {
  
  :global(.dropdown-menu) {
    display: flex;
      flex-flow: row wrap;
      width: 70vw;
      justify-content: start;
      :global(.dropdown-item){
        flex:1;
        flex-grow: 0;
        flex-shrink: 1;
      }
  }
}


  *:focus {
  outline: 0;
}


/* Modal */

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
  .modal-header {
    justify-content: space-around;
  }
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;

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
  
  .modal-body{
    overflow-y: scroll;

  .category-items {
        display: grid;
    grid-column: 1fr 1fr 1fr;
    grid-template-columns: repeat(5, 1fr);

    .category-item {
      cursor: pointer;
      padding: 5px;

      .category-item-img-wraper {
        &:hover {
          background-color: black;
          transform: scale(1.1);
          z-index: 1;
        }

        .product-image {
          width: 100%;
          height: auto;
          z-index: 2;
          @include bg-image;

          &:hover {
            transform: scale(1.1);
            -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            -webkit-mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
            mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
          }
        }
      }



      &.checked {
        /*.like-wrapper a {
            color: #000;
            border: 1px solid black;
  
            &:hover {
              //color: white;
            }
  
            &:after {
              width: 100%;
              height: 100%;
            }
            span {
              img {
  
              }
            }
          }
  */
      }

      &:hover {}

      position: relative;

      .category-item-img-wraper {
        img {
          height: auto;
          /*padding: 5px;*/
          border-radius: 0px;
          border-top-right-radius: 15px;
          border-top-left-radius: 15px;


          &:hover {
            transform: scale(1.1);
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
        position: absolute;
        display: none;
        color: white;
        z-index: 2000;
        bottom: 50%;
        transform: translate(-50%, 0%);
        //top: 0px;
        font-size: 1.5em;

        left: 50%;
        pointer-events: none;
        text-align: center;
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
</style>