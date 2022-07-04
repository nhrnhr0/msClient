<script export="module">
    export let color; // {id:number,name:string, color:string}
</script>

<div class="color-display">
    <div class="color-display-color" style="background-color:{color?.color};width:25px;height:25px;"></div>
    <div class="color-display-name">{color?.name}</div>
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