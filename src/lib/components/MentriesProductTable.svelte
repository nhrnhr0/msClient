<script>
    import {
        getSessionStorageStore
    } from "src/stores/sessionStorageStore";

    import {
        onMount
    } from "svelte";
    import {
        Spinner
    } from "sveltestrap";
    import {
cartDomElementStore,
        cartStore,
        dictCartStore
    } from "src/stores/cartStore";
    import ColorDisplay from "./ColorDisplay.svelte";
import { browser } from "$app/env";

    let ALL_SIZES;
    let ALL_COLORS;
    let ALL_VARIENTS;
    export let productInfo;

    /*function sizes_colors_input_chenged(e) {
        let cartItem = $cartStore[productInfo.id];
        if (!cartItem) {
            cartItem = {
                id: productInfo.id,
                name: productInfo.name,
                price: productInfo.newPrice || productInfo.price,
                amount: 0,
                mentries: {},
            };
            $cartStore[productInfo.id] = cartItem;
        }
    }*/

    function create_mentries() {
        if (!cartStore.getProduct(productInfo.id)?.mentries) {
            let tempMentries = {};
            for (let clrIdx = 0; clrIdx < productInfo.colors.length; clrIdx++) {
                tempMentries[productInfo.colors[clrIdx]] = {};
                for (let sizeIdx = 0; sizeIdx < productInfo.sizes.length; sizeIdx++) {
                    tempMentries[productInfo.colors[clrIdx]][productInfo.sizes[sizeIdx]] = {};
                    if (productInfo.varients.length != 0) {
                        for (let varIdx = 0; varIdx < productInfo.varients.length; varIdx++) {
                            tempMentries[productInfo.colors[clrIdx]][productInfo.sizes[sizeIdx]][productInfo.varients[
                                varIdx].id] = {
                                quantity: undefined
                            };
                        }
                    } else {
                        tempMentries[productInfo.colors[clrIdx]][productInfo.sizes[sizeIdx]] = {
                            quantity: undefined
                        };
                    }
                }
            }
            mentries = tempMentries;
        } else {
            mentries = cartStore.getProduct(productInfo.id).mentries;
            amount = cartStore.getProduct(productInfo.id).amount;
        }
    }
    // on productInfo change we need to update cartItem entries:
    let mentries = undefined;
    let amount;

    $: {
        if (browser &&  productInfo?.id) {
            create_mentries();
        }
    }

    function clear_mentries() {
      if (mentries) {
        for(let i = 0; i < Object.keys(mentries).length; i++) {
          let color = Object.keys(mentries)[i];
          for(let j = 0; j < Object.keys(mentries[color]).length; j++) {
            let size = Object.keys(mentries[color])[j];
            if (productInfo.varients.length != 0) {
              for(let k = 0; k < Object.keys(mentries[color][size]).length; k++) {
                let varient = Object.keys(mentries[color][size])[k];
                mentries[color][size][varient].quantity = undefined;
              }
            } else {
              mentries[color][size].quantity = undefined;
            }
          }
        }
      }
      amount = undefined;
    }
    

    

    function input_amount_changed(e)  {
        calc_amount();
        if(amount == 0 || amount == undefined) {
                //delete $cartStore[productInfo.id];
                /*cartStore.update(cart => {
                    delete cart[productInfo.id];
                    return cart;
                });*/
                cartStore.removeFromCartById(productInfo.id);
            }else {
              console.log('input_amount_changed', $cartStore[productInfo.id]);
                if(!$dictCartStore[productInfo.id]) {
                  cartStore.setProduct({
                    id: productInfo.id,
                    title: productInfo.title,
                    cimage: productInfo.cimage,
                    price: productInfo.newPrice || productInfo.price,
                    amount: amount,
                    mentries: mentries,
                  });
                }else {
                  let prod = cartStore.getProduct(productInfo.id);
                  prod.amount = amount;
                  prod.mentries = mentries;
                  cartStore.updateProduct(prod);
                }
                requestAnimationFrame(fly_to_cart(document.querySelector('.top-info .product-image img')));
                /*if(!$cartStore[productInfo.id]){    
                    $cartStore[productInfo.id] = {
                        id: productInfo.id,
                        title: productInfo.title,
                        cimage: productInfo.cimage,
                        price: productInfo.newPrice || productInfo.price,
                        amount: amount,
                        mentries: mentries,
                    };
                    requestAnimationFrame(fly_to_cart(document.querySelector('.top-info .product-image img')));
                } else {
                    $cartStore[productInfo.id].amount = amount;
                    $cartStore[productInfo.id].mentries = mentries;
                }*/
            }
            console.log('$cartStore', $cartStore);
    }

    
    function calc_amount() {
        let total_amount = 0;

        if (mentries && productInfo.show_sizes_popup) {
            productInfo.colors.forEach(color => {
                productInfo.sizes.forEach((size, size_idx) => {
                    if (productInfo.varients.length == 0) {
                        total_amount += mentries[color][size].quantity || 0;
                    } else {
                        productInfo.varients.forEach((varient, varient_idx) => {
                            total_amount += mentries[color][size][varient.id].quantity || 0;
                        });
                    }
                });
            });
            amount = total_amount;
        }
    }
    
    function fly_to_cart(el=undefined) {
      let img = undefined;
      if (el) {
        img = el;
      }else {
        img = document.querySelector('.product-image > img');
      }
      
        let clone = img.cloneNode(true);
        
        clone.style.position = 'absolute';
        let bodyRect = document.body.getBoundingClientRect();
        let elemRect = img.getBoundingClientRect();
        let offsetTop   = elemRect.top - bodyRect.top;
        let offsetLeft   = elemRect.left - bodyRect.left;
    
    
        clone.style.top = offsetTop + 'px';
        clone.style.left = offsetLeft + 'px';
        clone.style.zIndex = '500';
        clone.style.opacity = '1';
        let cart = document.querySelector('#cart-btn');
        document.querySelector('#main_wraper').appendChild(clone);
        let cartRect = cart.getBoundingClientRect();
        let cartOffsetTop   = cartRect.top - bodyRect.top;
        let cartOffsetLeft   = cartRect.left - bodyRect.left;
        if(offsetLeft < 0){
            offsetLeft = 0;
        }
        
        clone.animate(
            [
                {
                    'top': offsetTop + 'px',
                    'left': offsetLeft + 'px',
                    'width': img.width / 2 + 'px',
                    'height': img.height / 2 + 'px',
                    'opacity': '1',
                    offset: '0',
                },
                {
                    'top': offsetTop + 'px',
                    'left': offsetLeft + 'px',
                    'width': '75px',
                    'height': '75px',
                    'opacity': '0.5',
                    offset: '0.3',
                },
                {
                    'top': offsetTop + 'px',
                    'left': offsetLeft + 'px',
                    'width': '75px',
                    'height': '75px',
                    'opacity': '0.5',
                    offset: '0.5',
                },
                {
                    'top': cartOffsetTop + 10 + 'px',
                    'left': cartOffsetLeft + 10 + 'px',
                    'width': 75 + 'px',
                    'height': 75 + 'px',
                    'opacity': '0.5',
                    offset: '0.9',
                },
                {
                    offset: '1',
                    'opacity': '0.5',
                    'top': cartOffsetTop + 10 + 'px',
                    'left': cartOffsetLeft + 10 + 'px',
                    'width': 75 + 'px',
                    'height': 75 + 'px',
                }
            ],
            {
                duration: 1000,
                iterations: 1,
                easing: 'ease-in-out'
            },
        ).finished.then(()=> {
            clone.remove();
            // create boop animation
            cart.animate(
              [
                {
                  'transform': 'scale(1)',
                  'opacity': '1',
                  offset: '0',
                },
                {
                  'transform': 'scale(1.3)',
                  'opacity': '1',
                  offset: '0.5',
                },
                {
                  'transform': 'scale(1)',
                  'opacity': '1',
                  offset: '1',
                },
              ],
              {
                duration: 300,
                iterations: 1,
                easing: 'ease-in-out'
              },
        );
        });
        }

        // if $cartStore[productInfo.id] was deleted: set amount to 0 and mentries to undefined
        /*$: {
            if (!$cartStore[productInfo.id]) {
                amount = 0;
                mentries = undefined;
            }
        }*/

    //     // let data_size = e.target.dataset.size;
    //     // let data_row_keys = e.target.dataset.rowKeys;
    //     let data_row_vals = JSON.parse(e.target.dataset.rowVal);
    //     let val = e.target.value;
    //     let size_id = e.target.dataset.size;
    //     let entry = undefined;
    //     if(!cartItem.mentries[size_id]) {
    //         cartItem.mentries[size_id] = {};
    //     }
    //     let keys = []
    //     for(let i = 0; i < Object.keys(data_row_vals).length; i++) {
    //         let key = Object.keys(data_row_vals)[i];
    //         let val = data_row_vals[key];
    //         keys.push(val);
    //     }

    //     // get entry: cartItem.mentries[size_id][keys[0]][keys[1]][keys[...]]
    //     for(let i = 0; i < keys.length; i++) {
    //         let key = keys[i];
    //         if(!cartItem.mentries[size_id][key]) {
    //             cartItem.mentries[size_id][key] = {};
    //         }
    //         if(i == keys.length - 1) {
    //             entry = cartItem.mentries[size_id][key];
    //         }
    //     }
    //     entry[keys[keys.length - 1]] = {'quantity':val};
    //     
    // }
    onMount(async () => {
        // get all the sizes, colors, and varients
        let ALL_SIZES_promise = getSessionStorageStore('sizes');
        let ALL_COLORS_promise = getSessionStorageStore('colors');
        let ALL_VARIENTS_promise = getSessionStorageStore('varients');
        Promise.all([ALL_SIZES_promise, ALL_COLORS_promise, ALL_VARIENTS_promise]).then(values => {
            ALL_SIZES = values[0];
            ALL_COLORS = values[1];
            ALL_VARIENTS = values[2];
        });
    })

    let rows_keys;
    let row_vals;
    let colum_key;
    let colum_vals;
    let val_key;
    let val_vals;

    /* $: {
         productInfo;
         if(productInfo) {
             
             let color_ids = productInfo.colors;
             let varient_ids = productInfo.varients.map(v=>v.id);
             let size_ids = productInfo.sizes;
             let colors_and_varients_cartesian_product = [];
             color_ids.forEach(color_id => {
                 if(varient_ids.length > 0) {
                     varient_ids.forEach(varient_id => {
                         colors_and_varients_cartesian_product.push({
                             color_id,
                             varient_id
                         });
                     });
                 }else {
                     colors_and_varients_cartesian_product.push({
                         color_id
                     });
                 }
             });
             rows_keys = varient_ids.length > 0? [{name:'צבע', key:'color_id'}, {name:'מודל', key:'varient_id'}] : [{name:'צבע', key:'color_id'}];
             row_vals = colors_and_varients_cartesian_product;
             colum_key = 'מידה';
             colum_vals = size_ids;
             val_key = 'כמות';
         }
     }*/

    function clear_sizes_entries(color_key) {
        //TODO: go over this function
        let tempMentries = {};
        if (productInfo?.show_sizes_popup) {
            if (productInfo.varients.length == 0) {
                let sizeKeys = Object.keys(mentries[color_key]);
                for (let size_index = 0; size_index < sizeKeys.length; size_index++) {
                    mentries[color_key][sizeKeys[size_index]] = {
                        quantity: undefined
                    };
                }
            } else {
                let sizeKeys = Object.keys(mentries[color_key]);
                for (let size_index = 0; size_index < sizeKeys.length; size_index++) {
                    let verientsKeys = Object.keys(mentries[color_key][sizeKeys[size_index]]);
                    for (let i = 0; i < verientsKeys.length; i++) {
                        mentries[color_key][sizeKeys[size_index]][verientsKeys[i]] = {
                            quantity: undefined
                        };
                    }
                    //$cartStore[product_id].mentries[color_key][sizeKeys[size_index]] = {quantity: undefined};
                }
            }
        } else {
            mentries[color_key] = undefined;
        }

        input_amount_changed();
    }

    function get_size_rep(size_id) {
        return ALL_SIZES[size_id]
    }

    function get_color_rep(color_id) {
        return ALL_COLORS[color_id]
    }

    function get_varient_rep(varient_id) {
        return ALL_VARIENTS[varient_id]
    }
</script>
<div class="wraper">
    <!-- mentries gos here <br>
    productInfo?.id: {productInfo?.id} <br>
    Object.keys(ALL_VARIENTS)?.length: {Object.keys(ALL_VARIENTS || {})?.length} <br>
    Object.keys(ALL_COLORS)?.length: {Object.keys(ALL_COLORS || {})?.length} <br>
    Object.keys(ALL_SIZES)?.length: {Object.keys(ALL_SIZES || {})?.length} <br> -->
    {#if ALL_VARIENTS && ALL_COLORS && ALL_SIZES && productInfo}
        <!--
            create a table with row_keys as the rows (color, modal / only color)
            and colum_keys as the columns (size)
        -->
        
        {#if productInfo.show_sizes_popup}
            <h3>בחר צבעים ומידות
              {#if $dictCartStore[productInfo.id]}
                <button class="btn btn-danger btn-sm" on:click={() => {clear_mentries(); cartStore.removeFromCartById(productInfo.id)}}>מחק מהעגלה</button>
              {/if}
            </h3>
        {:else}
            <h3>בחר כמות
              {#if $dictCartStore[productInfo.id]}
                <button class="btn btn-danger btn-sm" on:click={() => {clear_mentries(); cartStore.removeFromCartById(productInfo.id)}}>מחק מהעגלה</button>
              {/if}
            </h3>
        {/if}
        {#if productInfo.show_sizes_popup && mentries}


          <table class="product-table">
              <thead>
                <tr>
                  <th class="sticky-col const-size-cell">צבע</th>
                  {#if productInfo.varients.length != 0}
                    <th class="const-size-cell">מודל</th>
                  {/if}
                  {#each productInfo.sizes as size_id}
                    <th class="size-header">{ALL_SIZES[size_id]?.size}</th>
                  {/each}
                  <th class="delete-cell-style">מחק</th>
                </tr>
              </thead>
              <tbody>
                {#each productInfo.colors as color, color_idx}
                  <!-- color: 84 -->
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {ALL_COLORS[color].color}"></div>{ALL_COLORS[color].name}</div>
                    </td>
                    {#if productInfo.varients.length != 0}
                      <td>
                        {#each productInfo.varients as varient }
                        <div class="varient-box cls-cell">
                          {varient.name}
                        </div>
                        {/each}
                        
                      </td>
                    {/if}
                    {#each productInfo.sizes as size}
                      <td class="size-cell">
                        
                          {#if productInfo.varients.length == 0}
                            <div class="cell-wraper">
                              <input on:change="{input_amount_changed}" class="size-input cls-cell" style="border: 2px solid {ALL_COLORS[color].color}" data-color="{color}" data-size="{size}" type="number" placeholder="{ALL_SIZES[size].size}" bind:value="{mentries[color][size].quantity}" min="0" max="9999" >
                            </div>
                          {:else}
                          
                            {#each productInfo.varients as {id, name}, idx}
                            <div class="cell-wraper">
                              <input on:change="{input_amount_changed}" style="border: 2px solid {ALL_COLORS[color].color}" id="input_entery_{productInfo.id}_{size}_{color}_{id}"class="size-input cls-cell" type="number" placeholder="{ALL_SIZES[size].size} ({name})" bind:value="{mentries[color][size][id].quantity}" min="0" max="9999" >
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
                  {#if productInfo.varients.length != 0}
                    <td class="total-cell">
                      <div>-</div>
                    </td>
                  {/if}

                    <!--
                      cartStore[$productData.id].mentries[color_id][size_id].quantity
                    -->
                    <!-- td with the calculated total quantity of each size in mentries -->
                    
                      <!-- {#each  Object.keys($cartStore[product_id].mentries[Object.keys($cartStore[product_id].mentries)[0]]) as size_id} -->
                      {#each productInfo.sizes as size_id}
                        <td class="total-cell" data-size-id="{size_id}">
                          <div>
                          <!-- calculate the sum of cartStore[$cartStore[product_id].id].mentries[X][size_id].quantity -->
                          {#if  productInfo.varients.length == 0}
                            { Object.keys(mentries).reduce((acc, curr) => {
                              return acc + (mentries[curr][size_id].quantity || 0);
                            }, 0)}
                          {:else}
                          { Object.keys(mentries).reduce((acc, curr) => {
                            let sum = 0;
                            for(let i = 0; i < productInfo.varients.length; i++){
                              sum += (mentries[curr][size_id][productInfo.varients[i].id].quantity || 0);
                            }
                            return acc + sum;
                          }, 0)}
                          {/if}
                          </div>
                        </td>
                      {/each}
                      <td class="total-cell">
                        <div>
                          {amount || 0}
                        </div>
                      </td>
                    
                  
                  <!--
                    {#each Object.keys($productData.mentries[color_entry]) as size_id}
                      
                        {$productData.mentries[color_entry][size_id].quantity}
                      </td>
                    {/each}
                    -->
                </tr>
              </tbody>
            </table>
          <!--
              <div class="my-table-responsive">
                  <h4 class="table-title">בבקשה בחר את הצבעים והמידות שברצוך להזמין:</h4>
                  <table class="my-table my-table-striped">
                      <thead>
                          <tr>
                              <th colspan="{rows_keys.length}"></th>
                              <th colspan="{colum_vals.length}">{colum_key}</th>
                          </tr>
                          <tr>
                              {#each rows_keys as row_key, i}
                                  <th >{row_key.name}</th>
                              {/each}
                              {#each colum_vals as size_id}
                                  <th>{get_size_rep(size_id).size}</th>
                              {/each}
                          </tr>
                      </thead>
                      <tbody>
                          {#each row_vals as row_val}
                              <tr>
                                  {#each rows_keys as row_key,i}
                                      <td class="sticky-col"  style="--right-idx: {i}">{
                                          #if row_key.key === 'color_id'}
                                              <ColorDisplay color={get_color_rep(row_val[row_key.key])} />
                                          {:else}
                                              {get_varient_rep(row_val[row_key.key]).name}
                                          {/if}
                                      </td>
                                  {/each}
                                  {#each colum_vals as size_id}
                                      <td>
                                          <input data-size={size_id} data-row-keys={JSON.stringify(rows_keys)} data-row-val={JSON.stringify(row_val)} data-row-vals={JSON.stringify(row_vals)} type="number" class="my-form-control" on:change="{sizes_colors_input_chenged}" />
                                      </td>   
                                  {/each}

                              </tr>
                          {/each}
                      </tbody>
                  </table>
              </div>
              -->
        {:else}
            <!-- explain this product come as a package with this sides and color and you not not able select sizes, color, varients -->
            <div class="show_sizes_popup_false">
              <h4>מוצר זה מגיע כחבילה ולא ניתן לפרק צבעים ומידות</h4>
              {#if productInfo.colors.length > 1}
                  <div class="disclaimer">
                      <h5>חבילה יכולה להכיל את הצבעים הבאים: 
                          <div class="flex-list">
                              {#each productInfo.colors as color_id}
                                  <div class="item">
                                      <ColorDisplay hideName='{true}' width='{'auto'}' color={get_color_rep(color_id)} />
                                  </div>
                              {/each}
                          </div>
                      </h5>
                  </div>
              {/if}
              {#if productInfo.varients.length > 1}
                  <div class="disclaimer">
                      <h5>חבילה יכולה להכיל את המודלים הבאים:
                          <div class="flex-list">
                              {#each productInfo.varients as varient_id}
                                  <div class="item">
                                      {get_varient_rep(varient_id).name}
                                  </div>
                              {/each}
                          </div>
                      </h5>
                  </div>
              {/if}
              {#if productInfo.sizes.length > 1}
                  <div class="disclaimer">
                          <h5>חבילה יכולה להכיל את המידות הבאות:
                              <div class="flex-list">
                                  {#each productInfo.sizes as size_id}
                                      <div class="item">
                                          {get_size_rep(size_id).size}
                                      </div>
                                  {/each}
                              </div>
                          </h5>
                  </div>
              {/if}

              <div class="solo-form-input">
                  <label for="amount">כמות</label>
                  <input bind:value="{amount}" on:change="{input_amount_changed}" name="amount" type="number" class="my-form-control my-form-control-single" />
                  <div class="action-buttons">
                      <button class="amount-btn btn" on:click="{()=> {
                          amount = amount?amount + 6:6;
                          input_amount_changed();
                      }}">+6</button>
                      <button class="amount-btn btn" on:click="{()=> {
                          amount = amount?amount + 12:12;
                          input_amount_changed();
                      }}">+12</button>
                      <button class="amount-btn btn" on:click="{()=> {
                          amount = amount?amount + 24:24;
                          input_amount_changed();
                      }}">+24</button>
                  </div>
              </div>
            </div>
        {/if} <!--{#if productInfo.show_sizes_popup}-->
    {:else} <!--{#if ALL_VARIENTS && ALL_COLORS && ALL_SIZES && productInfo}-->
        <div>
            <Spinner />
        </div>
    {/if}
</div>

<style lang="scss">
  .btn-danger {
    padding: 0.20rem 0.4rem;
    margin:auto;
    border:0px;
  }
    .my-form-control{
        width: 75px;
    }
    .wraper {
        background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
        //width:100%;
        //height: calc(100% - 30px);
        overflow-y: visible;
        overflow-x: auto;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        margin:15px;
        padding:15px;
        // margin-top: 10px;
        // margin-bottom: 10px;
        // margin-left: 15px;
        // margin-right: 15px;
        
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
                    //border:1px solid black;
                    max-width: 95px;
                  }
                  input.size-input:first-child {
                    &:last-child {
                      border-left: none;
                    }
                  }
                  input.size-input {
                    font-size: 12px;
                    
                    font-weight: 700;
                    &:not(:placeholder-shown) {
                      //border:1px solid pink;
                      background: #f5f5f5;
                      color: black;
                    }

                    /* webkit solution */
                    ::-webkit-input-placeholder { text-align:center; }
                    /* mozilla solution */
                    input:-moz-placeholder { text-align:center; }
                    &:focus {
                      @include bg-gradient();
                    }
                    
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
        @media screen and (max-width: 600px) {
            margin-top:15px;
            margin-bottom:5px;
            margin-left: 0px;
            margin-right: 0px;
            padding:5px;
            h3 {
              text-align: center;
            }
            .show_sizes_popup_false {
              h4 {
                text-align: center;
              }
              .solo-form-input {
                input.my-form-control-single {
                  width:60%;
                }
                .action-buttons {
                  .amount-btn {
                    margin: 5px;
                  }
                }
              }
              
            }
        }
        /*.my-table-responsive {

            overflow-x: auto;
            width: 97%;
            height: 100%;
            margin: auto;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;
            
            .table-title {
                margin-top: 15px;
                text-align: center;
                width:100%;
                text-decoration: underline;
            }
            
            .my-table {
                
                border-collapse: collapse;
                overflow: scroll;
                scroll-behavior: smooth;
                
                
                overflow: scroll;
                margin: auto;
                margin-top: 5px;
                margin-bottom: 25px;
                thead {
                    tr {
                        th {
                            text-align: center;
                            //font-size: 20px;
                            font-weight: bold;
                            background-color: #4b4a4aab;
                            color:white;
                        }

                        th {
                            //width: 75px;
                            text-align: center;
                        }
                    }
                }
                tr{
                    td,th {
                        border:1px solid black;
                        &.sticky-col {
                            border:none;
                            outline: 1px solid black;
                            //  style="--right-idx: {i}"
                            right: calc(75px * var(--right-idx));
                            //width:75px;
                            position: -webkit-sticky;
                            position: sticky;
                            
                            //min-width: 80px;
                            position: sticky;
                            position: -webkit-sticky;
                            position: sticky;
                            //right: 0px;
                            //border: 1px solid #777777;
                            //border-radius: 5px;
                            padding: 5px;
                            
                            background-color: rgba(238, 238, 238, 0.851);
                        }
                    }
                }
            }
        }*/
        .show_sizes_popup_false {

            text-align: center;
            .disclaimer {
                margin-top: 10px;
                margin-bottom: 10px;
                margin-left: 15px;
                margin-right: 15px;
                padding: 10px;
                border-radius: 15px;
                background-color: rgba(238, 238, 238, 0.851);
                display: flex;
                justify-content:center;
                align-items: center;
                
                h5 {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex:1;
                    .flex-list {
                        display: flex;
                        gap:5px;
                        .flex-item {
                            margin-left: 10px;
                            margin-right: 10px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        }
                    }
                }
                
            }
        }
            .solo-form-input {
                .my-form-control-single {
                    width: 275px;
                    line-height: 2;
                }
                .action-buttons {
                    margin-top: 15px;
                    .amount-btn {
                        @include bg-gradient();

                        width: 120px;
                        height: 75px;
                        border-radius: 25px;
                        text-align: center;
                        font-weight: 700;
                        font-size: 1.5em;
                        margin: 0 5px;
                        box-shadow: 0 0 5px #0006;
                        outline: none;
                        transition: ease-in-out .2s;
                    }
                }
            }
            
        }
        .const-size-cell {
      width: 200px;
    }
    .sticky-col {
      /*position: -webkit-sticky;
      position: sticky;
      
      //min-width: 80px;
      position: sticky;
      position: -webkit-sticky;
      position: sticky;
      right: 0px;*/
      background-color: rgba(238, 238, 238, 0.651);
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
</style>