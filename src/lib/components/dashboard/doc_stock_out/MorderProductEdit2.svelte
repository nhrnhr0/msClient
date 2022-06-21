<script>
import { onMount } from "svelte";


    export let rows;
    export let col;
    export let val;
    export let data;
    let doneMount = false;
    let colsSets =new Set([]);
    onMount(async () => {
        refreshTable();
        doneMount = true;
    });

    function refreshTable() {
        debugger;
        for(let i = 0; i < data.length; i++) {
            if (data[i][col.key]) {
                console.log('data[i][col.key]:', data[i][col.key]);
                colsSets.add(data[i][col.key]);
            }
        }
        console.log('colsSets:', colsSets);
        colsSets = [...colsSets];
    }

</script>

<table>
    <thead>
        <tr>
            {#each rows as row}
                <th>
                    {row.label}
                </th>
            {/each}
            {#each [...colsSets] as col}
                <th>
                    {col}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as entry}
            <tr>
                {#each rows as row}
                    <td>
                        {entry[row.key]}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>