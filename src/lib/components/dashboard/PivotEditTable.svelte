<script>
    export let data;
    export let rows;
    export let colum;
    export let val;


    export let tableClass = "";
    export let rowClass = "";
    export let colClass = "";

    export let columSorter;
    export let filter_func;

    let cols_str = new Set([]);
    export let pivotData = [];
    let sorted_cols_str;

    let update_key = "key_";
    let update_key_counter = 0;

    $: {
        /**
         * example data:
         * [{'providerName':X, 'color': Y, 'size': Z, 'quantity': U},...]
         * [
         *     {'providerName':'provider1', 'color': 'RED', 'size': 'small', 'quantity': 3},
         *     {'providerName':'provider1', 'color': 'RED', 'size': 'medium', 'quantity': 2},
         *     {'providerName':'provider1', 'color': 'RED', 'size': 'large', 'quantity': 1},
         *     {'providerName':'provider1', 'color': 'BLUE', 'size': 'small', 'quantity': 1},
         *     {'providerName':'provider1', 'color': 'BLUE', 'size': 'medium', 'quantity': 2},
         *     {'providerName':'provider1', 'color': 'BLUE', 'size': 'large', 'quantity': 3},
         *     {'providerName':'provider2', 'color': 'RED', 'size': 'small', 'quantity': 1},
         * ]
         * rows: ['providerName', 'color',]
         * colum: ['size']
         * val: ['quantity']
         * 
         * pivotData:
         * [
         *    {'providerName':'provider1', 'color': 'RED', 'small': 0, 'medium': 1, 'large': 2},
         *    {'providerName':'provider1', 'color': 'BLUE', 'small': 3, 'medium': 4, 'large': 5},
         *    {'providerName':'provider2', 'color': 'RED', 'small': 6, 'medium': -1, 'large': -1},
         * ]
         * up data change, recreate pivotData:
        */
        cols_str = new Set([]);
        pivotData = [];
        sorted_cols_str = undefined;
        for(let i = 0; i < data.length; i++) {
            let entry = data[i];
            let pivotRow = {};
            for(let r = 0; r < rows.length; r++) {
                pivotRow[rows[r]] = entry[rows[r]];
            }
            let [idx, rowData] = get_or_create_pivot_row(pivotRow);
            let rowCol = entry[colum];
            cols_str.add(rowCol);
            pivotData[idx][rowCol] = i;
            if(pivotData[idx]._original_data_idxs == undefined) {
                pivotData[idx]._original_data_idxs= new Set([]);
            }
            pivotData[idx]._original_data_idxs.add(i);
            
        }
        if (columSorter) {
            sorted_cols_str = [...columSorter(Array.from(cols_str))];
        }else {
            sorted_cols_str = [...Array.from(cols_str)];
        }
        
        update_key_counter +=1;
        update_key = "" + update_key_counter.toString();
    }
    function cmp(val1, val2) {
        
        let response = false;
        // if((typeof val1 === 'object' &&
        //     !Array.isArray(val1) &&
        //     val1 !== null) ||
        //     (typeof val2 === 'object' &&
        //     !Array.isArray(val2) &&
        //     val2 !== null)) {
                response = JSON.stringify(val1) === JSON.stringify(val2);
            // }
        /*else{
            response = val1 === val2;
        }*/
        return response;
    }
    function get_or_create_pivot_row(pivotRow) {
        
        let rowIdx = pivotData.findIndex(row => {
            for(let r = 0; r < rows.length; r++) {
                //console.log('comp: ', row[rows[r]], pivotRow[rows[r]]);
                if(!cmp(row[rows[r]],pivotRow[rows[r]])){ //if(JSON.stringify(row[rows[r]]) !== JSON.stringify(pivotRow[rows[r]])){
                    return false;
                }
            }
            return true;
        });
        if(rowIdx == -1) {
            let rowData = {};
            /*for(let r = 0; r < rows.length; r++) {
                rowData[rows[r]] = pivotRow[rows[r]];
            }*/
            rowData = {...pivotRow};
            //rowData['cols'] = {};
            rowIdx = pivotData.push(rowData) - 1;
        }
        return [rowIdx, pivotData[rowIdx]];
    }
</script>
{#key update_key}

    <table class={tableClass}>
        <thead>
            <tr>
                {#each rows as row}
                    <slot name="row-header" row_data={row}>
                        <th>{row}</th>
                    </slot>
                {/each}
                {#each sorted_cols_str as col}
                    <slot name="col-header" col_data={col}>
                        <th>{col}</th>
                    </slot>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each pivotData as rowData, pivotIdx}
                <tr class="pivot-tr {rowClass}" class:selected={pivotData[pivotIdx].selected} class:hidden={!filter_func(rowData)}>
                    <!--{#each rows as rowKey}
                        <td>
                            {rowData[rowKey]}
                        </td>
                    {/each}
                    {#each sorted_cols_str as col}
                        {@const dataIdx = rowData['cols'][col]}
                        <td class="{colClass}">
                            <slot name="cell"  idx={dataIdx} row-data={JSON.stringify(rowData)}>
                                {#if dataIdx != undefined}
                                    {data[dataIdx][val]}
                                {/if}
                            </slot>
                        </td>
                    {/each}-->
                    {#each rows as rowKey}
                        
                            <slot name="row-cell" origianl_indexs={sorted_cols_str.map(v=>rowData[v])} pivot_idx={pivotIdx} row_data={rowData} row_key={rowKey}>
                                <td>
                                {rowData[rowKey]}
                                </td>
                            </slot>
                        
                    {/each}
                    {#each sorted_cols_str as rowKey}
                        
                            <slot name="val-cell" row_index={rowData[rowKey]} row_data={rowData} row_key={rowKey}>
                                <td></td>
                            </slot>
                        
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/key}

<style lang="scss">
    .pivot-tr {
        border: 1px solid red;
        &.hidden {
            border: 1px solid blue;
        }
    }
</style>