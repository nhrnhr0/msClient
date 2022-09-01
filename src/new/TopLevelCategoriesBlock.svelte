<script>
import { CLOUDINARY_URL } from "src/api/consts";
import { indexdb_get_main_categories } from "src/stores/dexie/api_wrapers";

import { onMount } from "svelte";

export let main_categories = [];
onMount(async () => {
  if (main_categories.length === 0) {
    console.log("load top level categories", main_categories);
    main_categories = await indexdb_get_main_categories();
  } else {
    console.log("categories already loaded", main_categories);
  }
  //main_categories = await indexdb_get_main_categories();
});
</script>

<div class="categories">
  {#each main_categories as category, index}
    <div class="category" class:small={index % 7 > 2} data-idx={index}>
      <a href="main/?top={category.slug}">
        <img src="{CLOUDINARY_URL}{category.get_image}" alt={category.name} />
        <div class="title">{category.name}</div>
      </a>
    </div>
  {/each}
</div>

<style lang="scss">
.categories {
  display: flex;
  //gap: 5px;
  flex-wrap: wrap;
  //padding: 5px;
  justify-content: center;
  align-items: center;

  & .category {
    width: calc(30% - 10px);
    width: calc(22% - 5px);
    // &.small {
    //   width: calc(22% - 5px);
    // }
  }
}
.category {
  // light radial-gradient glow
  color: black;
  background: rgba(43, 43, 43, 0.3);
  border-radius: 5px;
  background-size: 200% 100%;
  color: white;
  padding: 5px;
  margin: 10px;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  //@include bg-gradient();
  cursor: pointer;
  // flex-grow: 1;
  // flex-shrink: 1;
  // flex-basis: 0;
  text-align: center;
  /*max-width:160px;// calc(100% * (1/4) - 10px - 1px);
        min-width: 160px;*/

  a {
    box-sizing: border-box; /*Don't forget this*/

    text-decoration: none;
    color: white;
    display: flex;
    flex-direction: column;
    & img {
      transition: all 0.5s ease-in-out;

      width: 150px;
      height: 150px;
      margin: auto;
      @media screen and (max-width: 600px) {
        width: 100px;
        height: 100px;
      }
    }
    & .title {
      text-align: center;
      color: white;
      background-color: rgba(255, 255, 255, 0);
      font-weight: bold;
      font-size: 22px;
      transition: all 0.5s ease-in-out;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &:hover,
  &:focus {
    background: rgb(43, 43, 43);
    color: white;
    a {
      color: white;
      & img {
        transform: scale(1.1);
        filter: brightness(0.8);
      }
      & .title {
        background-color: rgb(255, 255, 255);
        color: black;
      }
    }
  }

  @media screen and(max-width: 570px) {
    max-width: 120px;
    min-width: 120px;
    padding: 4px;
    margin: 5px;
    & a .title {
      font-size: 16px;
    }
  }
}
</style>
