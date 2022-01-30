<script>
    import AutoComplete from "simple-svelte-autocomplete";
    import {cartObjStore} from './../stores/cartStore';
    import {albumsJsonStore, loginModalStore, productModalStore, userInfoStore} from './../stores/stores'
    import {CLOUDINARY_URL, SEARCH_API_URL} from './../api/consts';

    /*import {
        faShoppingCart
    } from '@fortawesome/free-solid-svg-icons'*/
    import { fade, fly } from 'svelte/transition';

    import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle,
Spinner
        } from 'sveltestrap';
        import {categoryModalStore} from './../stores/stores'
        import { cartStore } from './../stores/cartStore';
        import { onDestroy } from "svelte";
        //import boop from '$lib/components/boop/boop'
        import Cart from '$lib/components/cart/cart.svelte'
import NavLoginManager from "./components/navLoginManager.svelte";
import { apiSearchProducts } from "./../api/api";
import { logStore } from "./../stores/logStore";
        function menuItemClicked(album) {
            $categoryModalStore.setAlbum(album);
            $categoryModalStore.toggleModal();



            logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה מהנאב-בר',
                                't': 'open category',
                                'f':{
                                    'type':'navbar',
                                },
                                'w':{
                                    'type':'category',
                                    'id':album.id,
                                    'ti':album.title, 
                                }
                            }
                            );
        }
        let searchValue;
        async function searchProducts(keyword) {
            let json = await apiSearchProducts(keyword);
            let data = json;
            let albums = [];
            let album = undefined;
            // get all the albums from the products and count how much products from each album
            for(let i = 0; i < data.all.length; i++) {
                let my_item = data.all[i];
                album = undefined;
                for(let item_album_iter = 0; item_album_iter < my_item.albums.length; item_album_iter++) {
                    /*if(my_item.albums[alb_iter].is_campain == false) {
                        album = my_item.albums[alb_iter];
                        break;
                    }*/
                    let alb = $albumsJsonStore.find(album => album.id == my_item.albums[item_album_iter]);
                    if(alb && alb.is_campain == false && alb.is_public == true) {
                        album = alb;
                        break;
                    }
                }
                // the product is only visible in campain, so hide from search
                if(album == undefined) {
                    // remove item i from data.all
                    data.all.splice(i, 1);
                    continue;
                }else {
                    my_item.albumId = album.id;
                }
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

            return items;
        }

        function autocompleteItemSelected(item) {

            if(item == undefined) {
                return;
            }
            let keyword = document.querySelector('input.autocomplete-input').value;
            
            if(item.item_count) {
                $categoryModalStore.setAlbum(item);
                $categoryModalStore.toggleModal();
                logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה מחיפוש',
                                't': 'open category',
                                'f':{
                                    'type':'search',
                                    'term': keyword,
                                },
                                'w':{
                                    'type':'category',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
            }else {
                $productModalStore.setProduct(item.albumId, item.id);
                $productModalStore.toggleModal();
                logStore.addLog(
                            {
                                'a': 'פתיחת מוצר מחיפוש',
                                't': 'open product',
                                'f':{
                                    'type':'search',
                                    'term': keyword,
                                },
                                'w':{
                                    'type':'product',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
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
        <a class="navbar-logo" href="javascript:window.location.href=window.location.href" aria-label="logo" role="button"><img class="nav-logo" width="98.7064676px" height="40px"
                src="https://res.cloudinary.com/ms-global/image/upload/f_auto,w_auto/v1634457672/msAssets/favicon_rza3n9"
                alt=""></a>

                

                <NavLoginManager></NavLoginManager>


        <form class="d-flex" id="search_form">
            <AutoComplete id="search_input" on:focus loadingText="מחפש מוצרים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteItemSelected} create=true placeholder="חיפוש מוצרים..." className="autocomplete-cls" searchFunction={searchProducts} delay=200 localFiltering="{false}" labelFieldName="title" valueFieldName="value" bind:value={searchValue}  >
                <div slot="loading" let:loadingText={loadingText}>
                    <Spinner
                        size="sm"
                        speed="750"
                        unit="em"
                        color="#A82124"
                        thickness="2"
                    />
                    <span>{loadingText}</span>
                    <!-- spinner -->
                    
                </div>
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
                            <img alt="{item.title}" style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
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
                    <h1 class="drop-title"> מחלקות מוצרים</h1>
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
            
                
            <Cart bind:this={$cartObjStore}></Cart>
            <div>
            <a rel="noopener" target="_blank" href="https://wa.me/+972547919908" >
                <img src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png" alt="whatsapp">
            </a>
        </div>
            
        <div id="navbar_filler" class="none">
            <!--used as a filler in the navbar-->
        </div>



        
        
        

    </div>
</nav>



<style lang="scss">

:global(#navCategoryList) {
        :global(.dropdown-menu.show) {
          max-height: 80vh;
          overflow-y: auto;
          left: 0%!important;
          padding-top: 40px;
          .drop-title {
            font-size: 2rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            
          }
          @media screen and (max-width: 900px) {
            grid-template-columns: repeat(3, auto);
          }
          @media screen and (max-width: 600px) {
            grid-template-columns: repeat(2, auto);
            
          }
          @media screen and (max-width: 400px) {
            grid-template-columns: repeat(1, 1fr);
            :global(.drop-title) {
                text-align: center;
                width: 100%;
                padding-top: 5px;
            }
          }
        }
      }
:global(#navLoginManager) {
    :global(.dropdown-toggle) {
        padding: 0px;
        &::after {
            display: none;
        }
    }
}

/*
:global(.autocomplete-cls)  {
    
    
    * {
        font-size: large;
    }
    
    :global(.autocomplete-list) {
        border:1px solid red;
    }
}*/
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
      //transform: translate(0, 25%);
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
        .container-fluid {
            flex-wrap: nowrap;
        }
        
        @include bg-gradient();
        position: sticky;
        top: 0;
        z-index: 1000;

        .nav-logo {
            //width: auto;
            //height: 40px;
            @media screen and (max-width: 800px) {
                display: none;
            }
        }

        #search_form {
            flex-basis: 50%;
            :global(.autocomplete) {
                min-width: 83px;
                width: 100%;
                flex: 1;
                :global(.autocomplete-list) {
                    :global(.autocomplete-list-item) {
                        :global(.logo) {
                            @media screen and (max-width: 768px) {
                                display: none;
                            }
                        }
                    }

                    @media screen and (max-width: 550px) {
                        min-width: 90vw;
                        top: 100%;
                        right: -70px;
                        position: absolute;
                    }
                    
                }
                :global(.autocomplete-input) {
                    border-radius: 25px;
                    border: 1px solid #ccc;
                }
                /*:global(.autocomplete-input) {
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid #ccc;
                    padding: 0;
                    font-size: 1.2em;
                    :global(.autocomplete-input-icon) {
                        display: none;
                    }
                }*/
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