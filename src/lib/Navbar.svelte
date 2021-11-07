<script>
    import AutoComplete from "simple-svelte-autocomplete";

    import {albumsJsonStore, loginModalStore, productModalStore, userInfoStore} from './../stores/stores'
    import {SEARCH_API_URL} from './../api/consts';

    /*import {
        faShoppingCart
    } from '@fortawesome/free-solid-svg-icons'*/
    import { fade, fly } from 'svelte/transition';

    import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle
        } from 'sveltestrap';
        import {categoryModalStore} from './../stores/stores'
        import { cartStore } from './../stores/cartStore';
        import { onDestroy } from "svelte";
        import boop from '$lib/components/boop/boop'
        import Cart from '$lib/components/cart/cart.svelte'
import NavLoginManager from "./components/navLoginManager.svelte";
        function menuItemClicked(album) {
            console.log('openCategoryModal: ',album);
            $categoryModalStore.setAlbum(album);
            $categoryModalStore.toggleModal();
        }
        let searchValue;
        async function searchProducts(keyword) {
            const url = SEARCH_API_URL + '?q=' + encodeURIComponent(keyword);
            var requestOptions = {
        method: 'GET',
        mode:'cors',
        credentials: 'include',//'',
        headers: myHeaders,
        redirect: 'follow'
        };
            const reponse = await fetch(url, requestOptions);
            const json = await reponse.json();
            console.log('search api result: ', json);
            let data = json;
            let albums = [];
            // get all the albums from the products and count how much products from each album
            for(let i = 0; i < data.all.length; i++) {
                let my_item = data.all[i];
                let album = my_item.albums[0];
                var album_index = albums.findIndex(a => a.id == album.id);
                if(album_index == -1) {
                    album.item_count = 1;
                    albums.push(album);
                }else{
                    albums[album_index].item_count += 1;
                }
            }

            albums.sort(function (a, b) {
                if (a.item_count > b.item_count) {
                    return -1;
                } else if (a.item_count <= b.item_count) {
                    return 1
                }
                return 0;
            });

            // add the albums in the start and after the products
            let items = albums.concat(data.all);

            console.log('returned from search: ', items);
            return items;
        }

        function autocompleteItemSelected(item) {
            if(item == undefined) {
                console.log('autocompleteItemSelected: item is undefined');
                return;
            }
            console.log('autocompleteItemSelected: ', item);
            if(item.item_count) {
                $categoryModalStore.setAlbum(item);
                $categoryModalStore.toggleModal();
            }else {
                $productModalStore.setProduct(item.albums[0].id, item.id);
                $productModalStore.toggleModal();

            }
        }
        let isBooped = false;
    function setIsBooped(val) {
		isBooped = val;
	}


        
</script>
<nav class="navbar navbar-expand-* navbar-light">
    <div class="container-fluid">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="navbar-logo" href="javascript:window.location.href=window.location.href" aria-label="logo" role="button"><img class="nav-logo" width="100px" height="40px"
                src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9"
                alt=""></a>

                

                <NavLoginManager></NavLoginManager>


        <form class="d-flex" id="search_form">
            <AutoComplete  loadingText="מחפש מוצרים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteItemSelected} create=true placeholder="חיפוש..." className="autocomplete-cls" searchFunction={searchProducts} delay=200 localFiltering="{false}" labelFieldName="title" valueFieldName="value" bind:selectedItem={searchValue} >

                <div slot="item" let:item={item} let:label={label}>
                {#if item.item_count}
                    <div class="list-category">
                        <div class="search-item">
                            {item.title} ({item.item_count})
                            <img class="logo" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" alt="M.S. Global">
                        </div>
                    </div>
                {:else}
                    <div class="search-item">
                        <img style="height:25px;" src="{item.image}" /> 
                        <img class="logo" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" alt="M.S. Global">
                        {@html label}
                    </div>
                {/if}

                  </div>
            </AutoComplete>
            <!--
            <input class="form-control" id="search" autocomplete="on" type="search" placeholder="חיפוש..."
                aria-label="Search">
                -->
            <!-- <button class="btn btn-outline-success" type="submit">Search</button>-->
            <div class="spiner" style="display: none;"></div>

        </form>



            <Dropdown id="navCategoryList" class="category-menu">
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
            
                
            <Cart></Cart>
            <div   on:mouseenter={() => isBooped = true} use:boop={{isBooped, scale:1.2, timing: 200, setter: setIsBooped}}>
            <a rel="noopener" target="_blank" href="https://wa.me/+972547919908" >
                <img src="whatsapp.png" alt="whatsapp">
            </a>
        </div>
            
        <div id="navbar_filler" class="none">
            <!--used as a filler in the navbar-->
        </div>



        
        
        

    </div>
</nav>



<style lang="scss">

:global(#navLoginManager) {
    :global(.dropdown-toggle) {
        padding: 0px;
        &::after {
            display: none;
        }
    }
}


:global(.autocomplete-cls)  {
    width: 100%!important;
    * {
        font-size: large;
    
    }
}
.list-category {
    
    //background-color: black;



    .search-item {
        padding-top: 5px;
        padding-bottom: 5px;
      text-align: right;
      border: 2px solid black;
      border-radius: 15px;
      //border: 5px black solid;
      background-color: #FFD880;
      text-align: center;
      font-size: larger;
    font-weight: bold;
    }

    &:hover {
      .search-item {
        //background-color: #40508d;
        background-color: #3969B1;
      }
    }
  }

  .search-item {
    text-align: right;
    padding-bottom:2px;
    padding-top:2px;
    .logo {
      //display: inline-block;
      height: 20px;
      transform: translate(0, 25%);
      float: left;
    }
  }



    /*.navbar :global(#navCategoryList){
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
}*/
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