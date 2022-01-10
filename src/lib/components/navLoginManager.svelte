<script>
        import {loginModalStore, userDetailModalStore, userInfoStore} from './../../stores/stores';
import { Spinner } from 'sveltestrap';
        function open_login_modal() {
            $loginModalStore.toggleModal();
        }
        function open_user_detail_modal() {
            $userDetailModalStore.toggleModal();
        }

        function login_btn_click() {
            if($userInfoStore.isLogin){
                open_user_detail_modal();
            }else{
                open_login_modal();
            }
        }
</script>

{#if $userInfoStore}
<button class="btn login-btn" on:click={login_btn_click}>
    {#if $userInfoStore.isLogin == undefined}
        <Spinner
                size="48"
                speed="750"
                color="#A82124"
                thickness="2"
                gap="40"
            />    
    {:else if !$userInfoStore.isLogin}
        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9069372 8 4 8.9069372 4 10 L 4 20 C 4 21.093063 4.9069372 22 6 22 L 18 22 C 19.093063 22 20 21.093063 20 20 L 20 10 C 20 8.9069372 19.093063 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 6 10 L 18 10 L 18 20 L 6 20 L 6 10 z M 12 13 C 10.9 13 10 13.9 10 15 C 10 16.1 10.9 17 12 17 C 13.1 17 14 16.1 14 15 C 14 13.9 13.1 13 12 13 z"/></svg>
    {:else}
        <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="48px" 
            height="48px"
            viewBox="0 0 600 600"
            fill="white">

            <title>Abstract user icon</title>

            <defs>
            <clipPath id="circular-border">
                <circle cx="300" cy="300" r="250" />
            </clipPath>
            </defs>
            
            <circle cx="300" cy="300" r="280" fill="black" />
            <circle cx="300" cy="230" r="100" />
            <circle cx="300" cy="550" r="190" clip-path="url(#circular-border)" />
        </svg>
    {/if}
</button>
{/if}

<style lang="scss">

</style>