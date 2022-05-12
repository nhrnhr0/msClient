<script>
import { colorsJsonStore,sizesJsonStore } from "@src/stores/stores";
import { onMount } from "svelte";

    export let product;
    export let entries;
    let loaded = false;
    
    $: loaded = product && $sizesJsonStore && $sizesJsonStore.length != 0 && $colorsJsonStore && $colorsJsonStore.length != 0;
    function amount_changed_event(e) {
        let quantity = parseInt(e.target.value);
        let size = parseInt(e.target.dataset.size);
        let color = parseInt(e.target.dataset.color);
        let verient = parseInt(e.target.dataset.verient);
        let entry = entries.find(entry => entry.size == size && entry.color == color && entry.verient == verient);
        if (entry) {
            console.log('entry found');
            entry.quantity = quantity;
            entries = [...entries ];
        }else{
            console.log('entry not found');
            /*example of entry:
            {"id":1,"size":124,"size_name":"33","color":84,"color_name":"חום","verient":null,"verient_name":"","quantity":3,"created_at":"2022-05-11T10:03:54.143769+03:00"}
            */
            entry = {
                "id": null,
                "size": size,
                "color": color,
                "verient": verient,
                "quantity": quantity,
                "created_at": null
            };
            entries = [...entries, entry];
        }
    }

    /**
     * create a table with product.varients as the first column and product.colors as the second column and product.sizes as the rows
     * entries is the data to fill the table
     * 
     * 
     * product.varients: [{"id":1,"name":"02"},{"id":3,"name":"S3"}]	
     * 
     * product.colors: [84]	
     * 
     * product.sizes: [94,95,96,97,98,99,100,101,102,103,104,105,112]	
     * 
     * entries: [{"id":1,"size":124,"size_name":"33","color":84,"color_name":"חום","verient":null,"verient_name":"","quantity":3,"created_at":"2022-05-11T10:03:54.143769+03:00"},{"id":2,"size":123,"size_name":"34","color":84,"color_name":"חום","verient":null,"verient_name":"","quantity":14,"created_at":"2022-05-11T10:04:05.253829+03:00"},{"id":3,"size":113,"size_name":"35","color":84,"color_name":"חום","verient":null,"verient_name":"","quantity":2,"created_at":"2022-05-11T10:04:57.794711+03:00"},{"id":4,"size":94,"size_name":"36","color":77,"color_name":"שחור","verient":null,"verient_name":"","quantity":3,"created_at":"2022-05-11T10:05:15.770958+03:00"},{"id":5,"size":95,"size_name":"37","color":77,"color_name":"שחור","verient":1,"verient_name":"02","quantity":3,"created_at":"2022-05-11T10:05:27.862054+03:00"},{"id":6,"size":95,"size_name":"37","color":77,"color_name":"שחור","verient":3,"verient_name":"S3","quantity":1,"created_at":"2022-05-11T10:05:46.820974+03:00"}]
    */
</script>
{#if product && entries && loaded}
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
                        <!--
                        {#if product.varients.length == 0}
                            <div class="cell-wraper">
                                <input on:input={amount_changed_event} class="size-input cls-cell" data-color="{color}" data-size="{size}" placeholder="כמות" min="0" max="9999" >
                            </div>
                        {:else}
                    -->
                            {#each product.varients as {id, name}, idx}
                            <div class="cell-wraper">
                                <input on:change={amount_changed_event} value={entries.find(entry => entry.size == size && entry.color == color && entry.verient == id)?.quantity || ''} data-verient={id} data-color="{color}" data-size="{size}" id="input_entery_{product.id}_{size}_{color}_{id}" class="size-input cls-cell" type="number" placeholder="כמות" min="0" max="9999" > <!--bind:value="{product.mentries[color][size][id].quantity}" -->
                            </div>
                            {:else}
                            <div class="cell-wraper">
                                <input on:change={amount_changed_event} value={entries.find(entry => entry.size == size && entry.color == color && entry.verient == id)?.quantity || ''} class="size-input cls-cell" data-verient="" data-color="{color}" data-size="{size}" placeholder="כמות" min="0" max="9999" >
                            </div>
                            {/each}
                          
                          <!--{/if}-->
                        
                      </td>
                      
                    {/each}
                    <td class="delete-cell-style">
                      <button class="remove-button">
                        <svg xmlns="http://www.w3.org/2000/svg" on:click={clear_sizes_entries(color)}  width="16px" height="16px" viewBox="0 0 32 36"><path fill="currentColor" d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"/></svg>
                      </button>
                    </td>
                  </tr>
                  
                {/each}
        </tbody>
    </table>
{/if}