<script context="module">
    export function load({ error, status }) {
      return {
        props: {
          title: `${status}: ${error.message}`,
          status: status,
          message: error.message,
          error: error,
        }
      };
    }
  </script>
  
  <script>
    export let title;
    export let status;
    export let message;
    export let error;
  </script>
  <svelte:head>
    <title>{title}</title>
  </svelte:head>

  {#if status == 404}
    <div class="main-content">
        <div class="inner">
            <h1>לקוחות יקרים !</h1>
            <h2>התחדשנו באתר חדש מוזמנים להיכנס לבקר <a href="/">למעבר לאתר</a></h2>
            <h3>תודה על שיתוף הפעולה</h3>
            <div class="img-container"><img height="80" alt="m.s. global" src="https://res.cloudinary.com/ms-global/image/upload/f_auto,w_auto/v1637096417/msAssets/logo_ms_outline_1_jpfkhg.png" width="198">
            </div>
        </div>
    </div>
{:else}
<div class="main-content">
    <div class="inner">
        <h1>לקוחות יקרים !</h1>
        <h2>נמצא שגיאה באתר, אם הבעיה חוזרת על עצמה</h2>
        <h2>בבקשה צור קשר וספר לנו מה קרה</h2>
        <h3>תודה על שיתוף הפעולה</h3>
        <div class="img-container"><img height="80" alt="m.s. global" src="https://res.cloudinary.com/ms-global/image/upload/f_auto,w_auto/v1637096417/msAssets/logo_ms_outline_1_jpfkhg.png" width="198">
        </div>
        קוד שגיאה: {status}<br>
        הודעה: {message}
        <hr>
        <pre style="direction: ltr;">
            {error.stack}
        </pre>
    </div>
</div>
{/if}

<style lang="scss">
    .main-content {
    @include bg-gradient();
    min-height: calc(100vh);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .inner {
        //transform: scale(1.5);
        background-color: #494949;
        text-align: start;
        box-shadow: -1px 1px 39px 4px rgba(0,0,0,1);
        padding: 50px;
        margin:10px;
        border-radius: 25px;
        h1 {
            font-size: 3rem;
        }
        h2 {
            font-size: 2.5rem;
        }
        h3 {
            font-size: 2rem;
        }
        color: white;
    }
    .img-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
@media only screen and (max-width:750px) {
    .main-content {
        .inner {
            padding:10px;
            h1 {
                font-size: 3.5rem;
            }
            h2 {
                font-size: 3rem;
            }
            h3 {
                font-size: 2.5rem;
            }
        }
    }
}
</style>