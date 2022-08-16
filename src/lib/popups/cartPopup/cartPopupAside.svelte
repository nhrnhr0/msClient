<script>
import { cartPopupStore } from "src/stores/popups/cartPopupStore";

import {
		fly,
		fade
	} from "svelte/transition";
    
	import {
		scrollFix
	} from "$lib/ui/scrollFix";
    
	import {
		flip
	} from "svelte/animate";
    import {cartStore} from "src/stores/cartStore";
import { CLOUDINARY_URL } from "src/api/consts";
import { goto } from "$app/navigation";

import {get_catalog_album_by_id} from "src/stores/dexie/catalogAlbums";
import { Spinner } from "sveltestrap";
import { find_or_get_slim_product_by_id, slimProductsStore } from "src/stores/sessionStorage/slimProducts";
import EditAmountBtn from "./editAmountBtn.svelte";

    let sidebar_top = 62;
    async function calc_product_url(product_id) {
        let product = await find_or_get_slim_product_by_id(product_id);
        return `/main?product_id=${product_id}&album=${product.main_public_album__slug}&top=${product.main_public_album_top__slug}`;
        /*
        let album_id = product.main_public_album;
        if (album_id) {
          let album = await get_catalog_album_by_id(album_id);
          if(album) {
            let slug = album.slug;
            return `/main?product_id=${product_id}&album=${slug}`;
          }
        //goto(`/main?product_id=${product_id}&album=${slug}`);
        }
        return `/main?product_id=${product_id}`;**/
      }
</script>

<div class="sidebar-cart-wraper">
    <aside
      on:click|preventDefault={() => {}}
      transition:fly={{ x: 340 }}
      id="sidebar-cart"
      style:top={sidebar_top + "px"}
    >
      <main>
        <button
          class="close-button"
          on:click={() => {
            cartPopupStore.toggleSide();
          }}>X</button
        >
        <h2>
          מוצרים שאהבתי<span class="count"
            >{$cartStore.length}</span
          >
        </h2>

        <div
          class="upload-image-wraper"
        >
          <span>שלח מוצר שלא מצאת</span>
          <img
            class="upload"
            width="45px"
            height="45px"
            src="https://res.cloudinary.com/ms-global/image/upload/v1649581221/msAssets/upload_camera_s12a01.png"
            alt=""
          />
        </div>
        <!--
        {#if $userInfoStore.isLogin}
          <button
            class="cart-history-button"
            on:click={() => {
              toggleModal();
              cartHistoryModalStore.openModal();
            }}>היסטוריית הזמנות</button
          >
        {/if}
        
        {#if error_found}
          {#key error_found}
            <h4 class="error-msg">{error_message}</h4>
          {/key}
        {/if}
        -->
        {#if $cartStore.length > 0}
          <ul class="products" use:scrollFix>
            {#each [...$cartStore].reverse() as cartProduct, i (cartProduct.id)}
              {@const key = cartProduct.id}
              <li
                class="product"
                data-product={key}
                animate:flip={{ duration: 200 }}
                out:fly={{ x: 100, duration: 200 }}
                in:fly={{ x: 340, duration: 500, delay: i * 120 }}
              >
                <div class="product-link">
                  <span
                    class="product-image"
                  >
                    <img
                      src="{CLOUDINARY_URL}f_auto,w_auto/{cartProduct
                        .cimage}"
                      alt={cartProduct.title}
                    />
                  </span>
                  <span class="product-details">
                    <h3>{cartProduct.title}</h3>
                    <hr />
                    <div
                      class="qty-price"
                      
                    >
                      <div class="table">
                        <div class="table-row">
                          <div class="table-cell table-cell-title">:כמות</div>
                          <div class="table-cell qty">
                              <div class="total-amount">
                                {cartProduct.amount}
                              </div>
                          </div>
                        </div>
                        
                          <div
                            class="table-row"
                            on:click={(e) => price_cell_click(e, key)}
                          >
                            <div class="table-cell table-cell-title">
                              :'מחיר ליח
                            </div>
                            <div class="table-cell">
                              <span class="">{cartStore.getProduct(key).price}₪</span>
                            </div>
                          </div>


                          
                          {#if $slimProductsStore[key]}
                              <EditAmountBtn url={`/main?product_id=${key}&album=${$slimProductsStore[key].main_public_album__slug}&top=${$slimProductsStore[key].main_public_album_top__slug}`} />
                          {:else}
                            {#await calc_product_url(key)}
                              <Spinner />
                            {:then url} 
                              <EditAmountBtn url={url} />
                            {:catch e}
                              error {e}
                            {/await}
                          {/if}
                      </div>
                    </div></span
                  >
                </div>
                <div
                  class="remove-button"
                  on:click={() => {
                    cartStore.removeFromCartById(key);
                    /*cartStore.update(cart=> {
                      cart[key].amount = 0;
                      cart[key].mentries = undefined;
                      delete cart[key];
                      return cart;
                    });*/
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16px"
                    height="16px"
                    viewBox="0 0 32 36"
                    ><path
                      fill="currentColor"
                      d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"
                    /></svg
                  >
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="empty-cart">
            <h2>אין מוצרים בהצעת מחיר</h2>
          </div>
        {/if}
        <div class="action-buttons">
            <button
              class="checkout-button"
              on:click={() => {
                cartPopupStore.open();
              }}
            >
              לקופה
            </button>
            <button class="copy-button" title="העתק">
              <img width="25px" height="25px" src="https://res.cloudinary.com/ms-global/image/upload/v1655639299/msAssets/copy-two-paper-sheets-interface-symbol_wldmek.png" alt="copy" />
            </button>
        </div>
      </main>
    </aside>
  </div>

  <style lang="scss">
// Mixin to generate hover & active states
@mixin hover-active() {
  &:active,
  &:hover {
    @content;
  }
}
button.close-button {
      margin: 0 0 15px 0;
      text-decoration: none;
      position: absolute;
      top: 5px;
      left: 20px;
      display: flex;
      border: none;
      background: none;
      color: white;
      font-size: x-large;
      transition: all 0.2s ease-in-out;

      @include hover-active() {
        //background-color: $gray-1100;
        transform: scale(1.4);
        color: $red;
      }
    }
    h2.sub-title {
      text-align: center;
    }

    h2 {
      color: $white;
      //font-family: Muli;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      line-height: 1;
      margin: 5px 0 25px 0;
      display: flex;
      justify-content: center;

      span.count {
        color: $white;
        background: $secondary;
        padding: 8px;
        margin-left: 6px;
        position: relative;
        top: -1px;
        width: 18px;
        height: 18px;
        border-radius: 50px;
        font-size: 12px;
        letter-spacing: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    } 
.copy-button {
    padding: 10px;
    background: rgba(255, 255, 255, 0.507);
    border: none;
    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }
  // Brand colors
  //$primary: #354165;
  $primary: #3b3b3b;
  //$secondary: #4dc0e3;
  $secondary: #d4af37;
  // Standard colors
  $black: #000;
  $white: #fff;
  $red: #cc0000;

  // Shades of gray
  $gray-100: #f0f0f9;
  $gray-200: #e1e1e7;
  $gray-300: #d7d7de;
  $gray-400: #cdcdd1;
  $gray-500: #a5a5aa;
  $gray-600: #98989b;
  $gray-700: #75757a;
  $gray-800: #666669;
  $gray-900: #44444a;
  $gray-1000: #333336;
  $gray-1100: #222224;
  $gray-1200: #131314;

  
    #sidebar-cart {
    direction: ltr;
    background: $primary;
    color: $gray-700;
    padding: 15px 15px 0 15px;
    position: fixed;
    display: block;
    width: 315px;
    height: calc(100vh - calc(100vh - 100%));
    height: calc(100vh - (100vh - 100% + 62px));
    //z-index: 997;
    z-index: 2;
    top: 0;
    //right: -340px;
    box-shadow: -10px 0 15px rgba(0, 0, 0, 0.1);
    transition: all 0.75s ease-in-out;

    right: 0;
    visibility: visible;

    /*&.popup-state{
		width: 85vw;
	}*/
    .upload-image-wraper,
    .cart-history-button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $gray-800;
      margin-bottom: 15px;
      border-radius: 25px;
      cursor: pointer;
      //box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.418);
      color: white;
      font-size: larger;
      font-weight: bold;
      @include hover-active() {
        background-color: $gray-700;
        box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
      }
    }
  }

  ul.products {
      margin: 0;
      padding: 0 0 15px 0;
      list-style: none;
      height: calc(100vh - 269px);
      overflow-x: hidden;
      overflow-y: auto;
      display: block;
      position: relative;
      z-index: 0;
      @media screen and (max-width: 700px) {
        height: calc(100vh - 193px - 62px);
      }

      /*&:after {
			background: linear-gradient(180deg, transparent, $primary);
			height: 30px;
			width: 300px;
			z-index: 1;
			content: "";
			position: absolute;
			right: 0;
			bottom: 0;
		}*/

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
                pointer-events: all;
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
          /*span.remove-icon {
					width: 15px;
					height: 16px;
					//background: rgba($gray-700, 0.5);
					text-indent: -9999px;
					overflow: hidden;
					font-size: 0;
                    svg {
                        display: block;
                    }
					//-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 36'%3E%3Cpath fill='currentColor' d='M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z'/%3E%3C/svg%3E");
					transition: all 0.5s linear;
				}*/

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
        /*&.deleted {
                border: 1px solid red !important;
                opacity: 0!important;
                transform: translateY(-100px)!important;
            }*/
      }
      :global(li.product.deleted) {
        transition: all 0.2s linear;
        transform: translatex(340px);
        opacity: 0;
      }
    }

    
    main {
      .empty-cart {
        text-align: center;
        h2 {
          color: #75757a;
        }
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