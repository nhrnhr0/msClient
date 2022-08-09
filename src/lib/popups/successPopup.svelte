

<script>
    import {successPopupStore} from "src/stores/popups/successPopupStore";
</script>

<div id="successModal" class="modal" class:active={$successPopupStore.isOpen} >
    <div class="overlay" on:click={successPopupStore.close}></div>
    <div class="modal_content" >
        <div class="modal-header">
            <h1>
                הטופס הוגש בהצלחה
            </h1>
        </div>
        <div class="modal-body">
            <div class="main-content">
                <div class="inner">
                    <h1>תודה על הגשת הטופס</h1>
                    <h2>נציגנו יצור איתך קשר בקרוב</h2>
                </div>
            </div>

        </div>
        <div class="modal-footer">
            <div class="img-container">
                <img height="80" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1635779280/msAssets/logo_ms_outline_veuwpb.png"
                    width="198" alt="M.S. Global">
            </div>
        </div>
        <!-- End of Dynamic Section -->
    </div>
</div>

<style lang="scss">
    
    .modal-header {
        
        h1 {
            margin: auto;
            text-align: center;
        }
    }
    .modal-body {
        text-align: center;
    }
    .modal-footer {
        background: linear-gradient(360deg, #414040 10%, #494949 360%);
        .img-container {
            margin: auto;
        }
    }
</style>