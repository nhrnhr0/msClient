<script>
  import {
    writable
  } from 'svelte/store';
  import SvelteMarkdown from 'svelte-markdown'
  import {
    STATIC_BASE
  } from '../../api/consts'
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  import {
    get_album_details
  } from './../../api/api';
  import {albumsJsonStore,productModalStore, _modal_z_index_incrementor} from './../../stores/stores'

  export let _open = false;
  export const toggle = () => (_open = !_open);
  export const open = () => (_open = true);
  export const close = () => (_open = false);
  let products = []
  let current_album = new writable({});
  let title = 'loading'
  let desctiption = '';
  let fotter = '';
  let modal_zIndex = 0;

    function categoryModalOpen(e) {
      console.log('categoryModalOpen: modal_zIndex: ',modal_zIndex , e);
      let items = document.querySelectorAll('.modal.show');
      let zIndex = $_modal_z_index_incrementor++ + 1040 + (10 * items.length);
      modal_zIndex = zIndex;
      //setTimeout(function () {
          //document.querySelector('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      //}, 0);
    }


  export function setAlbum(album) {
    current_album.set(album);
    desctiption = album.description;
    fotter = album.fotter;
    products = get_album_details(album.id);
    title = album.title;
  }
  function open_product(imgId) {
    let catalogId= $current_album.id
    $productModalStore.setProduct(catalogId, imgId);
    $productModalStore.toggleModal();
  }
</script>

<div class="catalogModalWraper">
  <Modal style="z-index={modal_zIndex}"  on:open={categoryModalOpen} id="categoryModal" isOpen={_open} {toggle}>
    <ModalHeader {toggle}>






      <div class="modal-header-links">
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



                


              </ul>
            </div>
          </div>
        </nav>
      </div>









    </ModalHeader>
    <ModalBody>


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
      </ModalBody>
      <ModalFooter>
        <img class="header-logo header-logo-r" alt="M.S. Global" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" />
        <h5 class="modal-title">{$current_album.title}</h5>
        <img class="header-logo header-logo-l" alt="M.S. Global" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" />

      </ModalFooter>
    </Modal>
  </div>



  <style lang="scss">
      
    </style>