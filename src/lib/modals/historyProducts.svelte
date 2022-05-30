<script>
  import { fly, fade } from "svelte/transition";
  import {
    historyProductsModalStore,
    cartHistoryModalStore,
  } from "../../stores/stores";
  import { CLOUDINARY_URL } from "../../api/consts";
  import { flip } from "svelte/animate";
  import { scrollFix } from "$lib/ui/scrollFix";
  import { selectTextOnFocus } from "$lib/ui/inputActions";

  const handleAddProductsToCart = () => {
    console.log("Add products to the cart");
  };
</script>

<div
  id="history-modal"
  class={`modal ${$historyProductsModalStore.showModal ? "active" : ""}`}
>
  <div class="overlay">
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
            לקופה
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  // Mixin to generate hover & active states
  @mixin hover-active() {
    &:active,
    &:hover {
      @content;
    }
  }

  .modal-body {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 32px;
    padding-bottom: 102px;
  }
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
  }
  div.totals {
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
  }

  .float-actions {
    position: fixed;
    top: 20px;
  }

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
