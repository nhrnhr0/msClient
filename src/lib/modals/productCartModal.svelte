<script>
  import {
    colorsJsonStore,
    sizesJsonStore
  } from "./../../stores/stores";
  import {selectTextOnFocus} from "$lib/ui/inputActions";
  import {
    cartStore
  } from './../../stores/cartStore';
  import {
    writable
  } from "svelte/store";
  import {
    fade,
    fly
  } from 'svelte/transition';
  import {
    activeModalsStore
  } from '$lib/modals/modalManager';
  import {
    _modal_z_index_incrementor
  } from './../../stores/stores';
  import {
    CLOUDINARY_URL
  } from './../../api/consts';
  let is_loaded = false;
  let modal_zIndex = 0;
  export let isModalOpen = false;

  export function toggleModal(product_id_) {
    isModalOpen = !isModalOpen;
    activeModalsStore.modalToggle('productCart', isModalOpen);
    // modal is close
    
    if (isModalOpen == false) {
      is_loaded = false;
      last_active_input = null;
      // if the last product amount was 0 when close: remove from cart
      if (product_id != undefined && $cartStore[product_id] != undefined && $cartStore[product_id].amount <= 0) {

        cartStore.removeFromCartById(product_id);
      }
      
    // modal is open
    } else {
      modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
      set_product(product_id_);
    }
  }
  export function isOpen() {
    return isModalOpen;
  }
  let product_id = 0;
  const MAX_RETRY_COUNT = 3;
  function set_product(product_id_, retrys = 0) {
    product_id = product_id_;
    is_loaded = false;
    if (MAX_RETRY_COUNT < retrys) {
      return;
    }
    if ($colorsJsonStore == undefined || $colorsJsonStore.length == 0) {
      setTimeout(() => {
        set_product(product_id, retrys + 1);
      }, 50);
      return;
    }
    if ($sizesJsonStore == undefined || $sizesJsonStore.length == 0) {
      setTimeout(() => {
        set_product(product_id, retrys + 1);
      }, 50);
      return;
    }
    if ($cartStore[product_id].mentries == undefined) {
      let mentries = {};
      for(let clrIdx = 0; clrIdx < $cartStore[product_id].colors.length; clrIdx++) {
        mentries[$cartStore[product_id].colors[clrIdx]] = {};
        for(let sizeIdx = 0; sizeIdx < $cartStore[product_id].sizes.length; sizeIdx++) {
          mentries[$cartStore[product_id].colors[clrIdx]][$cartStore[product_id].sizes[sizeIdx]] = {};
          if($cartStore[product_id].varients.length != 0) {
            for(let varIdx = 0; varIdx < $cartStore[product_id].varients.length; varIdx++) {
              mentries[$cartStore[product_id].colors[clrIdx]][$cartStore[product_id].sizes[sizeIdx]][$cartStore[product_id].varients[varIdx].id] = {
                quantity: undefined
              };
            }
          }else {
            mentries[$cartStore[product_id].colors[clrIdx]][$cartStore[product_id].sizes[sizeIdx]] = {
              quantity: undefined
            };
          }
        }
      }
      $cartStore[product_id].mentries = mentries;
    }
    is_loaded = true;
  }
  $: {
    // $productData.amount = sum(cartStore[$productData.id].mentries[color_id][size_id].quantity) for color_id and size_id in cartStore[$productData.id].mentries
    let total_amount = 0;
    
    if ($cartStore[product_id] && $cartStore[product_id].mentries && $cartStore[product_id].show_sizes_popup) {
      $cartStore[product_id].colors.forEach(color => {
        $cartStore[product_id].sizes.forEach((size, size_idx) => {
          if($cartStore[product_id].varients.length == 0) {
            total_amount += $cartStore[product_id].mentries[color][size].quantity || 0;
          }else {
            $cartStore[product_id].varients.forEach((varient, varient_idx) => {
              total_amount += $cartStore[product_id].mentries[color][size][varient.id].quantity || 0;
            });
          }
        });
      });
      $cartStore[product_id].amount = total_amount;
    }
  }
  /*function getOptionLabel(option, filterText) {
    if(option.id != undefined && option.id != null && option.id != '' && $colorsJsonStore != undefined && $colorsJsonStore[option.id] != undefined){
    let ret = `<div class="option-label"><div class="inner-box" style="background-color: ${$colorsJsonStore[option.id]?.color}"></div>` + option?.name + `</div>`;
    return ret;
    }
    return '';
  }
  function colorSelected(e){ 
    console.log(e);
    for(let i= 0; i < colorsOptions.length; i++) {
      if(colorsOptions[i].id == e.detail.id) {
        colorsOptions.splice(i, 1);
        // deep copy colorsOptions to colorsOptions
        colorsOptions = [...colorsOptions];
        color_select_el.handleClear();
        break;
      }
    }
    if(cartStore.isInCart($productData) == false) {

      cartStore.addToCart($productData);
    }
    debugger;
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
      cartStore.setProduct(prod);
  }*/

  function clear_sizes_entries(color_key) {
    $cartStore[product_id].mentries[color_key] = $cartStore[product_id].sizes.map((item) => {
      return {
        'quantity': undefined
      }
    });
  }

  function remove_from_cart() {
    // mybe it's nessesary to delete the $cartStore[product_id].mentries as well
    cartStore.removeFromCart($cartStore[product_id]);
    toggleModal();
  }

  function add_to_amount(amount) {
    if (last_active_input == null) {
      show_add_amount_focus_error = true;
    }else {
      show_add_amount_focus_error = false;
      if($cartStore[product_id].show_sizes_popup) {
        let originalVal = last_active_input.value;
        if (originalVal == '') {
          originalVal = 0;
        }
        let val = parseInt(originalVal) + amount;
        //let obj = $cartStore[product_id].mentries;
        debugger;
        last_active_input.value = val;
        last_active_input.dispatchEvent(new Event('input', {bubbles:true}));
        last_active_input.focus();
      }else {
          $cartStore[product_id].amount += amount;
      }
    }
}
  let show_add_amount_focus_error = false;;
  let last_active_input = null;
  let last_store_path = undefined;
  function input_blur_activate(e) {

  }
  function input_focus_activate(e, storePath) {
    last_active_input = e.target;
    last_store_path = storePath;
    
    console.log('last_active_input', last_active_input);
    console.log('last_store_path', last_store_path);
    if (show_add_amount_focus_error) {
      show_add_amount_focus_error = false;
    }
  }
</script>


<div id="productCartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
  <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
  {#if isModalOpen}
  <div class="modal_content"in:fly="{{ y: 200, duration: 350 }}" out:fade style="z-index: {modal_zIndex+10};">
    <div class="modal-header">
      <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
      <h5 class="modal-title">עריכת כמות ל-
        <span class="product-name">{$cartStore[product_id]?.title}</span>
      </h5>
      <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
    </div>

    <div class="modal-body">
      {#if is_loaded && $cartStore[product_id] != undefined}
      <div class="product-grid-wraper">
        <div class="product-details">
          <div class="product-img">
            <img width="150" height="150" src="{CLOUDINARY_URL}f_auto,w_auto/{$cartStore[product_id].cimage}" alt="{$cartStore[product_id].title}">
          </div>
          <div class="product-title">
            <h1>{$cartStore[product_id].title}</h1>
          </div>
        </div>
        {#if $cartStore[product_id].show_sizes_popup}
          <div class="product-attributes">
            <table class="product-table">
              <thead>
                <tr>
                  <th class="sticky-col const-size-cell">צבע</th>
                  {#if $cartStore[product_id].varients.length != 0}
                    <th class="const-size-cell">מודל</th>
                  {/if}
                  {#each $cartStore[product_id].sizes as size_id}
                    <th class="size-header">{$sizesJsonStore[size_id]?.size}</th>
                  {/each}
                  <th class="delete-cell-style">מחק</th>
                </tr>
              </thead>
              <tbody>
                {#if $cartStore[$cartStore[product_id].id] != undefined && $cartStore[$cartStore[product_id].id].mentries}

                {#each $cartStore[product_id].colors as color, color_idx}
                  <!-- color: 84 -->
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color].color}"></div>{$colorsJsonStore[color].name}</div>
                    </td>
                    {#if $cartStore[product_id].varients.length != 0}
                      <td>
                        {#each $cartStore[product_id].varients as varient }
                        <div class="varient-box cls-cell">
                          {varient.name}
                        </div>
                        {/each}
                        
                      </td>
                    {/if}
                    {#each $cartStore[product_id].sizes as size}
                      <td class="size-cell">
                        
                          {#if $cartStore[product_id].varients.length == 0}
                            <div class="cell-wraper">
                              <input class="size-input cls-cell" class:has-focus-error={show_add_amount_focus_error} type="number" on:blur="{input_blur_activate}" on:focus="{(e)=> {input_focus_activate(e, `${color}.${size}`);}}" placeholder="כמות" bind:value="{$cartStore[product_id].mentries[color][size].quantity}" min="0" max="9999" >
                            </div>
                          {:else}
                          
                            {#each $cartStore[product_id].varients as {id, name}, idx}
                            <div class="cell-wraper">
                              <input id="input_entery_{product_id}_{size}_{color}_{id}" on:focus="{(e)=> {input_focus_activate(e, `${color}.${size}.${id}`);}}" class="size-input cls-cell" type="number" placeholder="כמות" bind:value="{$cartStore[product_id].mentries[color][size][id].quantity}" min="0" max="9999" >
                            </div>
                            {/each}
                          
                          {/if}
                        
                      </td>
                      
                    {/each}
                    <td class="delete-cell-style">
                      <button class="remove-button">
                        <svg xmlns="http://www.w3.org/2000/svg" on:click={clear_sizes_entries(color)}  width="16px" height="16px" viewBox="0 0 32 36"><path fill="currentColor" d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"/></svg>
                      </button>
                    </td>
                  </tr>
                  
                {/each}
                
                <!--
                {#each Object.keys($cartStore[$cartStore[product_id].id].mentries) as color_entry}
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color_entry].color}"></div>{$colorsJsonStore[color_entry].name}</div>
                    </td>
                    {#each Object.keys($cartStore[product_id].mentries[color_entry]) as size_id}
                      <td class="size-cell">
                        <input class="size-input" type="number" placeholder="הזן כמות" bind:value="{$cartStore[product_id].mentries[color_entry][size_id].quantity}" min="0" max="9999" >
                      </td>
                    {/each}
                    <td class="delete-cell-style">
                      <button class="remove-button">
                        <svg xmlns="http://www.w3.org/2000/svg" on:click={clear_sizes_entries(color_entry)}  width="16px" height="16px" viewBox="0 0 32 36"><path fill="currentColor" d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"/></svg>
                      </button>
                    </td>
                  </tr>
                {/each}
                  -->





                <tr>
                  <td class="total-cell">
                    <div>
                      סך הכל:
                    </div>
                  </td>
                  {#if $cartStore[product_id].varients.length != 0}
                    <td class="total-cell">
                      <div>-</div>
                    </td>
                  {/if}

                    <!--
                      cartStore[$productData.id].mentries[color_id][size_id].quantity
                    -->
                    <!-- td with the calculated total quantity of each size in mentries -->
                    
                      {#each Object.keys($cartStore[product_id].mentries[Object.keys($cartStore[product_id].mentries)[0]]) as size_id}
                        <td class="total-cell">
                          <div>
                          <!-- calculate the sum of cartStore[$cartStore[product_id].id].mentries[X][size_id].quantity -->
                          {#if $cartStore[product_id].varients.length == 0}
                            { Object.keys($cartStore[$cartStore[product_id].id].mentries).reduce((acc, curr) => {
                              return acc + ($cartStore[$cartStore[product_id].id].mentries[curr][size_id].quantity || 0);
                            }, 0)}
                          {:else}
                          { Object.keys($cartStore[$cartStore[product_id].id].mentries).reduce((acc, curr) => {
                            let sum = 0;
                            for(let i = 0; i < $cartStore[product_id].varients.length; i++){
                              sum += ($cartStore[$cartStore[product_id].id].mentries[curr][size_id][$cartStore[product_id].varients[i].id].quantity || 0);
                            }
                            return acc + sum;
                          }, 0)}
                          {/if}
                          </div>
                        </td>
                      {/each}
                      <td class="total-cell">
                        <div>
                          {$cartStore[product_id].amount}
                        </div>
                      </td>
                    
                  
                  <!--
                    {#each Object.keys($productData.mentries[color_entry]) as size_id}
                      
                        {$productData.mentries[color_entry][size_id].quantity}
                      </td>
                    {/each}
                    -->
                </tr>
                {/if}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="product-attributes-single">
            {#if $cartStore[product_id].colors.length > 0}
              <h4 class="single-amount-title-1 single-amount-title">מוצר זה מגיע
                {#if $cartStore[product_id].colors.length > 1}
                  בצבעים:
                    {#each $cartStore[product_id].colors as color, color_idx}
                        <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color].color}"></div></div>
                    {/each}
                {:else}
                  בצבע:
                    <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[$cartStore[product_id].colors[0]].color}"></div></div>
                {/if}
              </h4>
            {/if} 
            {#if $cartStore[product_id].sizes.length > 0}
              <h4 class="single-amount-title-2 single-amount-title">
                {#if $cartStore[product_id].sizes.length > 1}
                  בגדלים:
                    {#each $cartStore[product_id].sizes as size, size_idx}
                      <div class="size-box">
                        {$sizesJsonStore[size].name}
                      </div>
                    {/each}
                {:else}
                  בגודל:
                    <div class="size-box">
                      {$sizesJsonStore[$cartStore[product_id].sizes[0]].size}
                    </div>
                {/if}
              </h4>
            {/if}
            
            
            <div class="input-wraper">
              <label for="popup_amount_input" class="amount-input-label">כמות: </label>
              <input id="popup_amount_input" on:keyup={(e)=> {e.key === 'Enter' && toggleModal()}} use:selectTextOnFocus bind:value={$cartStore[product_id].amount} class="amount-input" type="number" >
            </div>
          </div>
        {/if}
      </div>
      <div class="fast-amount-buttons">
        <button on:click={()=> {add_to_amount(6)}} class="option">6+</button>
        <button on:click={()=> {add_to_amount(12)}} class="option">12+</button>
        <button  on:click={()=> {add_to_amount(24)}} class="option">24+</button>
      </div>

      {#if show_add_amount_focus_error}
        <div class="amount-focus-error-message">
          לחץ על התא שאליו תרצה להוסיף כמות
        </div>
      {/if}



        <div class="action-buttons">
          <!-- שמור ומחק -->
          <button class="btn btn-primary" style:visibility={$cartStore[product_id].amount>0?'visible':'hidden'} on:click={toggleModal}>הוסף לסל</button>
          <button class="btn btn-danger" on:click={remove_from_cart}>מחק</button>

        </div>
        {:else}
          <!-- is that nessesery? -->
          <div class="product-details">
            <div class="product-img">
              <img width="150" height="150" src="{CLOUDINARY_URL}f_auto,w_auto/{$cartStore[product_id].cimage}" alt="{$cartStore[product_id].title}">
            </div>
            <div class="product-title">
              <h1>{$cartStore[product_id].title}</h1>
            </div>
          </div>
        {/if}
    </div>

  </div>
  {/if}
</div>

<style lang="scss">
  .amount-focus-error-message {
    width: fit-content;
    margin: auto;
    color: red;
    font-weight: bold;
  }
  .product-grid-wraper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
.cls-cell {
  border:1px solid rgb(85, 85, 85);
}
.modal-header {
  .modal-title {
    font-size: 1.5rem;
  }
}
  .modal-body {
    .const-size-cell {
      width: 200px;
    }
    .sticky-col {
  position: -webkit-sticky;
  position: sticky;
  background-color: rgba(238, 238, 238, 0.651);
  //min-width: 80px;
    position: sticky;
    position: -webkit-sticky;
    position: sticky;
    right: 0px;
    border: 1px solid #777777;
    border-radius: 5px;
    padding: 5px;
}
.total-cell {
  div {
    font-weight: bold;
    background-color: rgba(34, 34, 34, 0.746);
    //min-width: 80px;
    color:white;
    border: 1px solid #777777;
    border-radius: 5px;
    padding: 5px;
    text-align: center;
  }
}
  .delete-cell-style {
  
  background-color: rgba(238, 238, 238, 0.651);
  border: 1px solid #777777;
  //min-width: 80px;
  }
    .product-details {
      display:flex;
      flex-direction: row-reverse;
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
      //width: 100%;
      
      //padding-bottom: 450px;
      
      overflow-x: auto;
      
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      table.product-table {
        border: 1px solid #777777;
          //width: 100%;
          margin:auto;
          border-spacing: 0;
          thead {
            tr {
              th {
                text-align: center;
                border-bottom: 1px solid rgb(85, 85, 85);
                border-left: 1px solid rgb(85, 85, 85);
                max-width: 95px;
                &:last-child {
                  border-left: none;
                }

              }
              th.size-header {
                text-align: center;
                border-bottom: 1px solid rgb(85, 85, 85);
                border-left: 1px solid rgb(85, 85, 85);
                
                
                &:last-child {
                  border-left: none;
                }
              }
            }
          }
          tbody {
            tr {
              
              td {
                
                .varient-box {
                  font-weight: bold;
                    width: 100%;
                    text-align: center;
                    
                    
                    background: none;
                    padding: 5px;
                }
                &.size-cell {
                  & .cell-wraper {
                    display: grid;
                    grid-template-columns: 1fr;
                    border:1px solid black;
                    max-width: 95px;
                  }
                  input.size-input:first-child {
                    &:last-child {
                      border-left: none;
                    }
                  }
                  input.size-input {
                    /* webkit solution */
                    ::-webkit-input-placeholder { text-align:center; }
                    /* mozilla solution */
                    input:-moz-placeholder { text-align:center; }
                    
                    //border: 1px solid rgb(85, 85, 85);
                    min-width: 48px;
                    width: 100%;
                    //width: max-content;
                    text-align: center;
                    //border: 1px solid #777777;
                    //border:none;
                    //border-right: 1px solid rgb(85, 85, 85);
                    //border-left: 1px solid rgb(85, 85, 85);
                    
                    
                    
                    //border-radius: 5px;
                    background: none;
                    padding: 5px;
                    border:none;
                    margin: auto;
                    &.has-focus-error {
                      &:hover {
                        background-color: #2b2a2a;
                      }
                    }
                    &:focus {
                      outline: none;
                    }
                    /*&::-webkit-outer-spin-button,
                    &::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }*/
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
                  &:hover {
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
                  width: max-content;
                  .inner {
                    margin-left: 15px;
                    width: 25px;
                    height: 25px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .product-attributes-single {
      .single-amount-title { 
        display:flex;
        justify-content: flex-start;
        align-items: center;
      }
      .single-amount-title-1{
        .color-box {
          .inner {
              margin-left: 15px;
              width: 25px;
              height: 25px;
          }
        }
      }

      .input-wraper {
        .amount-input-label {

        }
            .amount-input {
                width: 100%;
                height: 50px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                margin-top: 15px;
                font-size: 1.9em;
                font-weight: bold;
                text-align: center;
                background-color: rgba(255, 255, 255, 0.404);
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
                color: #000;
                
            }
        }
    }

    .fast-amount-buttons {
      width: fit-content;
    margin: auto;
      display: flex;;
            flex-direction: row-reverse;
            justify-content: space-around;
            text-align: center;
            padding-top:25px;
            .option {
                width: 120px;
                height: 75px;
                border-radius: 25px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #ccc;
                @include bg-gradient(); 
                font-size: 1.5em;
                margin: 0 5px;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
                outline: none;
                transition:ease-in-out 0.2s;
                &:hover, &:focus {
                    border: 1px solid rgb(71, 71, 71);
                    box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.4);
                }

            }
    }

    .action-buttons {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-top: 25px;
      padding-bottom: 10px;
      button {
        width: 100px;
        height: 40px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 14px;
        padding: 5px;
      }
    }
</style>