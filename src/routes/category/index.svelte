<script context="module">
    import { fetch_wraper } from "./../../api/api";
    import { ALBUMS_API_URL } from "./../../api/consts";
    
    
        
    
        export async function load({fetch}) {
            let response = await fetch_wraper(ALBUMS_API_URL, {method: "GET"}, fetch);
            //console.log(response);
            return {
                props: {
                    data: response
                }
                
            };
        }
        
    </script>
    <script>
        export let data;
    </script>
    
    {#each data as d}
        <a href="/category/{d.id}/">category {d.id}</a>  
    {/each}
    