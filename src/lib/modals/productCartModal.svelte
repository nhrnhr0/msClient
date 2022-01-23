<script>
  import {
    albumsJsonStore, colorsJsonStore, sizesJsonStore
  } from "./../../stores/stores"
  import { cartStore } from './../../stores/cartStore';
  import {
    writable
  } from "svelte/store";
  import Select from 'svelte-select';

  import {
    activeModalsStore
  } from '$lib/modals/modalManager';
  import {
    _modal_z_index_incrementor
  } from './../../stores/stores';
  import {
    get_album_details
  } from './../../api/api';
  import {
    CLOUDINARY_URL
  } from './../../api/consts';
  let is_loaded = false;
  let productData = writable([]);
  let all_products_in_category = undefined;

  let modal_zIndex = 0;
  export let isModalOpen = false;
  let current_album = writable(null);
  export function toggleModal() {
    isModalOpen = !isModalOpen;
    activeModalsStore.modalToggle('productCart', isModalOpen);
    if (isModalOpen == false) {
      is_loaded = false;
    } else {
      modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
    }
  }
  export function isOpen() {
    return isModalOpen;
  }
  const MAX_RETRY = 10;
  let colorsOptions =[];
  export function set_product(product_id, catalog_id, retry = 0) {
    is_loaded = false;
    if ($albumsJsonStore == undefined || $albumsJsonStore.length == 0 && retry < MAX_RETRY) {
      setTimeout(() => {
        set_product(product_id, catalog_id, retry + 1);
      }, 100);
    } else {
      current_album.set($albumsJsonStore.filter((val) => {
        return val.id == catalog_id;
      })[0]);
    }
    let productsPromise = get_album_details(catalog_id);
    productsPromise.then((v) => {
      all_products_in_category = v;
      for (let i = 0; i < v.length; i++) {
        if (v[i].id == product_id) {
          productData.set(v[i]);
          colorsOptions = $productData.colors.map((item) =>$colorsJsonStore[item])
          is_loaded = true;
          break;

        }
      }
    });

  }

  function getOptionLabel(option, filterText) {
    let ret = `<div class="option-label"><div class="inner-box" style="background-color: ${$colorsJsonStore[option.id].color}"></div>` + option.name + `</div>`;
    return ret;
  }

  function colorSelected(e){ 
    console.log(e);
    for(let i= 0; i < colorsOptions.length; i++) {
      if(colorsOptions[i].id == e.detail.id) {
        colorsOptions.splice(i, 1);
        // deep copy colorsOptions to colorsOptions
        colorsOptions = [...colorsOptions];
        
        break;  
      }
    }
    if(cartStore.isInCart($productData) == false) {

      cartStore.addToCart($productData);
      let prod = cartStore.getProduct($productData.id);
      // prod.entries = marge prod.entries and the new selected color
      if(prod.mentries == undefined) {
        prod.mentries = {};
      }
      let empry_sizes_object = $productData.sizes.map((item) => {
        return {
          'quantity': 0
        }
      });
      prod.mentries[e.detail.id] = empry_sizes_object;
    }
  }
</script>


<div id="productCartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
  <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
  <div class="modal_content" style="z-index: {modal_zIndex+10};">
    <div class="modal-header">
      <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
      <h5 class="modal-title">בחר צבעים ומידות</h5>
      <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
    </div>

    <div class="modal-body">
      {#if is_loaded}
      <div class="product-details">
        <div class="product-img">
          <img src="{CLOUDINARY_URL}f_auto,w_auto/{$productData.cimage}" alt="{$productData.title}">
        </div>
        <div class="product-title">
          <h1>{$productData.title}</h1>
        </div>
      </div>
          <div class="product-attributes">
            <table class="product-table">
              <thead>
                <tr>
                  <th class="sticky-col">צבע</th>
                  {#each $productData.sizes as size_id}
                    <th class="size-header">{$sizesJsonStore[size_id].size}</th>
                  {/each}
                  <th class="sticky-col-right">מחק</th>
                </tr>
              </thead>
              <tbody>
                {#if $productData.mentries}
                {#each Object.keys($productData.mentries) as p_entry}
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[p_entry].color}"></div>{$colorsJsonStore[p_entry].name}</div>
                    </td>
                    {#each Object.keys($productData.mentries[p_entry]) as size_id}
                      <td class="size-cell">
                        <input class="size-input" type="number" bind:value="{$productData.mentries[p_entry][size_id].quantity}" min="0" max="9999" >
                      </td>
                    {/each}
                    <td class="sticky-col-right">
                      <button class="remove-button" on:click|preventDefault="{delete_product_from_cart(key)}">
												<svg xmlns="http://www.w3.org/2000/svg"  width="16px" height="16px" viewBox="0 0 32 36"><path fill="currentColor" d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"/></svg>
											</button>
                    </td>
                  </tr>
                {/each}
                {/if}
                <tr class="last-row">
                  <td class="sticky-col">
                    <!-- input select color from aviable colors -->
                    <Select getOptionLabel={getOptionLabel} on:select={colorSelected} optionIdentifier={'id'} labelIdentifier={'name'} items={colorsOptions}></Select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr>
          
        {/if}
      </div>

  </div>
</div>

<style lang="scss">

  .modal-body {
    .sticky-col {
  position: -webkit-sticky;
  position: sticky;
  background-color: white;
  min-width: 80px;
    position: sticky;
    position: -webkit-sticky;
    position: sticky;
    right: 0px;
}
.sticky-col-right {
  position: -webkit-sticky;
  position: sticky;
  background-color: white;
  min-width: 80px;
    position: sticky;
    position: -webkit-sticky;
    position: sticky;
    left: 0px;
}
    .product-details {
      display:flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .product-img {
        img {
          width: 100%;
          max-width: 150px;

          max-height: 150px;
        }
      }
    }
    .product-attributes {
      width: 100%;
      
      padding-bottom: 450px;
      
      overflow-x: scroll;
      border: 1px solid #777777;
      table.product-table {
          border-spacing: 0;
          thead {
            tr {
              th {
                text-align: center;
                border-bottom: 1px solid rgb(85, 85, 85);
                border-left: 1px solid rgb(85, 85, 85);
                &:last-child {
                  border-left: none;
                }

                &:first-child {
                  min-width: 120px;
                }
                &:first-child, &:last-child {
                  width: 100%;
                }
              }
              .size-header {
                text-align: center;
                border-bottom: 1px solid rgb(85, 85, 85);
                border-left: 1px solid rgb(85, 85, 85);
                min-width: 90px;
                &:last-child {
                  border-left: none;
                }
              }
            }
          }
          tbody {
            tr {
              td {
                &.size-cell {
                  input {
                    width: 100%;
                    text-align: center;
                    border: 1px solid #777777;
                    border-radius: 5px;
                    background: none;
                    padding: 5px;
                    &:focus {
                      outline: none;
                    }
                  }
                }
                .remove-button {
                  background: none;
                  border: none;
                  padding: 0;
                  margin: auto;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
                  svg {
                    width: 16px;
                    height: 16px;
                    fill: #777777;
                  }
                  &:hover, &:focus {
                    svg {
                      path {
                       color: #cc0000;
                      }
                    }
                  }
                }
                .color-box {
                  display: flex;
                  justify-content: start;
                  align-items: center;
                  
                  .inner {
                    margin-left: 15px;
                    width: 25px;
                    height: 25px;
                  }
                }
              }
            }
            tr.last-row {
                td {
                  min-width: 80px;
                  :global(.selectContainer) {
                    :global(.listContainer) {
                      :global(.listItem) {
                        color:black;
                        :global(.item ){ 
                          :global(.option-label) {
                            display: flex;
                            flex-direction: row;
                            justify-content: start;
                            align-items: center;
                            :global(.inner-box) {
                              width: 30px;
                              height: 30px;
                              border-radius: 50%;
                              margin-left: 5px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
            }
          }
        }
      }
    }
</style>