

<script>
import { userInfoStore } from './../../stores/stores';

    import {fly} from 'svelte/transition'
    let y;
    let _show_popup_bool = false;
    let is_first = false;
    let user_login = false;
    function hide_popup() {
        _show_popup_bool = false;
    }

    function show_popup() {
        _show_popup_bool = true;
    }
    $: {
        // hide popup if user is logged in
        if($userInfoStore && $userInfoStore.isLogin){
            user_login = true;
            hide_popup();
        }

    }
    $: {
        
        
        
        if(y > 900) {
            if(is_first == false && user_login == false) {
                setTimeout(() => {
                    show_popup();
                },2000);
            }
            is_first = true;
        }
    }
    function popup_clicked(e) {
        // open in new tab business-owner
        //window.location.href = "business-owner";
        // open in new tab business-owner
        window.open("business-owner", '_blank').focus();
    }
</script>
<svelte:window bind:scrollY={y}/>

<div class="popup">
    {#if _show_popup_bool}
        <button class="fixed-from" on:click={popup_clicked} in:fly="{{ x: -200, duration: 100 }}" out:fly="{{x:-200, duration:400}}" >
            <button class="close-popup" on:click|stopPropagation|preventDefault={hide_popup}>x</button>
            <div class="text">
                <span>בעל עסק?</span>
                <br>
                <span class="mark-strong">לחץ כאן</span>
            </div>
        </button>
    {/if}
</div>

<style lang="scss">
    .popup {
        .close-popup {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            background: none;
            transform: translate(80%, -50%);
            border: none;
            
            cursor: pointer;
        }
        position: absolute;
        top: 0px;
        left:0px;
        z-index: 999999;
        font-size: 23px;
        font-weight: bold;
        .fixed-from {
            display: block;
            cursor: pointer;
            background-color: #F25050;
            //192 × 256 px
            width: 192px;
            position: fixed;
            z-index: 999;
            left: -2px;
            bottom: 150px;
            perspective: 1300px;
            border-top-right-radius: 25px;
            border-bottom-right-radius: 25px;
            text-align: center;
            border: 2px solid white;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
            .text {
                .mark-strong {
                    font-weight: bold;
                }
            }
        }
    }
</style>