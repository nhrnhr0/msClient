<script>
export let product;
</script>

{#if product.show_details}
  <!-- @const size_codes_dict = {size_code1: size_name1,} -->
  {@const size_codes_dict = product.details.reduce((acc, detail) => {
    acc[detail.size_code] = detail.size_name;
    return acc;
  }, {})}
  {@const orderd_codes = Object.keys(size_codes_dict).sort().reverse()}
  {@const colors_set = Array.from(
    new Set(product.details.map((detail) => detail.color_name))
  )}
  {@const varient_set = Array.from(
    new Set(product.details.map((detail) => detail.varient_name))
  )}
  <!-- clr_ver_crtz = [{clr1, ver1}, {clr1, ver2}] -->
  {@const clr_ver_crtz = colors_set.reduce((acc, color) => {
    varient_set.forEach((varient) => {
      acc.push({ color, varient });
    });
    return acc;
  }, [])}
  {@const use_varient = varient_set.length > 1 && varient_set[0] !== ""}
  <table class="table items">
    <thead>
      <tr>
        <th> צבע </th>
        {#if use_varient}
          <th> מודל </th>
        {/if}

        {#each orderd_codes as code}
          <th>
            {size_codes_dict[code]}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each clr_ver_crtz as row}
        <tr>
          <td>{row.color}</td>
          {#if use_varient}
            <td>{row.varient}</td>
          {/if}
          {#each orderd_codes as code}
            <td>
              {#each product.details as detail}
                {#if detail.size_code == code && detail.color_name == row.color && detail.varient_name == row.varient}
                  {detail.quantity}
                {/if}
              {/each}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- pivot table of  
                cols: size_name (order by size_code)
                rows: color_name, varient_name
                cells: quantity
             -->
{/if}

<style lang="scss">
table.table.items {
  margin: 0.5rem;
  margin-bottom: 100px;
  thead {
    background: #eee;
    tr {
      th {
        padding: 0.5em;
        text-align: center;
        border: 1px solid black;
      }
    }
  }
  tbody {
    tr {
      td {
        // border-bottom: 1px solid #ddd !important;
        padding: 0.5em;
        white-space: nowrap;
        border: 1px solid black;
        // padding: 0px !important;
      }
    }
  }
}
</style>
