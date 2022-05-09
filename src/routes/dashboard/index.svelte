
<script>
import EnterDocsList from "$lib/components/dashboard/EnterDocsList.svelte";


    let selectedTab = 2;
    function selectTab(tab) {
        console.log('clicked')
        selectedTab = tab;
    }
</script>


<!--
    navbar with navigation for tabs [מלאי, טופס הכנסה למלאי, הזמנות]
-->
<nav>
    <div class="nav-wrapper">
        <ul class="nav-mobile">
            <li data-tab-id="1" on:click={()=>{selectTab(1)}} class:active={selectedTab == 1}>מלאי</li>
            <li data-tab-id="2" on:click={()=>{selectTab(2)}} class:active={selectedTab == 2}>טפסי הכנסה למלאי</li>
            <li data-tab-id="3" on:click={()=>{selectTab(3)}} class:active={selectedTab == 3}>טפסי הוצאה מהמלאי</li>
        </ul>
    </div>
</nav>

<div class="tabs">
    {#if selectedTab == 1}
        todo:
    {:else if selectedTab == 2}
        <div class="tab" data-tab-id="2">
            <EnterDocsList></EnterDocsList>
        </div>
    {/if}
</div>

<style lang="scss">
    nav {
        .nav-wrapper {
            .nav-mobile {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                list-style: none;
                li {
                    background-color: #f5f5f5;
                    padding: 7px;
                    border-radius: 5px;
                    cursor: pointer;
                    &.active {
                        background-color: #ffc107;
                    }
                }
            }
        }
    }

</style>