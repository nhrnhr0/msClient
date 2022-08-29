<script >
    export let big_image_selected;
    export let image_url;
    let open_modal_time = undefined;
    export let key = undefined;
    import {send, receive} from './bigImagePopup';
    

	
    $: {
        if(big_image_selected == true) {
            open_modal_time=  new Date();
        }
    }

    function closeClicked() {
        let current_time = new Date();
        if(current_time - open_modal_time > 400) {
            big_image_selected = false;
        }
    }
</script>


{#if big_image_selected}
    <div id="big-image-modal">
        <div class="backdrop" on:click="{closeClicked}">
            <div class="content">
                    <div class="img">
                        <img width="1250" height="1250" src="{image_url}" alt="" in:receive={{key:key}} out:send={{key:key}}/>
                    </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .backdrop {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        z-index: 995;
        background: rgba(0, 0, 0, 0.45);
        overflow: hidden;
        .content {
            max-width: 100%;
            max-height: 100vh;
            margin: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            .img {
                margin-top: 10px;
                width: 95%;
                
            display: flex;
            justify-content: center;
            align-items: center;
                img{
                    max-width: 99%;
                
                    max-height: 95vh;
                    object-fit: contain;
                    background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                    border-radius: 25px;
                    box-shadow: 0px 0px 10px rgb(0 0 0 / 50%);
                    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
                }
                //width: 80%;
                
            }

                // img {
                //     background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                //     padding: 50px;
                //     max-width:100%;
                //     max-height:100%;    
                //     height: auto;
                //     width:auto;
                // }
            }
        }
    

</style>