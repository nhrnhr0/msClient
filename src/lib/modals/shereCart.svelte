<script>
import { shereCartStore } from "../../stores/shereCartStore.js";
import { fly } from "svelte/transition";
import { browser } from "$app/env";
import { CLOUDINARY_URL, GET_SHAREABLE_CART_URL } from "../../api/consts.js";
import { userInfoStore } from "../../stores/stores.js";
import { cartStore } from "../../stores/cartStore.js";
import { flip } from "svelte/animate";
import { page } from "$app/stores";
import { mentries_to_data_array } from "../utils/utils.js";
import PivotEditTable from "../components/dashboard/PivotEditTable.svelte";
import { onMount } from "svelte";
import { getLocalStorageStore } from "./../../stores/localStorageStore.js";
import ColorDisplay from "../components/ColorDisplay.svelte";
import { fetch_wraper } from "src/api/api.js";
import { Spinner } from "sveltestrap";

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
  let return_variable = { ...entries2 };
  for (let keys1 in entries1) {
    for (let keys2 in entries1[keys1]) {
      if (entries1[keys1][keys2].hasOwnProperty("quantity")) {
        if (!return_variable.hasOwnProperty(keys1)) {
          return_variable[keys1] = {};
        }
        if (!return_variable[keys1].hasOwnProperty(keys2)) {
          return_variable[keys1][keys2] = { quantity: 0 };
        }
        if (entries1[keys1][keys2].hasOwnProperty("quantity")) {
          if (return_variable[keys1][keys2].hasOwnProperty("quantity")) {
            return_variable[keys1][keys2]["quantity"] +=
              entries1[keys1][keys2]["quantity"];
          } else {
            return_variable[keys1][keys2]["quantity"] =
              entries1[keys1][keys2]["quantity"];
          }
        }
      } else {
        for (let key3 in entries1[keys1][keys2]) {
          if (!return_variable.hasOwnProperty(keys1)) {
            return_variable[keys1] = {};
          }
          if (!return_variable[keys1].hasOwnProperty(keys2)) {
            return_variable[keys1][keys2] = {};
          }
          if (!return_variable[keys1][keys2].hasOwnProperty(key3)) {
            return_variable[keys1][keys2][key3] = { quantity: 0 };
          }
          if (entries1[keys1][keys2][key3].hasOwnProperty("quantity")) {
            if (
              return_variable[keys1][keys2][key3].hasOwnProperty("quantity")
            ) {
              return_variable[keys1][keys2][key3]["quantity"] +=
                entries1[keys1][keys2][key3]["quantity"];
            } else {
              return_variable[keys1][keys2][key3]["quantity"] =
                entries1[keys1][keys2][key3]["quantity"];
            }
          }
        }
      }
    }
  }
  return return_variable;
}

function add_all_products() {
  //   let i = 0;
  let arr = $shereCartStore.temp_cart;
  for (let i = 0; i < arr.length; i++) {
    setTimeout(() => {
      let product = arr[i];
      let product_id = product.id;
      add_product_to_cart(product_id);
    }, i * 150);
  }
  //   for (let idx in $shereCartStore.temp_cart) {
  //     setTimeout(() => {
  //       let product_id = $shereCartStore.temp_cart[idx].id;
  //       add_product_to_cart(product_id);
  //     }, i * 150);
  //     i++;
  //   }
}
function add_product_to_cart(product_id) {
  //   let product_data = $shereCartStore.temp_cart[product_key];

  let product_cart_data = cartStore.getProduct(product_id);
  let old_entries = {};
  if (product_cart_data) {
    old_entries = product_cart_data.mentries;
  }
  let product_data = $shereCartStore.temp_cart.find(
    (product) => product.id == product_id
  );
  let new_entries = merge_and_sum_mentries(old_entries, product_data.mentries);
  console.log(new_entries);
  let cart_prod = cartStore.getProduct(product_id);
  if (cart_prod) {
    cart_prod.mentries = new_entries;
    if (cart_prod.amount) {
      cart_prod.amount = cart_prod.amount + product_data.amount;
    } else {
      cart_prod.amount = product_data.amount;
    }
    cartStore.updateProduct(cart_prod);
  } else {
    product_data.mentries = new_entries;
    // $cartStore[product_key] = { ...product_data };
    cartStore.setProduct(product_data);
  }

  $shereCartStore.temp_cart = $shereCartStore.temp_cart.filter(
    (product) => product.id != product_id
  );
  $shereCartStore.temp_cart = [...$shereCartStore.temp_cart];

  if (Object.keys($shereCartStore.temp_cart).length == 0) {
    closeModal();
  }
}

function closeModal() {
  shereCartStore.closeModal();
  setTimeout(() => {
    $page.query.set("cart_json", "");
    window.history.pushState({}, "", window.location.pathname);
  }, 10);
}
function closePrompt() {
  if (confirm("האם אתה בטוח שברצונך לצאת מהעגלה ששיתפו איתך?")) {
    closeModal();
  }
}
let ALL_SIZES;
let ALL_COLORS;
let ALL_VARIENTS;

$: {
  if (!$shereCartStore.temp_cart && $shereCartStore.uuid) {
    let url = GET_SHAREABLE_CART_URL + $shereCartStore.uuid + "/";
    fetch_wraper(url, {}).then((response) => {
      if (response) {
        shereCartStore.setCart(response.data);
      }
    });
  }
}
onMount(async () => {
  ALL_SIZES = await getLocalStorageStore("sizes");
  ALL_COLORS = await getLocalStorageStore("colors");
  ALL_VARIENTS = await getLocalStorageStore("varients");
});

function get_pivot_rows(use_varients) {
  console.log("use_varients:", use_varients);
  let rows = [
    {
      val: "color_id",
      hidden: false,
      label: "צבע",
    },
  ];
  if (use_varients) {
    rows.push({
      val: "ver_id",
      hidden: false,
      label: "מודל",
    });
  }
  return rows;
}
</script>

{#if browser}
  <div
    id="shere_cart_modal"
    style="z-index: {shereCartStore.modal_zIndex};"
    class="modal"
    class:active={$shereCartStore.showModal}
  >
    <div
      class="overlay"
      style="z-index: {shereCartStore.modal_zIndex + 5};"
      on:click={closePrompt}
    >
      {#if $shereCartStore.showModal}
        <div
          class="modal_content"
          in:fly={{ y: 200, duration: 200 }}
          on:click|stopPropagation={() => {}}
          style="z-index: {shereCartStore.modal_zIndex + 10};"
        >
          <div class="modal-header">
            <button title="Close" on:click={closePrompt} class="close-btn right"
              >x</button
            >
            <div class="modal-title">עגלה ששותפה איתך</div>
            <button title="Close" on:click={closePrompt} class="close-btn left"
              >x</button
            >
          </div>
          <div class="modal-body">
            <button
              on:click={add_all_products}
              disabled={!$shereCartStore.temp_cart && $shereCartStore.uuid}
              class="add-all-btn btn btn-primary">הוסף הכל לסל</button
            >
            <div class="products">
              {#if $shereCartStore.temp_cart}
                {#each $shereCartStore.temp_cart as product (product.id)}
                  {@const product_key = product.id}
                  <div
                    class="product-wraper"
                    animate:flip={{ duration: 200 }}
                    out:fly={{ x: -480, duration: 200 }}
                  >
                    <div class="product-image">
                      <img
                        width="55px"
                        height="55px"
                        src="{CLOUDINARY_URL}/{product.cimage}"
                        alt=""
                      />
                    </div>
                    <div class="product-info">
                      <div class="product-name">
                        {product.title}
                      </div>
                      <div class="attributes">
                        {#if $userInfoStore?.me?.show_prices}
                          <div class="attribute">
                            <div class="product-price">
                              {product.price} ש"ח
                            </div>
                          </div>
                        {/if}
                        <div class="attribute">
                          <div class="product-quantity">
                            {product.amount} יח
                          </div>
                        </div>

                        {#if product.show_sizes_popup}
                          <div class="attribute">
                            <div
                              on:mouseenter={() => {
                                product.show_details = true;
                              }}
                              on:mouseleave={() => {
                                product.show_details = false;
                              }}
                              data-product-key={product_key}
                            >
                              פירוט
                            </div>
                            {#if product.show_details}
                              <div class="float-data">
                                <PivotEditTable
                                  tableClass="mentries-table"
                                  data={mentries_to_data_array(
                                    product.mentries
                                  )}
                                  rows={get_pivot_rows(
                                    !product.varients.length == 0
                                  )}
                                  colum={"size_id"}
                                  val={"quantity"}
                                  columSorter={function (arr) {
                                    console.log("columSorter:", arr);
                                    if (arr.length == 0) return arr;
                                    return arr.sort(function (a, b) {
                                      let a_val = ALL_SIZES.find(
                                        (s) => s.id == a
                                      )?.code;
                                      let b_val = ALL_SIZES.find(
                                        (s) => s.id == b
                                      )?.code;
                                      return b_val.localeCompare(a_val);
                                    });
                                  }}
                                >
                                  <th slot="col-header" let:col_data>
                                    {ALL_SIZES.find((s) => s.id == col_data)
                                      .size}
                                  </th>
                                  <th slot="row-header" let:row_data>
                                    {row_data["label"]}
                                  </th>
                                  <td slot="row-cell" let:row_data let:row_key>
                                    {#if row_key == "color_id"}
                                      <ColorDisplay
                                        color={ALL_COLORS.find(
                                          (c) => c.id == row_data[row_key]
                                        )}
                                      />
                                    {:else if row_key != "color_id"}
                                      {#if row_key == "ver_id"}
                                        {ALL_VARIENTS.find(
                                          (v) => v.id == row_data[row_key]
                                        )?.name}
                                      {:else}
                                        {row_data[row_key]}
                                      {/if}
                                    {/if}
                                  </td>
                                  <td
                                    slot="val-cell"
                                    let:original_data
                                    let:row_index
                                    let:row_key
                                    let:row_data
                                  >
                                    {original_data[row_index]?.quantity || ""}
                                  </td>
                                </PivotEditTable>
                              </div>
                            {/if}
                          </div>
                        {/if}
                      </div>
                    </div>
                    <button
                      on:click={add_product_to_cart(product_key)}
                      class="add-to-cart-btn btn btn-secondary"
                    >
                      הוסף לסל
                    </button>
                  </div>
                {/each}
              {:else}
                <Spinner />
              {/if}
              <!-- {#each $shereCartStore.temp_cart as product_key (product_key)}
                <div
                  class="product-wraper"
                  animate:flip={{ duration: 200 }}
                  out:fly={{ x: -480, duration: 200 }}
                >
                  <div class="product-image">
                    <img
                      width="55px"
                      height="55px"
                      src="{CLOUDINARY_URL}/{$shereCartStore.temp_cart[
                        product_key
                      ].cimage}"
                      alt=""
                    />
                  </div>
                  <div class="product-info">
                    <div class="product-name">
                      {$shereCartStore.temp_cart[product_key].title}
                    </div>
                    <div class="attributes">
                      {#if $userInfoStore?.me?.show_prices}
                        <div class="attribute">
                          <div class="product-price">
                            {$shereCartStore.temp_cart[product_key].price} ש"ח
                          </div>
                        </div>
                      {/if}
                      <div class="attribute">
                        <div class="product-quantity">
                          {$shereCartStore.temp_cart[product_key].amount} יח
                        </div>
                      </div>

                      {#if $shereCartStore.temp_cart[product_key].show_sizes_popup}
                        <div class="attribute">
                          <div
                            on:mouseenter={() => {
                              $shereCartStore.temp_cart[
                                product_key
                              ].show_details = true;
                            }}
                            on:mouseleave={() => {
                              $shereCartStore.temp_cart[
                                product_key
                              ].show_details = false;
                            }}
                            data-product-key={product_key}
                          >
                            פירוט
                          </div>
                          {#if $shereCartStore.temp_cart[product_key].show_details}
                            <div class="float-data">
                              <PivotEditTable
                                tableClass="mentries-table"
                                data={mentries_to_data_array(
                                  $shereCartStore.temp_cart[product_key]
                                    .mentries
                                )}
                                rows={get_pivot_rows(
                                  !$shereCartStore.temp_cart[product_key]
                                    .varients.length == 0
                                )}
                                colum={"size_id"}
                                val={"quantity"}
                                columSorter={function (arr) {
                                  console.log("columSorter:", arr);
                                  if (arr.length == 0) return arr;
                                  return arr.sort(function (a, b) {
                                    let a_val = ALL_SIZES.find(
                                      (s) => s.id == a
                                    )?.code;
                                    let b_val = ALL_SIZES.find(
                                      (s) => s.id == b
                                    )?.code;
                                    return b_val.localeCompare(a_val);
                                  });
                                }}
                              >
                                <th slot="col-header" let:col_data>
                                  {ALL_SIZES.find((s) => s.id == col_data).size}
                                </th>
                                <th slot="row-header" let:row_data>
                                  {row_data["label"]}
                                </th>
                                <td slot="row-cell" let:row_data let:row_key>
                                  {#if row_key == "color_id"}
                                    <ColorDisplay
                                      color={ALL_COLORS.find(
                                        (c) => c.id == row_data[row_key]
                                      )}
                                    />
                                  {:else if row_key != "color_id"}
                                    {#if row_key == "ver_id"}
                                      {ALL_VARIENTS.find(
                                        (v) => v.id == row_data[row_key]
                                      )?.name}
                                    {:else}
                                      {row_data[row_key]}
                                    {/if}
                                  {/if}
                                </td>
                                <td
                                  slot="val-cell"
                                  let:original_data
                                  let:row_index
                                  let:row_key
                                  let:row_data
                                >
                                  {original_data[row_index]?.quantity || ""}
                                </td>
                              </PivotEditTable>
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                  <button
                    on:click={add_product_to_cart(product_key)}
                    class="add-to-cart-btn btn btn-secondary"
                  >
                    הוסף לסל
                  </button>
                </div>
              {/each} -->
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
#shere_cart_modal {
  // overflow: scroll;

  // position: fixed;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100vh;
  // z-index: 990;
}
.overlay {
  width: 100%;
  height: 100%;
}

:global(.mentries-table) {
  width: 100%;
  margin: auto;
  border: 1px solid black;
  text-align: center;
  :global(thead) {
    background-color: #ccc;
    :global(tr) {
      :global(th) {
        padding: 10px;
        border: 1px solid black;
      }
    }
  }
  :global(tbody) {
    :global(tr) {
      :global(td) {
        border: 1px solid black;
        //padding: 10px;
      }
    }
    // color even rows
    tr:nth-child(even) {
      background-color: #f5f5f5;
    }
  }
}

.my-tooltip {
  position: relative;
  display: inline-block;
  //border-bottom: 1px dotted black;
  & .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }
  &:hover .tooltiptext {
    visibility: visible;
  }
}

.modal_content {
  overflow: auto;
  .modal-header {
    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      @media screen and (max-width: 768px) {
        font-size: 1.2rem;
      }
      @media screen and (max-width: 576px) {
        font-size: 1rem;
      }
    }
  }
}
.modal-body {
  overflow: visible;
  // padding-bottom: 350px;
  overflow-x: hidden;
}
.add-all-btn {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
}
.products {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: auto;
  margin-bottom: 100px;
  .product-wraper {
    display: flex;
    flex-direction: row;
    //justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border: 1px solid #333;
    .add-to-cart-btn {
      margin-left: 10px;
      position: absolute;
      left: 20px;
    }
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
        .attribute,
        .my-tooltip .attribute {
          //display: flex;
          //flex-direction: row;
          //justify-content: space-between;
          //align-items: center;
          padding: 5px;
          margin: 5px;
          border-radius: 25px;
          background-color: #eee;
          .float-data {
            position: absolute;
            background-color: #eee;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 12px;
            padding-bottom: 0px;
            z-index: 1;

            max-width: 100%;
            overflow: scroll;
            right: 0px;
          }

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
}

@media screen and (max-width: 600px) {
  .products {
    margin-bottom: 0px;
    .product-wraper {
      flex-direction: column;
      align-items: flex-start;
      .product-info {
        display: flex;
        flex-direction: column;
        .attributes {
          .attribute {
            margin: 5px 2px;
          }
        }
      }
      .add-to-cart-btn {
        margin-top: 10px;
        // position: relative;
        // left: none;
        // margin: auto;
      }
    }
  }
}
</style>
