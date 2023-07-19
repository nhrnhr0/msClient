<script>
import { CLOUDINARY_URL, SUBMIT_CART_URL } from "src/api/consts";

import { userInfoStore, cart_user_info } from "src/stores/stores";
import { cartStore, dictCartStore } from "src/stores/cartStore";
import { cartPopupStore } from "src/stores/popups/cartPopupStore";
import { fly, fade } from "svelte/transition";
import { submit_cart_form } from "src/api/api";
import { logStore } from "src/stores/logStore";
import { Spinner } from "sveltestrap";
import { successPopupStore } from "src/stores/popups/successPopupStore";
import { browser } from "$app/env";
import { onMount } from "svelte";
// let currentStep = 1;
// let form_name;
// let form_email;
// let form_phone;
// let form_privateCompany;
// let form_message;

let show_prices =
  $userInfoStore &&
  $userInfoStore.isLogin &&
  $userInfoStore.me.show_prices == true;
let isSending = false;
let mform;
let state = 0;
let is_small_screen =
  browser && window.matchMedia("(max-width: 500px)").matches;
function cart_submit() {
  if (mform.reportValidity()) {
    let cart_products = [];
    for (let key in $cartStore) {
      let product = $cartStore[key];
      cart_products.push({
        id: product.id,
        amount: product.amount,
        price: product.price,
        mentries: product.mentries,
        print: product.print,
        embro: product.embro,
      });
    }
    let actAs = $userInfoStore?.actAs;

    let form_name = $cart_user_info?.name || $userInfoStore?.me?.name || "";
    let form_email = $cart_user_info?.email || $userInfoStore?.me?.email || "";
    let form_phone = $cart_user_info?.phone || $userInfoStore?.me?.phone || "";
    let form_message = $cart_user_info?.message || "";
    let form_privateCompany = $cart_user_info?.privateCompany || "";
    let order_type = $cart_user_info.order_type;
    let data = {
      name: form_name,
      email: form_email,
      phone: form_phone,
      business_name: form_privateCompany,
      order_type: order_type,
      uuid: "",
      message: form_message,
      products: cart_products,
      asUser: actAs,

      raw_cart: JSON.stringify($cartStore),
    };

    logStore.addLog({
      a: "שליחת הזמנה",
      t: "submit order",
      f: {
        type: "cart",
      },
      w: {
        type: "order",
        data: data,
      },
    });
    isSending = true;
    let response = submit_cart_form(data);
    console.log(response);
    response
      .then((data) => {
        return data.json();
      })
      .then((data_json) => {
        let cart_id = data_json["cart_id"];
        let product_ids = data_json["product_ids"];
        //flashy_purchase(cart_id, product_ids);
        if (data_json["status"] == "success") {
          cartPopupStore.close();
          successPopupStore.open();
          //$cartStore = {};
          mform.reset();
          state = 0;
          cartStore.clearCart();
          $cart_user_info = {};
        }
      });
    response.catch(function (error) {
      alert(error.toString());
      state = 0;
    });
    response.finally(function () {
      isSending = false;
    });
  } else {
    alert("נא למלא את כל השדות");
    state = 1;
  }
}
onMount(() => {
  console.log("onMount");
  if ($cart_user_info == undefined) {
    $cart_user_info = {};
  }
});
// function stepBtnClick() {
//   if (currentStep == 1) {
//     if ($cart_user_info == undefined) {
//       $cart_user_info = {};
//     }
//     currentStep = 2;
//   } else if (currentStep == 2) {
//     cart_submit();
//   }
// }
function roundHalf(num) {
  return Math.round(num * 2) / 2;
}
</script>

<div id="cartModal" class="modal active">
  <div class="overlay" on:click={cartPopupStore.close}>
    <div
      class="modal_content"
      in:fly={{ y: 200, duration: 350 }}
      on:click|stopPropagation|preventDefault={() => {}}
      out:fade
    >
      <div class="modal-header">
        <button
          title="Close"
          on:click={cartPopupStore.close}
          class="close-btn right">x</button
        >
        <h5 class="modal-title">לקופה</h5>
        <button
          title="Close"
          on:click={cartPopupStore.close}
          class="close-btn left">x</button
        >
      </div>

      <div class="modal-body">
        <form
          class="cart-form"
          method="POST"
          bind:this={mform}
          action={SUBMIT_CART_URL}
        >
          {#if $userInfoStore?.me?.is_superuser}
            <h3>סוכן: {$userInfoStore.me.username}</h3>
          {/if}
          <div class="step step-2">
            <div class="form-group">
              <div class="form-control">
                <label for="name">שם בחשבונית</label>
                <input
                  bind:value={$cart_user_info["name"]}
                  name="name"
                  required={!($userInfoStore && $userInfoStore.isLogin)}
                  placeholder={$userInfoStore?.actAs?.businessName ||
                    $userInfoStore?.me?.businessName}
                  type="text"
                />
              </div>

              <div class="form-control">
                <label for="email">אימייל</label>
                <input
                  bind:value={$cart_user_info["email"]}
                  name="email"
                  placeholder={$userInfoStore?.actAs?.email ||
                    $userInfoStore?.me?.email}
                  type="email"
                />
              </div>

              <div class="form-control">
                <label for="phone">טלפון</label>
                <input
                  bind:value={$cart_user_info["phone"]}
                  name="tel"
                  required={!($userInfoStore && $userInfoStore.isLogin)}
                  placeholder="טלפון"
                  type="tel"
                />
              </div>

              <div class="form-control">
                <label for="privateCompany">ח.פ.</label>
                <input
                  type="text"
                  bind:value={$cart_user_info["privateCompany"]}
                  name="privateCompany"
                  required={false}
                  placeholder={$userInfoStore?.actAs?.privateCompany ||
                    $userInfoStore?.me?.privateCompany}
                />
              </div>
            </div>
            <div class="form-group">
              <div class="form-control">
                <textarea
                  bind:value={$cart_user_info["message"]}
                  name="message"
                  required={false}
                  placeholder="הודעה:"
                />
              </div>
            </div>
            <div class="form-group">
              <div class="form-control">
                <!-- {#if $userInfoStore?.isLogin} -->
                <!-- האם הזמנה או הצעת מחיר -->
                <div class="form-group">
                  <div class="form-control">
                    <label for="order_type">סוג הזמנה</label>
                    <select
                      name="order_type"
                      bind:value={$cart_user_info["order_type"]}
                    >
                      <option value="הצעת מחיר">הצעת מחיר</option>
                      <option value="הזמנה">הזמנה</option>
                    </select>
                  </div>
                </div>
                <!-- {/if} -->
              </div>
            </div>
          </div>
          <div in:fly={{ x: -340 }} class="step step-1">
            <table class="products">
              <thead>
                <tr>
                  <th>מוצר</th>
                  {#if !is_small_screen}
                    <th class="hide-on-md">ברקוד</th>
                  {/if}
                  {#if $userInfoStore?.me?.is_superuser}
                    <th class="hide-on-md">הדפסה</th>
                    <th class="hide-on-md">רקמה</th>
                  {/if}
                  <th>כמות</th>
                  {#if show_prices}
                    <th>מחיר</th>
                    <th>סה"כ</th>
                  {/if}
                </tr>
              </thead>
              <tbody>
                {#each Object.entries($cartStore) as [key, val] (key)}
                  {@const item = $cartStore[key]}
                  <tr>
                    <td>
                      <div class="product-image-and-title">
                        <div class="product-image">
                          <img
                            src="{CLOUDINARY_URL}{item.cimage}"
                            alt={item.title}
                          />
                        </div>
                        <div class="product-title">{item.title}</div>
                      </div>
                    </td>
                    {#if !is_small_screen}
                      <td class="hide-on-md">
                        {item?.barcode || ""}
                      </td>
                    {/if}
                    {#if $userInfoStore?.me?.is_superuser}
                      <td class="hide-on-md">
                        <div
                          on:click={(e) => {
                            let p = $cartStore.find(
                              (prod) => prod.id == item.id
                            );
                            if (p) {
                              if (p.print == undefined) {
                                p.print = true;
                              } else {
                                p.print = !p.print;
                              }
                              cartStore.setProduct(p);
                            }
                            /*$cartStore[key].print =
                              !$cartStore[key].print;
                          }}*/
                          }}
                        >
                          {#if item?.print}
                            ✅
                          {:else}
                            ❌
                          {/if}
                        </div>
                      </td>
                      <td class="hide-on-md">
                        <div
                          on:click={(e) => {
                            let p = $cartStore.find(
                              (prod) => prod.id == item.id
                            );
                            if (p) {
                              if (p.embro == undefined) {
                                p.embro = true;
                              } else {
                                p.embro = !p.embro;
                              }
                              cartStore.setProduct(p);
                            }
                          }}
                        >
                          {#if item?.embro}
                            ✅
                          {:else}
                            ❌
                          {/if}
                        </div>
                      </td>
                    {/if}
                    <td>
                      <div
                        class="product-amount"
                        title="ערוך"
                        on:click={open_edit_amount_dialog(item.id, item.title)}
                      >
                        {item.amount}
                      </div>
                    </td>
                    {#if show_prices}
                      <td>
                        <div class="product-price">
                          <!--{#if item.out_of_stock == false}-->
                          {item.price}₪
                          <!--{/if}-->
                        </div>
                      </td>
                      <td>
                        <div class="product-total-price">
                          <!--{#if item.out_of_stock == false}-->
                          {roundHalf(item.price * item.amount)}₪
                          <!--{/if}-->
                        </div>
                      </td>
                    {/if}
                  </tr>
                {/each}
              </tbody>
            </table>
            {#if show_prices}
              <div class="totals">
                <div class="product-total-price">סה"כ ללא מע"מ</div>
                <div class="product-total-price-result">
                  {roundHalf(
                    Object.entries($cartStore).reduce((acc, [key, val]) => {
                      /*let ret = acc;
                                      if (val.out_of_stock == false) {
                                          ret += val.price * val.amount;
                                      }*/
                      return acc + val.price * val.amount;
                    }, 0)
                  )}₪
                </div>
                <div class="product-total-price-tax">סה"כ כולל מע"מ</div>
                {roundHalf(
                  Object.entries($cartStore).reduce((acc, [key, val]) => {
                    /*let ret = acc;
                                  if (val.out_of_stock == false) {
                                      ret += val.price * val.amount;
                                  }*/
                    return acc + val.price * val.amount * 1.17;
                  }, 0)
                )}₪
              </div>
            {/if}
          </div>

          <div class="send-wra">
            <!-- {#if currentStep == 1}
              <button on:click={stepBtnClick} class="submit-btn btn">
                למילוי פרטי עסק
                <img
                  class="arrow-left"
                  width="32px"
                  height="32px"
                  alt="right arrow"
                  src="/right-arrow-hover.png"
                />
              </button>
            {:else} -->
            <button on:click={cart_submit} class="submit-btn btn">
              {#if isSending}
                <Spinner />
              {:else}
                שלח
              {/if}
            </button>
            <!-- {/if} -->
            <!-- <button
              on:click={() => {
                currentStep -= 1;
              }}
              class="btn back-btn"
              style:display={currentStep == 1 ? "none" : "block"}>הקודם</button
            > -->
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
@import "src/app.scss";
.modal_content {
  .modal-header {
    .modal-title {
      font-size: 1.34em;
      font-weight: bold;
    }
  }
  .modal-body {
    .cart-form {
      overflow-x: auto;
      .form-group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        @media screen and (max-width: 945px) {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .form-control {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 0;
          margin: 5px;
          line-height: 2.5;
          display: flex;
          flex-direction: column;
        }
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

              background-color: $gray-500;
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
    }
  }
}
</style>
