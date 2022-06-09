


<script>
    export let orders;
</script>
{#if orders}
    <table class="order-table">
        <thead>
            <tr>
                <th>
                    id
                </th>
                <th>
                    שם
                </th>
                <th>
                    תאריך יצירה
                </th>
                <th>
                    סכום
                </th>
                <th>
                    # מוצרים
                </th>
                <th>
                    סוכן
                </th>
                <th>
                    פעולות
                </th>
                <th>
                    בליקוט
                </th>
                <th>
                    הזמנות ספקים
                </th>
                
                <th>
                    הקפא מלאי
                </th>
                <th>
                    הזמנה/<br>הצעת מחיר
                </th>
                <th>
                    ארכיון
                </th>
            </tr>
        </thead>
        <tbody>
            
                {#each orders as order}
                <tr>
                    <td>
                        {order.id}
                    </td>
                    <td>
                        {order.name}
                    </td>
                    <td>
                        {new Date(order.created).toLocaleString('he-IL')}
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
                    <td>
                        {order.startCollecting?'✅':'❌'}
                    </td>
                    <td>
                        {order.sendProviders?'✅':'❌'}
                    </td>
                    <td>
                        {order.freezeTakenInventory? '✅':'❌'}
                    </td>
                    <td>
                        {order.isOrder? 'הזמנה' : 'הצעת מחיר'}
                    </td>
                    <td>
                        {order.archive? '✅':'❌'}
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