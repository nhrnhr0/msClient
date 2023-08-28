<script context="module">
</script>

<script>
import { CLOUDINARY_URL } from "./../api/consts";

import AutoComplete from "simple-svelte-autocomplete";
import { Spinner } from "sveltestrap";
import { userInfoStore } from "./../stores/stores";
import { apiSearchProducts } from "./../api/api";
const STEP = 3;
let selectedProducts = [];
let searchValue = "";
let show_title = false;
const IMAGE_LOCATIONS = {
  0: [{ left: 261, top: 25, max_width: 35 }],
  1: [
    { left: 4, top: 25, max_width: 35 },
    { left: 561, top: 25, max_width: 35 },
  ],
  2: [
    { left: 4, top: 55, max_width: 30 },
    { left: 600, top: 55, max_width: 30 },
    { left: 290, top: 55, max_width: 30 },
  ],
  3: [
    // split evenly in a raw, top: 55 left from 0 - 625 , 4 times, max_width: 22
    { left: 16, top: 55, max_width: 22 },
    { left: 230, top: 55, max_width: 22 },
    { left: 444, top: 55, max_width: 22 },
    { left: 658, top: 55, max_width: 22 },
  ],
  4: [
    { left: 4, top: 0, max_width: 25 },
    { left: 600, top: 0, max_width: 25 },
    { left: 150, top: "auto", right: "auto", bottom: 5, max_width: 20 },
    { left: "auto", top: "auto", right: 150, bottom: 5, max_width: 20 },
    { left: 330, top: 110, bottom: "auto", right: "auto", max_width: 20 },
  ],
};
function autocompleteItemSelected(item) {
  if (item != undefined && selectedProducts.length < 5) {
    console.log("autocompleteItemSelected: ", item);
    selectedProducts = selectedProducts.filter((p) => p != null);
    item.show_title = true;
    selectedProducts.push(item);

    let locations = IMAGE_LOCATIONS[selectedProducts.length - 1];

    for (let i = 0; i < selectedProducts.length; i++) {
      let loc = locations[i];
      selectedProducts[i].location = loc;
    }

    searchValue = "";
    selectedProducts = [...new Set(selectedProducts)];
  }
}
async function searchProducts(keyword) {
  let json = await apiSearchProducts(keyword);
  let data = json;
  let albums = [];
  let album = undefined;
  let items = data.all;
  return items;
}
function downloadURI(uri, name) {
  var link = document.createElement("a");

  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  //after creating link you should delete dynamic link
  //clearDynamicLink(link);
}
function download() {
  window.html2canvas(document.querySelector("#capture"), { allowTaint: false, useCORS: true }).then((canvas) => {
    //document.body.appendChild(canvas)

    var myImage = canvas.toDataURL();
    downloadURI(myImage, "MaSimulation.png");
  });
}
</script>

<svelte:head>
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</svelte:head>
{#if $userInfoStore.isLogin && $userInfoStore.me.is_superuser}
  <div class="page">
    <div class="part part-1">
      <AutoComplete
        id="search_input"
        on:focus
        loadingText="מחפש מוצרים..."
        createText="לא נמצאו תוצאות חיפוש"
        showLoadingIndicator="true"
        noResultsText=""
        onChange={autocompleteItemSelected}
        create="true"
        placeholder="חיפוש מוצרים..."
        className="autocomplete-cls"
        searchFunction={searchProducts}
        delay="200"
        localFiltering={false}
        labelFieldName="title"
        valueFieldName="value"
        bind:value={searchValue}
      >
        <div slot="loading" let:loadingText>
          <Spinner size="sm" speed="750" unit="em" color="#A82124" thickness="2" />
          <span>{loadingText}</span>
          <!-- spinner -->
        </div>
        <div slot="item" let:item let:label>
          {#if item.item_count}
            <div class="list-category">
              <div class="search-item">
                {item.title} ({item.item_count})
              </div>
            </div>
          {:else}
            <div class="search-item">
              <img alt={item.title} style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />

              {@html label}
            </div>
          {/if}
        </div>
      </AutoComplete>
      <br />
      <div>
        הצג כותרת
        <input type="checkbox" bind:checked={show_title} />
      </div>
      {#if selectedProducts.length > 0}
        <div class="selected-products">
          <table>
            <thead>
              <tr>
                <th>תמונה</th>
                <th>מוצר</th>
                <th>top</th>
                <th>left</th>
                <!--
                    <th>right</th>
                    <th>bottom</th>
                    -->
                <th>max_width</th>
                <th> הצג כותרת </th>
                <th>מחק</th>
              </tr>
            </thead>
            <tbody>
              {#each selectedProducts as item}
                {#if item != null}
                  <tr>
                    <td>
                      <img alt={item.title} style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
                    </td>
                    <td>
                      {item.title}
                    </td>
                    <td>
                      <input type="number" bind:value={item.location.top} />
                      <button
                        on:click={() => {
                          item.location.top += STEP;
                        }}
                        style="transform:rotate(90deg)"
                      >
                        <img height="15px" width="15px" src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="" />
                      </button>
                      <button
                        on:click={() => {
                          item.location.top -= STEP;
                        }}
                        style="transform:rotate(-90deg)"
                      >
                        <img height="15px" width="15px" src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="" />
                      </button>
                    </td>
                    <td>
                      <input type="number" bind:value={item.location.left} />
                      <button
                        on:click={() => {
                          item.location.left += STEP;
                        }}
                        style=""
                      >
                        <img height="15px" width="15px" src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="" />
                      </button>
                      <button
                        on:click={() => {
                          item.location.left -= STEP;
                        }}
                        style="transform:rotate(180deg)"
                      >
                        <img height="15px" width="15px" src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png" alt="" />
                      </button>
                    </td>
                    <td>
                      <input type="number" bind:value={item.location.max_width} />
                      <button
                        on:click={() => {
                          item.location.max_width++;
                        }}
                      >
                        +
                      </button>
                      <button
                        on:click={() => {
                          item.location.max_width--;
                        }}
                      >
                        -
                      </button>
                    </td>
                    <td>
                      <input type="checkbox" bind:checked={item.show_title} />
                    </td>
                    <td>
                      <button
                        class="selected-product-remove"
                        on:click={(e) => {
                          e.preventDefault();
                          selectedProducts.splice(selectedProducts.indexOf(item), 1);
                          selectedProducts = [...new Set(selectedProducts)];
                          let locations = IMAGE_LOCATIONS[selectedProducts.length - 1];

                          for (let i = 0; i < selectedProducts.length; i++) {
                            let loc = locations[i];
                            selectedProducts[i].location = loc;
                          }
                        }}
                        >מחק
                      </button>
                    </td>
                    <!--<div class="selected-product ">
                            <div class="selected-product-image">
                                <img alt="{item.title}" style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
                            </div>
                            <div class="selected-product-title">{item.title}</div>
                            <div class="selected-product-remove" on:click={() => {
                                selectedProducts.splice(selectedProducts.indexOf(item), 1);
                                selectedProducts = [...new Set(selectedProducts)];
                                let locations = IMAGE_LOCATIONS[selectedProducts.length - 1]
                        
                                for(let i = 0; i < selectedProducts.length; i++) {
                                    let loc = locations[i];
                                    selectedProducts[i].location = loc;
                                }
                                
                            }}>מחק
                            </div>
                            top: <input type="number" bind:value="{item.location.top}" />
                        </div>-->
                  </tr>{/if}
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
    <div id="capture" class="part part-2">
      <img
        on:load={(e) => {
          console.log("on:load: ", e);
        }}
        crossorigin="anonymous"
        src="https://res.cloudinary.com/ms-global/image/upload/f_auto,q_auto/v1/bizbiz/whatsapp_base"
        alt=""
      />

      <div class="selected-wraper">
        {#if show_title}
          <div class="selected-product-title-on-image title" contenteditable="true">test</div>
        {/if}
        {#each selectedProducts as item, idx}
          {#if item != null}
            <div
              style="--item-top:{item.location.top};--item-left:{item.location.left};--item-right:{item.location.right};--item-bottom:{item.location
                .bottom};max-width:{item.location.max_width}%;"
              class="item selected-product-item"
            >
              <img crossorigin="anonymous" alt={item.title} src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
              {#if item.show_title}
                <div class="selected-product-title-on-image" contenteditable="true">{item.title}</div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
      <!--
        {#each selectedProducts as item, idx}
            {#if item != null}
                
                <div style="--item-idx:{(idx-1)};--row-idx:{parseInt((idx-1)/3)};--col-idx:{parseInt((idx-1)%3)}" class="selected-product-on-image">
                    {idx}
                    <div class="selected-product-image-on-image">
                        <img alt="{item.title}" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
                    </div>
                    <div class="selected-product-title-on-image">{item.title}</div>
                    
                </div>
            {/if}
        {/each}
        -->
    </div>
  </div>
  <button on:click={download}>הורד</button>
{/if}

<style lang="scss">
.selected-wraper {
  /*display: grid;
        grid-template-columns: repeat(var(--var-num-rows), 1fr);*/
  position: absolute;
  top: 0px;
  //height: calc(390px);
  height: 100%;
  width: 100%;

  .title {
    position: absolute;
    top: 140px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    font-size: larger;
    font-weight: bold;
    z-index: 10;
  }
  .item {
    position: absolute;
    top: calc(var(--item-top) * 1px);
    left: calc(var(--item-left) * 1px);
    right: calc(var(--item-right) * 1px);
    bottom: calc(var(--item-bottom) * 1px);

    img {
      //width: 100%;
      /*max-width: 100%;
                max-height: 100%;*/
    }
    .selected-product-title-on-image {
      text-align: center;
      font-size: larger;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }
}
.selected-product-on-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  margin: 5px;
  position: relative;
  z-index: 1;
  position: absolute;

  .selected-product-image-on-image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
}
.selected-products {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
  .selected-product {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 10px;
    .selected-product-title {
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
    }
    .selected-product-image {
      margin-right: 10px;
      img {
        height: 25px;
      }
    }
    .selected-product-remove {
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
}
.page {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  .part {
    margin-bottom: 10px;
  }

  .part-1 {
    flex: 1;
    margin-right: 10px;
  }
  .part-2 {
    position: relative;
    width: 870px;
    height: 505px;
    //margin-left: 10px;
    img {
      width: 100%;
      //height: 100%;
    }
  }
}
</style>
