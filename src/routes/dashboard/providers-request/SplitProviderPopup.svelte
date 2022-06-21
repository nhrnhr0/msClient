<script>
import { CLOUDINARY_URL } from "@src/api/consts";
import { PROVIDERS_STORE,PROVIDERS_STORE_IDS_AS_KEYS, } from "@src/stores/localStorageStore";
import AutoComplete from "simple-svelte-autocomplete";
import { onDestroy } from "svelte";
import { Spinner } from "sveltestrap";
    /*function autocompleteProviderSelected (provider) {
        selectedProvider = provider;
    }*/
    let selectedProvider = undefined;
    export let info;
    export let rowData;
    export let size_key;
    export let update_or_create_func;

    let new_quantity = undefined;
    let new_providers = [];
    function add_new_provider() {
        new_providers.push({'provider': selectedProvider, 'quantity': new_quantity});
        new_quantity = undefined;
        selectedProvider = undefined;
        new_providers = [...new_providers];
    }

    onDestroy(async() => {
        update_or_create_func(-1,rowData, size_key, info.quantity);
        if(new_providers.length > 0) {
            //update_or_create_request_quantity_local(idx, rowData, size_key, val)
            debugger;
            
            for(let i = 0; i < new_providers.length; i++) {
                let idx = -1;
                let rowData2 = {...rowData}
                rowData2.provider = new_providers[i].provider.id;
                let val = new_providers[i].quantity;
                rowData2[size_key] = val;
                if(val && rowData2.provider) {
                    update_or_create_func(idx, rowData2, size_key, val);
                }
            }
            
        }
    });
</script>

<!--
    show the product info:
    info.product::{"id":139,"title":"גרבי ספורט","cimage":"v1635672331/site/products/%D7%92%D7%A8%D7%91%D7%99_%D7%A1%D7%A4%D7%95%D7%A8%D7%98_uBLcEGO_F2qhVi2_bSu2lWG_YL4VqpL_bwqc2vL_o2BI4nt.png"} 
-->
<div class="product-info">
    <div class="product-info-img">
        <img width="75px" height="75px" src="{CLOUDINARY_URL + info.product.cimage}" alt="{info.product.title}" />
    </div>
    <h3>{info.product.title}</h3>
</div>
<div class="provider-amounts">
    <table>
        <thead>
            <tr>
                <th>שם הספק</th>
                <th>כמות</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {$PROVIDERS_STORE_IDS_AS_KEYS[info.provider].label}
                </td>
                <td>
                    <input type="number" bind:value="{info.quantity}" />
                </td>
            </tr>
            {#each new_providers as provider}
                <tr>
                    <td>
                        {provider.provider.label}
                    </td>
                    <td>
                        <input type="number" bind:value="{provider.quantity}" />
                    </td>
                </tr>
            {/each}
            <tr>
                <td>
                    <AutoComplete tabindex={'0'} id="provider_search_input" on:focus loadingText="מחפש ספקים..." createText="לא נמצאו תוצאות חיפוש" items={$PROVIDERS_STORE} showLoadingIndicator=true noResultsText="" bind:selectedItem={selectedProvider} create=true placeholder="חיפוש ספקים..." className="autocomplete-cls" delay=200 localFiltering="{false}" labelFieldName="label" valueFieldName="value">
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
                </td>
                
                <td>
                    {#if selectedProvider}
                        <input type="number" bind:value="{new_quantity}" />
                        <button on:click="{add_new_provider}" class="btn btn-secondary">הוסף</button>
                    {/if}
                </td>
                
                
            </tr>
    </table>
</div>


<style lang="scss">
    .product-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }

    .provider-amounts {
        margin-bottom: 250px;
    }
</style>