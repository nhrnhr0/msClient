<script>
    import {albumsJsonStore} from './../stores/stores'
    import Fa from 'svelte-fa/src/fa.svelte'
    /*import {
        faShoppingCart
    } from '@fortawesome/free-solid-svg-icons'*/
    import {faShoppingCart} from '$lib/my-font-awsome';
    
    import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle
        } from 'sveltestrap';
        import {categoryModalStore} from './../stores/stores'
        function menuItemClicked(album) {
            console.log('openCategoryModal: ',album);
            $categoryModalStore.setAlbum(album);
            $categoryModalStore.open();
        }

</script>
<nav class="navbar navbar-expand-* navbar-light">
    <div class="container-fluid">
        <a class="navbar-logo" aria-label="logo" role="button"><img class="nav-logo" width="100px" height="40px"
                src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9"
                alt=""></a>

        <form class="d-flex" id="search_form">
            <input class="form-control" id="search" autocomplete="on" type="search" placeholder="חיפוש..."
                aria-label="Search">
            <!-- <button class="btn btn-outline-success" type="submit">Search</button>-->
            <div class="spiner" style="display: none;"></div>

        </form>



            <Dropdown id="navCategoryList">
                <DropdownToggle color="none" caret aria-label="menu">  
                    <svg viewBox="0 0 100 80" width="40" height="40">
                        <rect width="100" height="20"></rect>
                        <rect y="30" width="100" height="20"></rect>
                        <rect y="60" width="100" height="20"></rect>
                    </svg>
                </DropdownToggle>
                <DropdownMenu>                    
                    {#if $albumsJsonStore }
                        {#each $albumsJsonStore as  album}
                            <DropdownItem>
                                <button class="btn btn-dark" on:click={menuItemClicked(album)}>
                                    {album.title}
                                </button>
                            </DropdownItem>
                        {/each}
                    {/if}
                </DropdownMenu>
            </Dropdown>
            
                
                
            
        

        <div onclick="openCart()" id="cart-btn" class="cart">

            <Fa size="2x" icon={faShoppingCart} />

        </div>
        <div id="navbar_filler" class="none">
            <!--used as a filler in the navbar-->
        </div>



        
        
        

    </div>
</nav>



<style lang="scss">
    .navbar :global(#navCategoryList){
        position: inherit;
        :global(.dropdown-menu.show) {
            background: rgb(242, 242, 242);
            display:flex;
            width: 95vw;
            overflow-y: hidden;
            justify-content: space-around;
            flex-wrap: wrap;
            :global(.dropdown-item) {
                flex-basis: 1%;
                margin:auto;
                text-align: center;
            }
    }
}
    .navbar {
        
        
        @include bg-gradient();
        position: sticky;
        top: 0;
        z-index: 1000;

        .nav-logo {
            width: auto;
            height: 40px;
        }

        #search_form {
            flex-basis: 50%;

            #search {
                width: 80%;
                line-height: 2;
            }

            /*.menu {}

            .collapsible {

                //background-color: #777;
                //color: white;
                background-color: transparent;
                cursor: pointer;
                width: 100%;
                border: none;
                text-align: left;
                outline: none;
                font-size: 15px;
                border: 1px solid;
                color: rgba(0, 0, 0, .5);
                border-color: rgba(0, 0, 0, .1);

                &.active,
                &:hover {
                    background-color: #0000003d;
                }
            }



            .content {
                position: absolute;
                //padding: 0 18px;
                display: none;
                overflow: hidden;

                //transform: translate(75%, 25%);
                background-color: #e2e2e2;
                border-radius: 15px;
                border: 1px solid black;

                ul {
                    list-style: none;
                    padding: 0px;
                    margin: 0px;

                    li {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        font-size: xx-large;
                        white-space: nowrap;

                        @mixin menu-link-spaceing {
                            padding: 0px;
                            padding-left: 0px;
                            padding-right: 0px;
                        }

                        a {
                            width: 250px;
                            height: 50px;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            img {
                                @include menu-link-spaceing();
                                height: 40px;
                                width: auto;
                                //width: 100px;
                                margin: auto;
                            }
                        }

                        //margin-top:5px;
                        //margin-bottom:5px;
                        width: 100%;

                        &:hover {
                            background-color: #8a8a8a;
                            cursor: pointer;
                        }

                        & .who-us {
                            @include menu-link-spaceing();
                            font-size: larger;
                        }
                    }
                }
            }

            &.active {
                .content {
                    display: block !important;
                }
            }*/
        }
/*
        #navCategoryList {
            .dropdown-item {
                padding: .25rem 1rem;

                .btn {
                    width: 100%;
                }
            }
        }

        .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin: auto;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
*/
    }
</style>