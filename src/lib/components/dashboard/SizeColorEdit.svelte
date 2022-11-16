
<script>
import { browser } from "$app/env";

import { CLOUDINARY_URL } from "src/api/consts";
import { colorsJsonStore, sizesJsonStore } from "src/stores/stores";
import { onDestroy, onMount } from "svelte";


    export let product;
    export let entries;
    let mounted = false;
    onMount(() => {
        console.log('SizeColorEdit onMount product: ', product);
        mounted = true;
    });
    onDestroy(() => {
        mounted = false;
    });
    let loaded = false;
    $: loaded = product && $sizesJsonStore && $sizesJsonStore.length != 0 && $colorsJsonStore && $colorsJsonStore.length != 0 && mounted && browser;
    $: {
      console.log('SizeColorEdit loaded subscriptions: ', loaded);
      if (loaded) {
        setTimeout(() => {
          let sum = window.$.pivotUtilities.aggregatorTemplates.sum;
          var numberFormat = window.$.pivotUtilities.numberFormat;
          var intFormat = numberFormat({digitsAfterDecimal: 0});
        //let settings = JSON.parse(`rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":500,"cols":["size_name"],"rows":["color_name","verient_name"],"vals":["quantity"],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"onRefresh":null,"sorters":{},"inclusionsInfo":{},"aggregatorName":"Sum","rendererName":"Table"}`);
        window.$('#output-' + product.id).pivotUI(entries,
          JSON.parse('{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"hiddenAttributes":[],"menuLimit":500,"cols":["size_name"],"rows":["color_name","verient_name"],"vals":["quantity"],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"onRefresh":null,"sorters":{},"inclusionsInfo":{},"aggregatorName":"Sum","rendererName":"Table"}'),
          /*rows: ["color_name", "varient_name"],
            cols: ["size_name"],
            aggregator: sum(intFormat)(["quantity"]),*/
        false);  
        }, 50);
        /*
        setInterval(()=> {
          let temp_config = window.$("#output-" + product.id).data("pivotUIOptions");
          let config_copy2 = JSON.parse(JSON.stringify(temp_config));
          //delete some values which will not serialize to JSON
          delete config_copy2["aggregators"];
          delete config_copy2["renderers"];
          config_copy = config_copy2;
          
        }, 5000)*/
      }else {
      }
    }
    let config = undefined;
    let config_copy = undefined;
</script>
    <div id="output-{product.id}"></div>
    <!--
    config:<br>
    {JSON.stringify(config_copy)}
    -->