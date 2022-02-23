
<script>
import FaveIcon from "./faveIcon.svelte";

    export let name = 'star';
    export let width = "2.5rem";
    export let height = "2.5rem";
    export let focusable = false;
    
    let focused = false;
    // on focused variable change, update the icon
    focusable = true;
    export function onFocus() {
        focused = true;
        updateIcon();
    }

    export function onBlur() {
        focused = false;
        updateIcon();
    }

    export function updateIcon() {
        if(focused) {
            name = 'star-full';
        }else {
            name = 'star';
            
        }
    }
</script>

<div class="icon">
    
    <button class:active="{focused}"  on:mouseenter="{onFocus}" on:mouseleave="{onBlur}" on:focus="{onFocus}" on:blur="{onBlur}" class="icon-inner">
            <FaveIcon name="{name}" width="2.5rem" height="2.5rem"/>
            מועדפים
    </button>
</div>
<style lang="scss">
    .icon {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999999;
        .icon-inner {
            display: block;
    cursor: pointer;
    background-color: #ffffffb6;
    width: 192px;
    position: fixed;
    z-index: 999;
    right: -2px;
    bottom: 150px;
    perspective: 1300px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    text-align: center;
    border: 2px solid white;
    box-shadow: rgb(0 0 0 / 25%) 0px 54px 55px, rgb(0 0 0 / 12%) 0px -12px 30px, rgb(0 0 0 / 12%) 0px 4px 6px, rgb(0 0 0 / 17%) 0px 12px 13px, rgb(0 0 0 / 9%) 0px -3px 5px;
        }

    }
</style>