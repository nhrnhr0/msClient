<script>
  import { fly, fade } from "svelte/transition";
  import {
    cartHistoryModalStore,
    historyProductsModalStore,
  } from "../../stores/stores";
  import { fetch_wraper } from "../../api/api";
  import { CART_HISTORY_URL } from "../../api/consts";
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  //import { formatToLocalDate } from "../../lib/utils/utils";

  let isLoading = false;
  let cartHistoryHeadings = [
    /*{ labelEn: "name", labelHb: "שֵׁם" },
    { labelEn: "businessName", labelHb: "שם עסק" },
    { labelEn: "email", labelHb: "אימייל" },
    { labelEn: "phone", labelHb: "טלפון" },*/
    { labelEn: "created_date", labelHb: "תאריך יצירה" },
    {labelEn: "creator", labelHb: "יוצר ההזמנה"},
    /*{ labelEn: "agent_id", labelHb: "סוֹכֵן" },
    { labelEn: "doneOrder", labelHb: "הזמנה הושלמה" },*/
    { labelEn: "message", labelHb: "הוֹדָעָה" },
    {labelEn:"productsCount", labelHb:"כמות מוצרים"},
    { labelEn: "productsRaw", labelHb: "מוצרים" },
  ];

  onMount(async () => {
    isLoading = true;
    try {
      $cartHistoryModalStore.cartHistory = await fetch_wraper(
        CART_HISTORY_URL,
        { method: "GET" }
      );
      console.log($cartHistoryModalStore.cartHistory);
    } catch (error) {
      console.error(
        "There was an error while fetching the cart history",
        error
      );
    }
    isLoading = false;
  });
</script>

<div
  id="cart-history-modal"
  class={`modal ${$cartHistoryModalStore.showModal ? "active" : ""}`}
>
  <div class="overlay" on:click="{()=>{cartHistoryModalStore.closeModal();}}">
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
            cartHistoryModalStore.closeModal();
          }}
          class="close-btn right">x</button
        >
        <h5 class="modal-title">עגלות אחרונות</h5>
        <button
          title="Close"
          on:click={() => {
            cartHistoryModalStore.closeModal();
          }}
          class="close-btn left">x</button
        >
      </div>
      <div class="modal-body">
        {#if isLoading}
          <div class="loader-wraper">
            <Spinner
              size="40"
              speed="750"
              color="#A82124"
              thickness="2"
              gap="40"
            />
          </div>
        {:else}
          <table class="history-table">
            <thead>
              <tr>
                {#each cartHistoryHeadings as cartHistoryHeading}
                  <th>{cartHistoryHeading.labelHb}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each $cartHistoryModalStore.cartHistory as cartHistory}
                <tr class:feture={cartHistory['agent_id'] != null}>
                  {#each cartHistoryHeadings as cartHistoryHeading}
                    {#if cartHistoryHeading.labelEn === "productsRaw"}
                      <td>
                        <button class="btn btn-primary"
                          on:click={() => {
                            $historyProductsModalStore.historyProducts =
                              JSON.parse(cartHistory.productsRaw ?? "{}");
                            historyProductsModalStore.openModal();
                            cartHistoryModalStore.closeModal();
                            console.log(
                              "$historyProductsModalStore.historyProducts: ",
                              $historyProductsModalStore.historyProducts
                            );
                          }}>הצג</button
                        ></td
                      >
                    {:else if cartHistoryHeading.labelEn === "created_date"}
                      <td>{new Date(cartHistory["created_date"]).toLocaleString("he-il")}</td>
                    {:else if cartHistoryHeading.labelEn === "creator"}
                      <td>{cartHistory['agent__name'] || cartHistory['name'] || cartHistory["agent__client__businessName"] || ''}</td>
                    {:else if cartHistoryHeading.labelEn === "productsCount"}
                      <td>
                          {Object.keys(JSON.parse(cartHistory.productsRaw || '{}')).length}
                        </td>
                    {:else}
                      <td>{cartHistory[cartHistoryHeading.labelEn]}</td>
                    {/if}
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .loader-wraper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .modal-body {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .history-table {
    width: 100%;
    th {
      text-align: center;
      border: 1px solid #555;
    }
    td {
      text-align: center;
      border: 1px solid #555;
    }
  }
</style>
