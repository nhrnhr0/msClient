<script export="module">
    export let color_name;
    export let color_color;
</script>

<div class="color-display">
    <div class="color-display-color" style="background-color:{color_color};width:25px;height:25px;"></div>
    <div class="color-display-name">{color_name}</div>
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
    }
</style>