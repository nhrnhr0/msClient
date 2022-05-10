
<script>
import { CLOUDINARY_URL } from "@src/api/consts";
import { colorsJsonStore, sizesJsonStore } from "@src/stores/stores";
import { onMount } from "svelte";


    export let product;
    onMount(() => {
        console.log('product: ', product);
        });

    function clear_sizes_entries(color_key) {
        let mentries = product.mentries;
        console.log(mentries);
        console.log(color_key);
        if(product.show_sizes_popup) {
        if(product.varients.length == 0) {
            let sizeKeys = Object.keys(product.mentries[color_key]);
            for(let size_index = 0; size_index < sizeKeys.length; size_index++) {
            product.mentries[color_key][sizeKeys[size_index]] = {quantity: undefined};
            }
        }else {
            let sizeKeys = Object.keys(product.mentries[color_key]);
            for(let size_index = 0; size_index < sizeKeys.length; size_index++) {
            let verientsKeys = Object.keys(product.mentries[color_key][sizeKeys[size_index]]);
            for(let i = 0; i < verientsKeys.length; i++) {
                product.mentries[color_key][sizeKeys[size_index]][verientsKeys[i]] = {quantity: undefined};
            }
            //product.mentries[color_key][sizeKeys[size_index]] = {quantity: undefined};
            }
        }
        }else {

        }
    }

</script>
{#if product}
{#if product.show_sizes_popup}
          <div class="product-attributes">
            <div class="product-details">
              
              <div class="product-title-wraper">
                <div class="product-img">
                  <img width="150" height="150" src="{CLOUDINARY_URL}f_auto,w_auto/{product.cimage}" alt="{product.title}">
                </div>
                <div class="product-title">
                  <h2>{product.title}</h2>
                </div>
                <div class="empty-div"></div>
                <div class="empty-div"></div>
            </div>
            </div>
            <table class="product-table">
              <thead>
                <tr>
                  <th class="sticky-col const-size-cell">צבע</th>
                  {#if product.varients.length != 0}
                    <th class="const-size-cell">מודל</th>
                  {/if}
                  {#each product.sizes as size_id}
                    <th class="size-header">{$sizesJsonStore[size_id]?.size}</th>
                  {/each}
                  <th class="delete-cell-style">מחק</th>
                </tr>
              </thead>
              <tbody>
                {#if product != undefined && product.mentries}

                {#each product.colors as color, color_idx}
                  <!-- color: 84 -->
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color].color}"></div>{$colorsJsonStore[color].name}</div>
                    </td>
                    {#if product.varients.length != 0}
                      <td>
                        {#each product.varients as varient }
                        <div class="varient-box cls-cell">
                          {varient.name}
                        </div>
                        {/each}
                        
                      </td>
                    {/if}
                    {#each product.sizes as size}
                      <td class="size-cell">
                        
                          {#if product.varients.length == 0}
                            <div class="cell-wraper">
                              <input class="size-input cls-cell" data-color="{color}" data-size="{size}" type="number" placeholder="כמות" bind:value="{product.mentries[color][size].quantity}" min="0" max="9999" >
                            </div>
                          {:else}
                          
                            {#each product.varients as {id, name}, idx}
                            <div class="cell-wraper">
                              <input id="input_entery_{product.id}_{size}_{color}_{id}" on:focus="{(e)=> {input_focus_activate(e, `${color}.${size}.${id}`);}}" class="size-input cls-cell" type="number" placeholder="כמות" bind:value="{product.mentries[color][size][id].quantity}" min="0" max="9999" >
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
                {#each Object.keys($cartStore[product.id].mentries) as color_entry}
                  <tr>
                    <td class="sticky-col">
                      <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color_entry].color}"></div>{$colorsJsonStore[color_entry].name}</div>
                    </td>
                    {#each Object.keys(product.mentries[color_entry]) as size_id}
                      <td class="size-cell">
                        <input class="size-input" type="number" placeholder="הזן כמות" bind:value="{product.mentries[color_entry][size_id].quantity}" min="0" max="9999" >
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
                  {#if product.varients.length != 0}
                    <td class="total-cell">
                      <div>-</div>
                    </td>
                  {/if}

                    <!--
                      cartStore[$productData.id].mentries[color_id][size_id].quantity
                    -->
                    <!-- td with the calculated total quantity of each size in mentries -->
                    
                      <!-- {#each  Object.keys(product.mentries[Object.keys(product.mentries)[0]]) as size_id} -->
                      {#each product.sizes as size_id}
                        <td class="total-cell" data-size-id="{size_id}">
                          <div>
                          <!-- calculate the sum of cartStore[product.id].mentries[X][size_id].quantity -->
                          {#if product.varients.length == 0}
                            { Object.keys(product.mentries).reduce((acc, curr) => {
                              return acc + (product.mentries[curr][size_id].quantity || 0);
                            }, 0)}
                          {:else}
                          { Object.keys(product.mentries).reduce((acc, curr) => {
                            let sum = 0;
                            for(let i = 0; i < product.varients.length; i++){
                              sum += (product.mentries[curr][size_id][product.varients[i].id].quantity || 0);
                            }
                            return acc + sum;
                          }, 0)}
                          {/if}
                          </div>
                        </td>
                      {/each}
                      <td class="total-cell">
                        <div>
                          {product.amount}
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
            {#if product.colors.length > 0}
              <h4 class="single-amount-title-1 single-amount-title">מוצר זה מגיע
                {#if product.colors.length > 1}
                  בצבעים:
                    {#each product.colors as color, color_idx}
                        <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[color].color}"></div></div>
                    {/each}
                {:else}
                  בצבע:
                    <div class="color-box" ><div class="inner" style="background-color: {$colorsJsonStore[product.colors[0]].color}"></div></div>
                {/if}
              </h4>
            {/if} 
            {#if product.sizes.length > 0}
              <h4 class="single-amount-title-2 single-amount-title">
                {#if product.sizes.length > 1}
                  בגדלים: 
                    {#each product.sizes as size, size_idx}
                    
                      <div class="size-box">
                        {$sizesJsonStore[size].size}
                      </div>
                    {/each}
                {:else}
                  בגודל:
                    <div class="size-box">
                      {$sizesJsonStore[product.sizes[0]].size}
                    </div>
                {/if}
              </h4>
            {/if}
            
            
            <div class="input-wraper" id="input-wraper">
              <label for="popup_amount_input" class="amount-input-label">כמות: </label>
              <input id="popup_amount_input" bind:value={product.amount} class="amount-input" type="number" >
            </div>
          </div>
        {/if}
        {/if}