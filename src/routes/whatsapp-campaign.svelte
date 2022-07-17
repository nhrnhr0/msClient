<script context="module">
</script>

<script>
  import { CLOUDINARY_URL, GET_USERS_IN_EXCEL } from "./../api/consts";
  import { onMount } from "svelte";
  import AutoComplete from "simple-svelte-autocomplete";
  import { Spinner } from "sveltestrap";
  import {
    userInfoStore,
    selectedUsersForWhatsappCampaign,
  } from "./../stores/stores";
  import {
    apiSearchProducts,
    loadBusinessTypes,
    getAllUsersByBusinessTypes,
  } from "./../api/api";

  import {
    FileUploaderButton,
    Grid,
    Row,
    Column,
    MultiSelect,
    Tag,
    TextArea,
  } from "carbon-components-svelte";
  import SvelteTable from "svelte-table";
  import UserCheckboxForTable from "$lib/components/whatsapp-campaign/UserCheckboxForTable.svelte";

  const STEP = 3;
  let selectedProducts = [];
  let searchValue = "";
  const IMAGE_LOCATIONS = {
    0: [{ left: 261, top: 110, max_width: 35 }],
    1: [
      { left: 4, top: 5, max_width: 35 },
      { left: 561, top: 5, max_width: 35 },
    ],
    2: [
      { left: 4, top: 5, max_width: 30 },
      { left: 600, top: 5, max_width: 30 },
      { left: 290, top: 140, max_width: 30 },
    ],
    3: [
      { left: 4, top: 0, max_width: 25 },
      { left: 600, top: 0, max_width: 25 },
      { left: 150, top: 251, max_width: 20 },
      { left: 550, top: 251, max_width: 20 },
    ],
    4: [
      { left: 4, top: 0, max_width: 25 },
      { left: 600, top: 0, max_width: 25 },
      { left: 150, top: "auto", right: "auto", bottom: 5, max_width: 20 },
      { left: "auto", top: "auto", right: 150, bottom: 5, max_width: 20 },
      { left: 330, top: 110, bottom: "auto", right: "auto", max_width: 20 },
    ],
  };
  let businessTypes = [];
  let selectedBusinessTypes = [];
  let usersByBusinessTypes = [];
  let usersByBusinessTypesColumns = [
    {
      title: "",
      key: "id",
      renderComponent: UserCheckboxForTable,
    },
    {
      title: "שֵׁם",
      key: "name",
      value: (v) => v.name,
    },
    {
      title: "טלפון",
      key: "phone",
      value: (v) => v.phone,
    },
    {
      title: "ההודעה האחרונה שנשלחה + חותמת זמן",
      key: "lastMessageWithTimestamp",
      value: (v) => v.lastMessageWithTimestamp,
    },
    {
      title: "סוג העסק נבחר",
      key: "businessTypeSelect",
      value: (v) => v.businessTypeSelect,
    },
    {
      title: "מוצרים להווה ולרשימה",
      key: "productfitAndList",
      value: (v) => v.productfitAndList,
      renderValue: (v) => `${v.productfitAndList.percentage} %`,
    },
  ];
  let message = "";

  onMount(async () => {
    businessTypes = await loadBusinessTypes();
  });

  $: selectedBusinessTypes, selectedProducts, fetchUsersByBusinessTypes();
  $: usersByBusinessTypesWithoutSelectedUsers = usersByBusinessTypes.filter(
    (user) =>
      !$selectedUsersForWhatsappCampaign.some(
        (selectedUser) => selectedUser.id === user.id
      )
  );

  const fetchUsersByBusinessTypes = async () => {
    if (selectedBusinessTypes.length > 0) {
      usersByBusinessTypes = await getAllUsersByBusinessTypes({
        businessTypes: selectedBusinessTypes.join(","),
        catalogImages: selectedProducts.map((p) => p.id).join(","),
      });
    }
  };

  function autocompleteItemSelected(item) {
    if (item != undefined && selectedProducts.length < 5) {
      selectedProducts = selectedProducts.filter((p) => p != null);
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
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    //after creating link you should delete dynamic link
    //clearDynamicLink(link);
  }
  function download() {
    window
      .html2canvas(document.querySelector("#capture"), {
        allowTaint: false,
        useCORS: true,
      })
      .then((canvas) => {
        //document.body.appendChild(canvas)

        var myImage = canvas.toDataURL();
        downloadURI(myImage, "MaSimulation.png");
      });
  }

  const itemToStringCustom = (item) => {
    return item.name;
  };
  const filterItemCustom = (item, value) =>
    item.name.toLowerCase().includes(value.trim().toLowerCase());
  const sortItemCustom = (a, b) =>
    a.name.localeCompare(b.name, "he", { numeric: true });

  const getSelectedBusinessTypeNameFromId = (id) => {
    let businessType = businessTypes.find((b) => b.id === id);
    return businessType.name;
  };

  const handleMetadataDownlaod = () => {
    let metadata = {
      selectedProducts: selectedProducts,
      selectedBusinessTypes: selectedBusinessTypes,
      selectedUsers: $selectedUsersForWhatsappCampaign,
      message: message,
    };
    let json = JSON.stringify(metadata);
    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    downloadURI(url, `metadata-${Date.now()}.json`);
  };

  const handleExcelDownload = async () => {
    let link =
      GET_USERS_IN_EXCEL +
      "?" +
      new URLSearchParams({
        crmUserIds: $selectedUsersForWhatsappCampaign
          .map((u) => u.id)
          .join(","),
      });
    downloadURI(link, `users-${Date.now()}.xlsx`);
  };
</script>

<svelte:head>
  <!-- link https://html2canvas.hertzen.com/dist/html2canvas.min.js-->
  <script
    src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</svelte:head>
{#if $userInfoStore.isLogin && $userInfoStore.me.is_superuser}
  <main id="main">
    <FileUploaderButton labelText="להעלות מטא נתונים" />
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
            <Spinner
              size="sm"
              speed="750"
              unit="em"
              color="#A82124"
              thickness="2"
            />
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
                <img
                  alt={item.title}
                  style="height:25px;"
                  src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}"
                />

                {@html label}
              </div>
            {/if}
          </div>
        </AutoComplete>
        <br />
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
                  <th>מחק</th>
                </tr>
              </thead>
              <tbody>
                {#each selectedProducts as item}
                  {#if item != null}
                    <tr>
                      <td>
                        <img
                          alt={item.title}
                          style="height:25px;"
                          src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}"
                        />
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
                          <img
                            height="15px"
                            width="15px"
                            src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png"
                            alt=""
                          />
                        </button>
                        <button
                          on:click={() => {
                            item.location.top -= STEP;
                          }}
                          style="transform:rotate(-90deg)"
                        >
                          <img
                            height="15px"
                            width="15px"
                            src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png"
                            alt=""
                          />
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
                          <img
                            height="15px"
                            width="15px"
                            src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png"
                            alt=""
                          />
                        </button>
                        <button
                          on:click={() => {
                            item.location.left -= STEP;
                          }}
                          style="transform:rotate(180deg)"
                        >
                          <img
                            height="15px"
                            width="15px"
                            src="https://res.cloudinary.com/ms-global/image/upload/v1652882957/msAssets/right-arrow_2_sig23y.png"
                            alt=""
                          />
                        </button>
                      </td>
                      <td>
                        <input
                          type="number"
                          bind:value={item.location.max_width}
                        />
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
                        <button
                          class="selected-product-remove"
                          on:click={(e) => {
                            e.preventDefault();
                            selectedProducts.splice(
                              selectedProducts.indexOf(item),
                              1
                            );
                            selectedProducts = [...new Set(selectedProducts)];
                            let locations =
                              IMAGE_LOCATIONS[selectedProducts.length - 1];

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
          src="https://res.cloudinary.com/ms-global/image/upload/v1652862614/msAssets/WhatsApp_Image_2022-05-18_at_10.39.56_AM_rdb8o7.jpg"
          alt=""
        />
        <div class="selected-wraper">
          {#each selectedProducts as item, idx}
            {#if item != null}
              <div
                style="--item-top:{item.location.top};--item-left:{item.location
                  .left};--item-right:{item.location.right};--item-bottom:{item
                  .location.bottom};max-width:{item.location.max_width}%;"
                class="item selected-product-item"
              >
                <img
                  crossorigin="anonymous"
                  alt={item.title}
                  src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}"
                />
                <div class="selected-product-title-on-image">{item.title}</div>
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
    <div id="business-select-parent">
      <Grid fullWidth noGutterLeft noGutterRight>
        <Row>
          <Column>
            <MultiSelect
              titleText="טיפוס עסקי"
              label="בחר סוג עסק..."
              locale="he"
              items={businessTypes}
              filterable
              itemToString={itemToStringCustom}
              filterItem={filterItemCustom}
              sortItem={sortItemCustom}
              direction="top"
              bind:selectedIds={selectedBusinessTypes}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            {#each selectedBusinessTypes as selectedBusinessTypeId}
              <Tag
                >{getSelectedBusinessTypeNameFromId(
                  selectedBusinessTypeId
                )}</Tag
              >
            {/each}
          </Column>
        </Row>
      </Grid>
    </div>
    <div id="users-by-business-types-list">
      <p>משתמשים עם סוג העסק שנבחר בחרו</p>
      <SvelteTable
        columns={usersByBusinessTypesColumns}
        rows={usersByBusinessTypesWithoutSelectedUsers}
        classNameTable="users"
      />
    </div>
    <div id="selected-users-by-business-types-list">
      <p>משתמשים נבחרים</p>
      <SvelteTable
        columns={usersByBusinessTypesColumns}
        rows={$selectedUsersForWhatsappCampaign}
        classNameTable="users"
      />
    </div>
    <div id="message-container">
      <TextArea
        bind:value={message}
        labelText="הוֹדָעָה"
        placeholder="נא להזין הודעה"
      />
    </div>
    <div id="buttons-container">
      <button id="download-btn" on:click={download}>הורד תמונה</button>
      <button id="metadata-dwnld" on:click={handleMetadataDownlaod}
        >הורד מטא נתונים</button
      >
      <button id="excel-dwnld" on:click={handleExcelDownload}>הורד אקסל</button>
    </div>
  </main>
{/if}

<style lang="scss" global>
  .selected-wraper {
    /*display: grid;
        grid-template-columns: repeat(var(--var-num-rows), 1fr);*/
    position: absolute;
    top: 0px;
    //height: calc(390px);
    height: 100%;
    width: 100%;
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
    margin-top: 1rem;
    .part {
      margin-bottom: 10px;
    }

    .part-1 {
      flex: 1;
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
  #main {
    max-width: 64rem;
    margin: auto;
    padding-bottom: 1rem;
  }
  #business-select-parent {
    max-width: 48rem;
  }
  #users-by-business-types-list,
  #selected-users-by-business-types-list,
  #message-container,
  #buttons-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  #buttons-container {
    display: flex;
  }
  #metadata-dwnld {
    margin-right: 1rem;
  }
  #excel-dwnld {
    margin-right: 1rem;
  }
  table.users {
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
          color: white;
        }
      }
    }
    tbody {
      tr {
        // ligther colors on all odd rows
        &:nth-child(even) {
          background-color: $gray-600;
          // color: white;
        }
      }
    }
  }
</style>
