<script>
import { browser } from "$app/env";

import { CLOUDINARY_URL } from "src/api/consts";
import {
  subAlbumsPopupStore,
  send,
  receive,
} from "src/stores/popups/subAlbumsPopupStore";

import { get_topLevelCategories } from "src/stores/sessionStorage/topLevelCategories";
import { onMount } from "svelte";
import Card from "./FlipCard.svelte";

export let main_categories = [];
onMount(() => {
  if (main_categories.length === 0) {
    console.log("load top level categories", main_categories);
    get_topLevelCategories().then((categories) => {
      main_categories = categories;
    });
  } else {
    console.log("categories already loaded", main_categories);
  }
  //main_categories = await indexdb_get_main_categories();
});

let main_categories_2d = [];
let active_cards_states = {};
let categories_clientWidth;
let small_screen_indicator; // = browser && categories_clientWidth > 700 ? 1 : 2;
let rows_lengths; // = small_screen_indicator == 1 ? [2, 2] : [3, 4];
const rows_lengths_options = [
  { width: 450, rows: [2, 2], card_max_width: "325px" },
  { width: 700, rows: [3, 2], card_max_width: "325px" },
  { width: 5000, rows: [3, 4], card_max_width: "325px" },
];
let selected_rows_option;
$: {
  // small_screen_indicator = browser && categories_clientWidth < 700 ? 1 : 2;
  let idx = 0;
  while (
    idx < rows_lengths_options.length &&
    categories_clientWidth > rows_lengths_options[idx].width
  ) {
    idx += 1;
  }
  let selected_rows_option_idx =
    idx == rows_lengths_options.length ? idx - 1 : idx;
  let selected_rows_option_temp =
    rows_lengths_options[selected_rows_option_idx]; //small_screen_indicator == 1 ? [3, 2] : [3, 4];
  selected_rows_option_temp.card_width =
    (
      categories_clientWidth /
        Math.max.apply(null, selected_rows_option_temp.rows) -
      25
    ).toString() + "px";
  selected_rows_option = selected_rows_option_temp;
  rows_lengths = selected_rows_option.rows;
}
$: {
  main_categories_2d = [];
  let current_row = [];
  let rows_counter = 0;
  for (let i = 0; i < main_categories.length; i++) {
    active_cards_states[main_categories[i].id] = false;
    let max_in_line = rows_lengths[rows_counter % 2];
    if (current_row.length >= max_in_line) {
      main_categories_2d.push(current_row);
      current_row = [];
      current_row.push(main_categories[i]);
      rows_counter += 1;
    } else {
      current_row.push(main_categories[i]);
    }
  }
  if (current_row.length != 0) {
    main_categories_2d.push(current_row);
  }
  console.log("main_categories_2d", main_categories_2d);
}
</script>

<div class="categories" bind:clientWidth={categories_clientWidth}>
  categories_clientWidth: {categories_clientWidth} <br />
  selected_rows_option:{JSON.stringify(selected_rows_option)}
  {#each main_categories_2d as categories_row, index1}
    <div class="categories-row">
      {#each categories_row as category, index2}
        <div
          class="category category-{category.id}"
          on:click={() => {
            // active_cards_states[category.id] =
            //   !active_cards_states[category.id];
            subAlbumsPopupStore.open(category);
          }}
        >
          <div
            class="card"
            style:width={selected_rows_option.card_width}
            style:max-width={selected_rows_option.card_max_width}
            class:active={active_cards_states[category.id]}
          >
            {#if $subAlbumsPopupStore["category"]?.id != category.id}
              <div
                class="image-clone"
                in:receive={{ key: category.id }}
                out:send={{ key: category.id }}
              >
                <img
                  src="{CLOUDINARY_URL}{category.get_image}"
                  alt={category.name}
                />
              </div>
            {/if}
            {#if !active_cards_states[category.id]}
              <div class="front">
                <div class="my-card-front">
                  <img
                    src="{CLOUDINARY_URL}{category.get_image}"
                    alt={category.name}
                  />
                  <div class="title">{category.name}</div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>

<!-- 
<div class="categories">
  {#each main_categories as category, index}
    
  {/each}
</div> -->
<style lang="scss">
.categories {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  .categories-row {
    display: flex;
    gap: 10px;
    justify-content: space-around;
    align-items: center;
    //margin-top: 20px;
  }

  @media screen and (max-width: 700px) {
    .categories-row {
      gap: 5px;
      .category {
        .card {
          // width: 30vw;
        }
      }
    }
  }
}
.category {
  cursor: pointer;

  .card {
    // width: 15vw;
    width: 21vw;
    background: rgba(238, 238, 238, 0.781);
    border-radius: 15px;
    position: relative;
    .image-clone {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .my-card-front {
    width: 100%;
    height: 100%;
    box-sizing: border-box; /*Don't forget this*/

    text-decoration: none;
    color: white;
    display: flex;
    flex-direction: column;
    & img {
      transition: all 0.5s ease-in-out;
      object-fit: cover;
      width: 80%;
      //height: calc(var(--card-height) - 10px);
      margin: auto;
    }
    & .title {
      text-align: center;
      color: rgb(22, 22, 22); //white;
      background-color: white; //rgba(255, 255, 255, 0);
      font-weight: bold;
      font-size: large;
      transition: all 0.25s ease-in-out;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: absolute;
      width: 100%;
      bottom: 0px;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }
  &:hover {
    .my-card-front {
      & .title {
        bottom: 0px;
        font-size: smaller;
      }
      & img {
        //width: 85%;
        transform: scale(1.2);
      }
    }
  }
  .my-card-back-slot {
    display: none;
    height: 100%;
    .my-card-back {
      background-color: reba(0, 0, 0, 0.1);
      overflow-y: scroll;
      height: 100%;
      pointer-events: auto;
      z-index: 10;
      .category-title {
        margin-top: 50px;
      }
      .close {
        margin: 0 0 15px 0;
        text-decoration: none;
        position: absolute;
        top: 5px;
        left: 20px;
        display: flex;
        border: none;
        background: none;
        color: white;
        font-size: x-large;
        transition: all 0.2s ease-in-out;
        z-index: 9;
        &:hover {
          transform: scale(1.2);
          color: red;
        }
      }
      .albums {
        display: flex;
        flex-wrap: wrap;
        a.album {
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          width: fit-content;

          color: black;
          border-radius: 10px;
          background-color: rgba(214, 214, 214, 0.815);
          margin: 5px;
          padding-top: 5px;
          padding-bottom: 5px;
          //font-size: x-large;
          transition: all 0.2s;
          &:hover {
            color: white;
            background-color: rgba(87, 85, 85, 0.815);
          }
        }
      }
    }
  }
  .card {
    &.active {
      .my-card-back-slot {
        display: block;
        border: 1px solid red;
        position: absolute;
        top: 0px;
        left: 0px;
        height: 50px;
      }
      .my-card-front {
        display: none;
      }
    }
  }
}
</style>
