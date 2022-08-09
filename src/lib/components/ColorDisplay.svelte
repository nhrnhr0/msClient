<script export="module">
    export let color; // {id:number,name:string, color:string}
    export let hideName = false;
    export let width = '100px';
    export let height = '30px';
</script>

<div class="color-display" title={color?.name} style="width: {width}; height: {height};">
    <div class="color-display-color" style="background-color:{color?.color};width:25px;height:25px;" ></div>
    {#if hideName == false}
        <div class="color-display-name">{color?.name}</div>
    {/if}
</div>
<style lang="scss">
    .color-display {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        width: 100px;
        height: 30px;
        gap: 5px;
        & .color-display-color {
            border:1px solid black;
        }
    }
</style>