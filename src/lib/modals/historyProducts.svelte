<script>
  import { fly, fade } from "svelte/transition";
  import {
    historyProductsModalStore,
    cartHistoryModalStore,
  } from "../../stores/stores";
  import {userInfoStore} from './../../stores/stores';
  import { cartStore } from "../../stores/cartStore";
  import { CLOUDINARY_URL } from "../../api/consts";
  import { flip } from "svelte/animate";
  import { scrollFix } from "$lib/ui/scrollFix";
  import { selectTextOnFocus } from "$lib/ui/inputActions";

  function add_all_products() {
        let i = 0;
        for(let product_id in $historyProductsModalStore.historyProducts) {
                add_product_to_cart(product_id);
            i++;
        }
    }
  function merge_and_sum_mentries(entries1, entries2) {
        // create a return variable dict
        // loop through the entries1 keys (entries1_key)
        // if entties1[entries1_key] have a quantity key:
        //      if entries2[entries1_key] have a quantity key:
        //          add the quantity in entties1[entries1_key] and entties2[entries1_key] to the return variable dict
        //      else:
        //          add the quantity entties1[entries1_key] to the return variable dict
        // else:
        //     loop through enttries1[entries1_key] keys (entries1_key) (recursive)
        
        let return_variable = {...entries2};
        for (let keys1 in entries1) {
            for(let keys2 in entries1[keys1]) {
                if(entries1[keys1][keys2].hasOwnProperty('quantity')) {
                    if(!return_variable.hasOwnProperty(keys1)) {
                        return_variable[keys1] = {};
                    }
                    if(!return_variable[keys1].hasOwnProperty(keys2)) {
                        return_variable[keys1][keys2] = {'quantity':0};
                    }
                    if(entries1[keys1][keys2].hasOwnProperty('quantity')) {
                        if(return_variable[keys1][keys2].hasOwnProperty('quantity')) {
                            return_variable[keys1][keys2]['quantity'] += entries1[keys1][keys2]['quantity'];
                        }else {
                            return_variable[keys1][keys2]['quantity'] = entries1[keys1][keys2]['quantity'];
                        }
                    }
                    
                }else {
                    for(let key3 in entries1[keys1][keys2]) {
                        if(!return_variable.hasOwnProperty(keys1)) {
                            return_variable[keys1] = {};
                        }
                        if(!return_variable[keys1].hasOwnProperty(keys2)) {
                            return_variable[keys1][keys2] = {};
                        }
                        if(!return_variable[keys1][keys2].hasOwnProperty(key3)) {
                            return_variable[keys1][keys2][key3] = {'quantity':0};
                        }
                        if(entries1[keys1][keys2][key3].hasOwnProperty('quantity')) {
                            if (return_variable[keys1][keys2][key3].hasOwnProperty('quantity')) {
                                return_variable[keys1][keys2][key3]['quantity'] += entries1[keys1][keys2][key3]['quantity'];
                            }else {
                                return_variable[keys1][keys2][key3]['quantity'] = entries1[keys1][keys2][key3]['quantity'];
                            }
                        }
                    }
                }
            }
        }
        return return_variable;
    }

  function add_product_to_cart(product_key) {
        let product_data = $historyProductsModalStore.historyProducts[product_key];
        let cart_data = $cartStore[product_key];
        let old_entries = {}
        if(cart_data) {
            old_entries = cart_data.mentries;
        }
        debugger;
        let new_entries = merge_and_sum_mentries(old_entries, product_data.mentries);
        console.log(new_entries);
        if($cartStore[product_key]) {
            $cartStore[product_key].mentries = new_entries;
        }else {
            product_data.mentries = new_entries;
            $cartStore[product_key] = {...product_data};
        }
        $cartStore[product_key].amount = $cartStore[product_key].amount + product_data.amount;
        delete $historyProductsModalStore.historyProducts[product_key];
        $historyProductsModalStore.historyProducts = {...$historyProductsModalStore.historyProducts};
        debugger;

        if(Object.keys($historyProductsModalStore.historyProducts).length == 0) {
          historyProductsModalStore.closeModal();
        }
    }
</script>

<div
  id="history-modal"
  class={`modal ${$historyProductsModalStore.showModal ? "active" : ""}`}
>
  <div class="overlay" on:click="{()=> {
    historyProductsModalStore.closeModal();
    cartHistoryModalStore.openModal();
  }}">
    <div
      class="modal_content"
      in:fly={{ y: 200, duration: 350 }}
      on:click|stopPropagation|preventDefault={() => {}}
      out:fade
    >
      <div class="modal-header">
        <button
          title="Close"
          on:click={() => {
            $historyProductsModalStore.historyProducts = {};
            historyProductsModalStore.closeModal();
            cartHistoryModalStore.openModal();
          }}
          class="close-btn right">x</button
        >
        <h5 class="modal-title">הזמנה קודמת</h5>
        <button
          title="Close"
          on:click={() => {
            $historyProductsModalStore.historyProducts = {};
            historyProductsModalStore.closeModal();
            cartHistoryModalStore.openModal();
          }}
          class="close-btn left">x</button
        >
      </div>
      <div class="modal-body">






        <button on:click="{add_all_products}"  class="add-all-btn btn btn-primary" >הוסף הכל לסל</button>
                <div class="products">
                    {#each Object.keys($historyProductsModalStore.historyProducts) as product_key (product_key)}
                        <div class="product-wraper" animate:flip={{ duration: 200 }} out:fly={{x:-480, duration:200}}>
                          <div class="product-inner">
                            <div class="product-image">
                                <img width="55px" height="55px" src="{CLOUDINARY_URL}/{$historyProductsModalStore.historyProducts[product_key].cimage}" alt="">
                            </div>
                            <div class="product-info">
                                <div class="product-name">
                                    {$historyProductsModalStore.historyProducts[product_key].title}
                                </div>
                                <div class="attributes">
                                    {#if $userInfoStore.me.show_prices}
                                    <div class="attribute">
                                            <div class="product-price">
                                                {$historyProductsModalStore.historyProducts[product_key].price} ש"ח
                                            </div>
                                    </div>
                                    {/if}
                                    <div class="attribute">
                                        <div class="product-quantity">
                                            {$historyProductsModalStore.historyProducts[product_key].amount} יח
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                          </div>
                            <button on:click="{add_product_to_cart(product_key)}" class="add-to-cart-btn btn btn-secondary">
                                הוסף לסל
                            </button>
                        </div>
                    {/each}
                </div>

      </div>
    </div>
  </div>
</div>








<!--
        <table class="products">
          <tbody>
            {#if Object.keys($historyProductsModalStore.historyProducts).length > 0}
              <ul class="products" use:scrollFix>
                {#each Object.keys($historyProductsModalStore.historyProducts) as key, i (key)}
                  <li
                    class="product"
                    data-product={key}
                    animate:flip={{ duration: 200 }}
                    out:fly={{ x: 100, duration: 200 }}
                    in:fly={{ x: 340, duration: 500, delay: i * 120 }}
                  >
                    <div class="product-link">
                      <span class="product-image">
                        <img
                          src="{CLOUDINARY_URL}f_auto,w_auto/{$historyProductsModalStore
                            .historyProducts[key].cimage}"
                          alt={$historyProductsModalStore.historyProducts[key]
                            .title}
                        />
                      </span>
                      <span class="product-details">
                        <h3>
                          {$historyProductsModalStore.historyProducts[key]
                            .title}
                        </h3>
                        <hr />
                        <div class="qty-price">
                          <div class="table">
                            <div class="table-row">
                              <div class="table-cell table-cell-title">
                                :כמות
                              </div>
                              <div class="table-cell qty">
                                {#if $historyProductsModalStore.historyProducts[key].show_sizes_popup}
                                  <div class="total-amount">
                                    {$historyProductsModalStore.historyProducts[
                                      key
                                    ].amount}
                                  </div>
                                {:else}
                                  <input
                                    type="text"
                                    class="amount-input"
                                    id="cart_amount_{key}"
                                    use:selectTextOnFocus
                                    bind:value={$historyProductsModalStore
                                      .historyProducts[key].amount}
                                  />
                                {/if}
                              </div>
                            </div>
                            <div class="table-row">
                              <div class="table-cell table-cell-title">
                                :'מחיר ליח
                              </div>
                              <div class="table-cell">
                                <span class=""
                                  >{$historyProductsModalStore.historyProducts[
                                    key
                                  ].price}₪</span
                                >
                              </div>
                            </div>
                          </div>
                        </div></span
                      >
                    </div>
                  </li>
                {/each}
              </ul>
            {:else}
              <div class="empty-cart">
                <h2>אין מוצרים</h2>
              </div>
            {/if}
          </tbody>
        </table>
        <div class="action-buttons">
          <button
            class="checkout-button"
            on:click={handleAddProductsToCart}
            disabled={Object.keys($historyProductsModalStore.historyProducts)
              .length === 0}
          >
            הוסף מוצרים לעגלה
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
-->
<style lang="scss">
  // Mixin to generate hover & active states
  @mixin hover-active() {
    &:active,
    &:hover {
      @content;
    }
  }
  .add-all-btn {
        
        width: 100%;
        margin-bottom: 10px;
        padding:10px;
    }
  .modal-body {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 32px;
    padding-bottom: 102px;
  }
  .products {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .product-wraper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border:1px solid #333;
            .product-inner {
              display: flex;
              .product-image {
                width: 55px;
                height: 55px;
                margin-right: 10px;
            }
            .product-info {
                .product-name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }
                .attributes {
                    display: flex;
                    flex-direction: row;
                    .attribute {
                        //display: flex;
                        //flex-direction: row;
                        //justify-content: space-between;
                        //align-items: center;
                        padding: 5px;
                        margin:5px;
                        border-radius: 25px;
                        background-color: #eee;

                        .product-price {
                            font-size: 14px;
                            color: #333;
                        }
                        .product-quantity {
                            font-size: 14px;
                            color: #333;
                        }
                    }
                }
            }
            }
            
            .add-to-cart-btn {
                margin-left: 10px;
                //position: absolute;
                //left: 20px;
            }
            
        }
    }
  /*
  table.products {
    th {
      font-size: 1em;
      text-align: center;
      font-weight: bold;
    }
    td {
      font-size: 1.2em;
      text-align: center;
      font-weight: bold;
    }
    width: 100%;
    thead {
      tr {
        th {
          padding: 10px;

          background-color: $gray-800;
        }
      }
    }
    tbody {
      tr {
        td {
          .product-amount {
            cursor: pointer;
            transition: color 0.5s linear;
            @include hover-active() {
              color: $secondary;
              text-decoration: none;
            }
          }
          .product-image-and-title {
            display: flex;
            justify-content: start;
            align-items: center;
            @media screen and (max-width: 1100px) {
              flex-direction: column;
              align-items: start;
            }
            .product-image {
              width: 100px;
              height: 100px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .product-title {
              font-weight: bold;
            }
            @media screen and (max-width: 1100px) {
              .product-image {
                width: 50px;
                height: 50px;
              }
              .product-title {
                font-size: 0.8em;
              }
            }
          }

          @media screen and (max-width: 765px) {
            font-size: 1rem;
          }
        }
        // ligther colors on all odd rows
        &:nth-child(even) {
          background-color: $gray-600;
        }
      }
    }
  }*/
  /*div.totals {
    background-color: $gray-300;
    line-height: 2;
    //display: flex;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-content: space-around;
    font-size: 1.5rem;
    font-weight: bold;
    width: 100%;
    @media screen and (max-width: 945px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (max-width: 1100px) {
      font-size: 1rem;
    }
  }*/

  /*.float-actions {
    position: fixed;
    top: 20px;
  }*/
  /*
  .send-wra {
    display: flex;
    flex-direction: row-reverse;
    gap: 20px;
    .back-btn {
      margin-top: 1em;
      margin-bottom: 1em;

      //@include bg-gradient();
      background-color: var(--details-btn-color);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      font-weight: bold;
      transition: all 0.3s ease 0s;
      &:hover,
      &:focus {
        box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
        transform: translateY(-7px);
      }
    }

    .submit-btn {
      margin-top: 1em;
      margin-bottom: 1em;
      width: 100%;
      @include bg-gradient();
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

      font-weight: bold;
      transition: all 0.3s ease 0s;
      &:hover,
      &:focus {
        box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
        transform: translateY(-7px);
      }
      img.arrow-left {
        transform: rotate3d(0, 0, 1, 180deg);
      }
    }
  }
  */
  /*
  ul.products {
    margin: 0;
    padding: 0 0 15px 0;
    list-style: none;
    overflow-x: hidden;
    overflow-y: auto;
    display: block;
    position: relative;
    z-index: 0;
    @media screen and (max-width: 700px) {
      height: calc(100vh - 193px - 62px);
    }
    li.product {
      margin: 0 0 10px 0;
      padding: 0;
      width: 100%;
      min-height: 30px;
      background: lighten($primary, 60%);
      border-radius: 3px;
      color: $gray-600;
      position: relative;
      z-index: 1;
      display: flex;
      flex-flow: row nowrap;
      transition: all 0.5s linear;

      @include hover-active() {
        background: $white;

        span.product-details {
          h3 {
            color: $secondary !important;
            -webkit-text-stroke-width: 0.1px;
            -webkit-text-stroke-color: $black;
          }
        }

        img {
          border-color: $gray-300 !important;
        }
      }

      .product-link {
        cursor: default;
        width: 100%;
        color: $primary;
        padding: 10px;
        margin: 0;
        display: flex;

        flex-direction: row-reverse;
        flex-wrap: nowrap;

        span.product-image {
          display: inline-block;
          width: 75px;
          height: 50px;
          padding-left: 10px;
          cursor: pointer;
          flex-shrink: 1;
          flex-grow: 0;

          img {
            width: 60px;
            height: 50px;
            border: 1px solid $gray-300;
            transition: all 0.5s linear;
          }
        }

        span.product-details {
          display: inline-block;
          width: 100%;
          min-height: 30px;
          color: $gray-700;
          text-align: right;
          h3 {
            //margin: 3px 5px 5px 0px;
            margin-bottom: 3px;
            margin-left: 15px;
            margin-right: 0px;
            margin-top: 0px;

            font-size: 13px;
            font-weight: 500;
            color: $gray-900;
            transition: all 0.5s linear;
          }

          div.qty-price {
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
            z-index: 5px;
            margin-top: 8px;

            .table {
              display: flex;
              flex-direction: row-reverse;
              justify-content: space-between;
              width: 100%;
              .table-row {
                .table-cell {
                  text-align: center;
                  &.table-cell-title {
                    font-size: 12px;
                    text-align: center;
                    width: 100%;
                    font-weight: 500;
                  }
                }
              }
            }
            .edit-btn {
              background: none;
              border: none;
              &:hover {
                color: $secondary;
                svg {
                  fill: $secondary;
                }
              }
            }
            div.qty,
            div.price {
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
            }

            div.qty {
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-content: center;
              align-items: center;
              justify-content: flex-start;
              .total-amount {
                margin: auto;
              }
              input.amount-input {
                border: none;
                background: none;
                width: 55px;
                text-align: center;
              }
            }

            div.price {
              color: $secondary;
              font-weight: 500;
              font-size: 13px;
              display: inline-flex;
            }
          }
        }
      }

      .remove-button {
        height: 16px;
        width: 16px;
        margin: 0 0 10px 10px;
        text-decoration: none;
        position: absolute;
        top: 5px;
        //right: 0px;
        left: 0px;
        z-index: 2;
        display: flex;
        svg {
          display: block;
        }

        @include hover-active() {
          cursor: pointer;
          svg {
            path {
              color: $red;
            }
          }
          //background: $red;
        }
      }
    }
    :global(li.product.deleted) {
      transition: all 0.2s linear;
      transform: translatex(340px);
      opacity: 0;
    }
  }*/

  .empty-cart {
    text-align: center;
    h2 {
      color: #75757a;
    }
  }

  div.action-buttons {
    padding: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80px;
    //background: $white;
    display: block;
    white-space: nowrap;
    //display:flex;
    display: flex;
    justify-content: center;
    align-items: center;
    button.checkout-back {
      display: block;
      visibility: hidden;
      margin-right: 10px;
      padding: 10px;
      border: 1px solid $gray-300;
      border-radius: 3px;
      background: $gray-200;
      color: $gray-900;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.5s linear;
      &.active {
        visibility: visible;
      }
      @include hover-active() {
        background: $gray-300;
        color: $gray-900;
      }
    }
    button.checkout-button {
      display: inline-block;

      padding: 10px;
      margin: 20px 15px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 14px;
      border-width: 1px;
      border-style: solid;
      border-radius: 4px;
      transition: all 0.5s linear;
      //border-color: $secondary;
      //background: $secondary;
      margin-left: 5px;
      color: $white;
      font-weight: bold;
      font-size: larger;
      color: $black;
      width: 60%;
      @include bg-gradient();

      &:after {
        content: url("data:image/svg+xml,%3Csvg fill='%23#{str-replace('' + $black + '', '#', '')}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M311.03 131.515l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L387.887 239H12c-6.627 0-12 5.373-12 12v10c0 6.627 5.373 12 12 12h375.887l-83.928 83.444c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l116.485-116c4.686-4.686 4.686-12.284 0-16.971L328 131.515c-4.686-4.687-12.284-4.687-16.97 0z'/%3E%3C/svg%3E");
        width: 20px;
        height: 14px;
        display: inline-block;
        margin-left: 6px;
        vertical-align: middle;
        position: relative;
        top: -5px;
        z-index: 1;
      }

      @include hover-active() {
        //background: darken($secondary, 10%);
        border-color: darken($secondary, 40%);
        &:after {
          margin-left: 0px;
        }
      }
    }

    @media screen and (max-width: 700px) {
      bottom: 62px;
    }
  }
</style>
