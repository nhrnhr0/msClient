


<script>
    export let orders;
</script>
{#if orders}
    <table class="order-table">
        <thead>
            <tr>
                <th>
                    תאריך הזמנה
                </th>
                <th>
                    מספר הזמנה
                </th>
                <th>
                    שם
                </th>
                <th>
                    סטטוס הזמנה
                </th>
                <th>
                    סכום הזמנה
                </th>
                <th>
                    כמות מוצרים
                </th>
                <th>
                    סוכן
                </th>
                <th>
                    פעולות
                </th>

            </tr>
        </thead>
        <tbody>
            
                {#each orders as order}
                <tr>
                    <td>
                        {new Date(order.created).toLocaleString('he-IL')}
                    </td>
                    <td>
                        {order.id}
                    </td>
                    <td>
                        {order.name}
                    </td>
                    <td>
                        {order.status}
                    </td>
                    <td>
                        {order.total_price} ₪
                    </td>
                    <td>
                        {order.products_count}
                    </td>
                    <td>
                        {order.agent_name}
                    </td>
                    <td>
                        <a href="/dashboard/doc-stock-out/{order.id}">פרטי הזמנה</a>
                    </td>
                </tr>
                {/each}
        </tbody>
    </table>
{:else}
    
{/if}

<style lang="scss">
    .order-table {
        width: 100%;
        thead {
            tr {
                th {
                    text-align: center;
                    background-color: #f5f5f5;
                    padding: 0.5rem;
                }
            }
        }
        
        tbody {
            tr {
                td {
                    text-align: center;
                    padding: 0.5rem;
                }
                
                &:nth-child(even) {
                    background-color: #dfdede;
                }
            }

        }
    }
</style>