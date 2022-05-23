<script>
      import AutoComplete from "simple-svelte-autocomplete";
import { apiSearchProviders,apiSearchWarehouses,apiSubmitCreateDocStockEnter } from "@src/api/api";
import { Spinner } from "sveltestrap";
import { getContext, onMount } from 'svelte';
import { warhousesJsonStore } from "@src/stores/stores";
import { get_warehouses_api } from "@src/api/api";

const { open, close } = getContext('simple-modal');
  export let refresh;
      let inp_invoice_number;
      let inp_description;
      let warehouses;
      let selectedProvider;
      function autocompleteProviderSelected(provider) {
        selectedProvider = provider;
      }

      async function searchProviders(keyword) {
          let providers = await apiSearchProviders(keyword)
          return providers;
      }


      let selectedWarehouse;
      async function searchWarehouse(keyword) {
        let warehouses = await apiSearchWarehouses(keyword)
        return warehouses;
      } 
      function autocompleteWarehouseSelected(warehouse) {
        selectedWarehouse = warehouse;
      }



      function form_submit(e) {
        e.preventDefault();
        debugger;
        let data = {
          invoice_number: inp_invoice_number,
          description: inp_description,
          provider: selectedProvider,
          warehouse: selectedWarehouse
        }
        console.log(data);
        apiSubmitCreateDocStockEnter(data).then(() => {
          refresh();
          close()
        });
      }

      onMount(async ()=> {
        alert('onMount');
        if($warhousesJsonStore == undefined) {
          let reponse = await get_warehouses_api();
          debugger;
          alert(reponse);
          $warhousesJsonStore.set(reponse.data);
        }
      })
</script>
  
<div class="header">
  <div class="header-title">
    <h1>צור מסמך הכנסה למלאי</h1>
  </div>
</div>

  <form on:submit="{form_submit}" action="" method="post">
    <!--
      תיאור - textarea
      מספר חשבונית - text  input
      ספק - select input from providers
      מחסן - select input from warehouses
    -->
    <div class="form-group">
      <label for="description">תיאור</label>
      <textarea bind:value={inp_description} class="form-control" id="description" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label for="invoice_number">מספר חשבונית</label>
      <input type="text" bind:value={inp_invoice_number} class="form-control" id="invoice_number" placeholder="מספר חשבונית">
    </div>
    <div class="form-group">
      <label for="provider">ספק</label>
      <AutoComplete tabindex={'0'} id="provider_search_input" on:focus loadingText="מחפש ספקים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteProviderSelected} create=true placeholder="חיפוש ספקים..." className="autocomplete-cls" searchFunction={searchProviders} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="value" bind:value={selectedProvider}  >
        <div slot="loading">
            <Spinner
                size="sm"
                speed="750"
                unit="em"
                color="#A82124"
                thickness="2"
            />
            <span>טוען...</span>
            <!-- spinner -->
            
        </div>
        <div slot="item" let:item={item} let:label={label}>
          {@html label}
        </div>
    </AutoComplete>
    </div>
    <div class="form-group">
      <label for="warehouse">מחסן</label>
      
      <AutoComplete tabindex={'1'} id="warhouse_search_input" loadingText="מחפש מחסנים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteWarehouseSelected} create=true placeholder="חיפוש מחסנים..." className="autocomplete-cls" searchFunction={searchWarehouse} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="value" bind:value={selectedWarehouse}  >
        <div slot="loading">
            <Spinner
                size="sm"
                speed="750"
                unit="em"
                color="#A82124"
                thickness="2"
            />
            <span>טוען...</span>
            <!-- spinner -->
            
        </div>
        <div slot="item" let:item={item} let:label={label}>
          {@html label}
        </div>
    </AutoComplete>
    </div>
    <button type="submit" class="btn btn-primary">שלח</button>

  </form>

  <style lang="scss">
    .header {
      .header-title {
        h1 {
          font-size: 1.5em;
          font-weight: bold;
          text-align: center;
        }
      }
    }
    .form-group {
      margin-bottom: 1rem;
      //border: 1px solid red;
      display: flex;
      flex-direction: column;
    }
    
  </style>