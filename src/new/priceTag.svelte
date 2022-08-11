<script>
    export let price;
    export let new_price;
    export let top='25px';
    export let left='25px';
    export let font_size = '1.2em';
</script>

<div class="price-tag" style="top:{top};left:{left};--amount-font-size:{font_size}" >
    {#if new_price}
        <del>
            <span class="amount">
                {price}₪
            </span>
        </del>
        <ins>
            <span class="amount">
                {new_price}₪
            </span>
        </ins>
    {:else}
        <span class="amount">
            {price}₪
        </span>
    {/if}
</div>

<style lang="scss">
    .price-tag {
        position: absolute;
        top: 5px;
        left: 5px;
        line-height: 1;
        padding: 5px;
        font-weight: 700;
        border-radius: 25px;
        background: linear-gradient(110deg,#ececec 8%,#f5f5f5 18%,#ececec 33%);
        font-size: x-large;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .amount {
            font-size: var(--amount-font-size);
        }
        del {
            flex: 1;
            font-size: smaller;
            color: #ff000080;
            text-decoration: none;
            position: relative;
            display: block;
            text-align: center;
            &::before {
                content: " ";
                display: block;
                width: 100%;
                border-top: 2px solid rgba(255,0,0,.8);
                height: 9px;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: rotate(-7deg);
            }
        }
        ins {
            color: green;
            text-decoration: none;
        }
    }
</style>