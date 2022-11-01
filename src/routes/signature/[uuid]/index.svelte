<script context="module">
import { fetch_wraper } from "src/api/api";
import { GET_SIGNATURE_URL, SIGN_ON_DOC_URL } from "src/api/consts";
const TAX = 1.17;
import SignaturePad from "signature_pad";

export async function load({ fetch, page, session, contex }) {
  // do a request to GET_SIGNATURE_URL (from consts) with the uuid from the page.params and return the response
  // if the response is not 200, return { status: 404 }
  // if the response is 200, return { props: { data: response } }
  let uuid = page.params.uuid;
  let response = {};
  try {
    response = await fetch_wraper(
      GET_SIGNATURE_URL + uuid,
      { method: "GET" },
      fetch
    );
  } catch (error) {
    response = { status: 404 };
  }
  return {
    props: {
      data: response,
      uuid: uuid,
    },
  };
}
</script>

<script>
import { onMount } from "svelte";
import { FormGroup, Input, Spinner } from "sveltestrap";
import SvelteMarkdown from "svelte-markdown";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { scale } from "svelte/transition";
import { browser } from "$app/env";
import ProductEntriesTable from "src/lib/signature/ProductEntriesTable.svelte";

export let uuid;
export let data;
let submiting = false;
let canvas;
let signaturePad;
let is_signing = false;
const DESCRIPTION_SIZE_WIDTH =
  browser && window && window.innerWidth > 900 ? 217 : 100;
const DESCRIPTION_SIZE_HEIGHT =
  browser && window && window.innerWidth > 900 ? 50 : 50;

const is_small_screen = browser && window && window.innerWidth < 900;
onMount(() => {
  if (canvas) {
    signaturePad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
    });
  }
});

function validate_user_input() {
  let name = document.getElementById("full_name_input").value;
  let phone = document.getElementById("phone_input").value;
  let id = document.getElementById("id_input").value;
  if (!name) {
    alert("מלא שדה שם");
    return undefined;
  }
  if (!phone) {
    alert("מלא שדה טלפון");
    return undefined;
  }
  if (!id) {
    alert("מלא שדה תעודת זהות");
    return undefined;
  }
  return { name: name, phone: phone, id: id };

  // if (!user_data.id) {
  //   is_valid = false;
  //   let el = document.getElementById("id_input");
  //   el.classList.remove("valid");
  //   el.focus();
  // } else {
  //   let el = document.getElementById("id_input");
  //   el.classList.add("valid");
  // }

  // if (!user_data.phone) {
  //   is_valid = false;
  //   let el = document.getElementById("phone_input");
  //   el.classList.remove("valid");
  //   el.focus();
  // } else {
  //   let el = document.getElementById("phone_input");
  //   el.classList.add("valid");
  // }

  // if (!user_data.name) {
  //   is_valid = false;
  //   let el = document.getElementById("full_name_input");
  //   el.classList.remove("valid");
  //   el.focus();
  // } else {
  //   let el = document.getElementById("full_name_input");
  //   el.classList.add("valid");
  // }

  return is_valid;
}

function submit_btn_clicked(e) {
  e.preventDefault();
  if (signaturePad.isEmpty()) {
    alert("נא לחתום על המסמך");
    return;
  }
  let user_data = validate_user_input();
  if (user_data == undefined) {
    return;
  }

  submiting = true;
  let signature = signaturePad.toDataURL("image/png");
  // post data to SIGN_ON_DOC_URL with the file
  let response = fetch_wraper(SIGN_ON_DOC_URL + uuid + "/", {
    method: "POST",
    body: JSON.stringify({
      uuid: uuid,
      signature: signature,
      user_data: user_data,
    }),
  });
  response.then((res) => {
    if (res.status == "success") {
      //refresh page
      window.location.reload();
    } else {
      alert("אירעה שגיאה בחתימה");
    }
  });
  response.finaly(() => {
    submiting = false;
  });
}

async function get_main_as_canvas() {
  return await html2canvas(document.querySelector("#main"), {
    allowTaint: false,
    useCORS: true,
  });
}

async function download_as_pdf() {
  let cnv = await get_main_as_canvas();
  let imgData = cnv.toDataURL("image/png");
  var imgWidth = 210;
  var pageHeight = 295;
  var imgHeight = (cnv.height * imgWidth) / cnv.width;
  var heightLeft = imgHeight;
  var doc = new jsPDF("p", "mm");
  var position = 0;

  doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  debugger;
  doc.save("signature.pdf");
}
async function download_as_image() {
  let cnv = await get_main_as_canvas();
  // download cnv as pdf
  let img = cnv.toDataURL("image/png");
  let link = document.createElement("a");
  link.download = "signature.png";
  link.href = img;
  link.click();
}
let copy_link_button_text = "העתק קישור";
function copy_link() {
  // copy window.location.href to clipboard
  navigator.clipboard.writeText(window.location.href);
  copy_link_button_text = "קישור הועתק";
  setTimeout(() => {
    copy_link_button_text = "העתק קישור";
  }, 2000);
}

const price_format = (num, decimals) =>
  num.toLocaleString("he-IL", {
    //  minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
let show_image_popup = false;
let show_image_popup_url = "";

function open_popup_image(url) {
  show_image_popup = true;
  show_image_popup_url = url;
}
</script>

<div
  class="show_image_popup_backdrop"
  on:click={() => {
    show_image_popup = false;
  }}
  class:active={show_image_popup}
>
  {#if show_image_popup}
    <div
      id="show_image_popup"
      class:active={show_image_popup}
      on:click={(e) => {
        e.stopPropagation();
      }}
      in:scale={{ x: 0, y: 0 }}
    >
      <div
        class="close-btn-area"
        on:click={() => {
          show_image_popup = false;
        }}
      >
        <button id="close-btn">X</button>
        <!--     close btn -->
      </div>

      <div id="image-show-area">
        <img id="large-image" src={show_image_popup_url} alt="" />
        <!--     popup imge -->
        <h4
          class="new-windows-link"
          on:click={() => {
            window.open(show_image_popup_url, "_blank");
          }}
        >
          פתח את התמונה בחלון חדש
          <img
            src="https://res.cloudinary.com/ms-global/image/upload/v1667127471/msAssets/resize_p95nlc.png"
            alt=""
            width="32px"
            height="32px"
          />
        </h4>
      </div>
    </div>
  {/if}
</div>
<main id="main">
  <h5><b>הזמנת עבודה לחתימת </b><u>{data.client_name}</u></h5>
  <h4><span>{uuid}</span></h4>
  <table class="table products">
    <thead>
      <tr>
        <!-- name,description,cimage,price,show_details -->
        <th> תמונה </th>
        <th> שם </th>
        <th> תיאור </th>
        <th> פירוט </th>
        <th>
          ₪ ליח'
          <br />
          לפי מע"מ
        </th>
        <th>
          כמות
          <br />
          כוללת
        </th>
        <th>
          סה"כ לפני
          <br />
          מע"מ
        </th>
      </tr>
    </thead>
    <tbody>
      {#each data.items as product}
        {@const total_amount = product.details.reduce(
          (acc, detail) => acc + detail.quantity,
          0
        )}
        <tr>
          <td>
            <div class="image" on:click={open_popup_image(product.cimage)}>
              <img
                src={product.cimage}
                alt={product.name}
                class="img-fluid"
                width="150px"
              />
            </div>
          </td>
          <td class="product-name-td">{product.name}</td>
          <td class="big-td description-td">
            <div
              class="description-wraper"
              class:active={product?.show_full_description}
            >
              {#if product.clientWidth_description_width >= DESCRIPTION_SIZE_WIDTH || product.clientHeight_description_height >= DESCRIPTION_SIZE_HEIGHT}
                <button
                  class="load-more-btn"
                  class:active={product.show_full_description}
                  on:click={() => {
                    product.show_full_description =
                      !product.show_full_description;
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/ms-global/image/upload/v1667124674/msAssets/icons8-down-16_iugalf.png"
                    alt="more"
                  />
                </button>
              {/if}

              <div
                class="markdown-wraper"
                bind:clientHeight={product.clientHeight_description_height}
                bind:clientWidth={product.clientWidth_description_width}
              >
                <SvelteMarkdown source={product.description} />
              </div>
            </div>
          </td>

          <td class="items-td">
            <div class="wraper">
              <ProductEntriesTable {product} {total_amount} />
            </div>
          </td>
          <td>
            {price_format(product.price)}₪
          </td>
          <td>
            {total_amount}
          </td>
          <td>
            {price_format(product.price * total_amount)}₪
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      {#if data && data.items.length > 0}
        {@const total_price_before_tax = data.items.reduce(
          (acc, product) =>
            acc +
            product.details.reduce((acc, detail) => acc + detail.quantity, 0) *
              product.price,
          0
        )}
        <tr class="total-tr">
          <td colspan="6">סה"כ לפני מע"מ</td>
          <td>{price_format(total_price_before_tax)}₪</td>
        </tr>
        <tr class="total-tr">
          <td colspan="6">סה"כ לאחר מע"מ</td>
          <td>{price_format(total_price_before_tax * 1.17)}₪</td>
        </tr>
      {/if}
      {#if data.simulations && data.simulations.length > 0}
        <tr>
          <td colspan="7">
            <h3 class="simulations-title">הדמיות</h3>
          </td>
        </tr>
      {/if}
      {#each data.simulations as sim (sim.id)}
        <tr>
          <!-- "id": 4,
"description": "",
"cimage": "http://res.cloudinary.com/ms-global/image/upload/v1666775758/simulations/m5zwvaubymqorandccqu.png"
 -->
          <td colspan="3">
            <div class="image">
              <img
                on:click={open_popup_image(sim.cimage)}
                src={sim.cimage}
                alt={sim.description}
                class="img-fluid"
                width="350px"
              />
            </div>
          </td>
          <td colspan="3"> {sim.description}</td>
        </tr>
      {/each}
      <tr>
        <!-- full name, phone and id as required field -->
        <td colspan="7">
          <h3>פרטי הלקוח</h3>
        </td>
      </tr>
      <tr class="flex-center-tr">
        <td />
        <td colspan="5">
          <div class="wraper">
            <div class="item">
              <b>*שם מלא:</b>

              <input
                disabled={data.status == "Signed"}
                type="text"
                name="full_name"
                value={data.user_info_fullname || ""}
                required
                id="full_name_input"
                class="form-control"
              />
            </div>
            <div class="item">
              <b>*טלפון:</b>
              <input
                disabled={data.status == "Signed"}
                type="text"
                name="phone"
                value={data.user_info_phone || ""}
                required
                id="phone_input"
              />
            </div>
            <div class="item">
              <b>*מספר זהות:</b>
              <input
                disabled={data.status == "Signed"}
                type="text"
                name="id"
                value={data.user_info_id || ""}
                required
                id="id_input"
              />
            </div>
          </div>
        </td>
        <td />
      </tr>

      <!-- <p>
            <b>שם מלא:</b>
            
          </p>
          <p>
            <b>טלפון:</b>
            <input type="text" name="phone" bind:value={user_data.phone} />
          </p>
          <p>
            <b>תעודת זהות:</b>
            <input type="text" name="id" bind:value={user_data.id} />
          </p>
        </td></tr
      > -->
      <tr>
        <td colspan="7" class="ftoot-cell">
          <div class="canvas-wraper">
            <div class="inner-wraper">
              <div class="header">
                <div class="spacer" />
                <div class="title">חתימה:</div>
                <div class="actions">
                  {#if canvas}
                    <button
                      class="btn btn-danger"
                      on:click={() => {
                        signaturePad.clear();
                      }}
                    >
                      נקה
                    </button>
                  {/if}
                </div>
              </div>
              {#if data.status == "Signed"}
                <div class="signature">
                  <img src={data.signature} alt="signature" />
                </div>
              {:else}
                <canvas
                  id="signature-pad"
                  class="signature-pad"
                  width="550"
                  height="200"
                  bind:this={canvas}
                />
              {/if}
              <div class="actions-2">
                {#if data.status == "Published" || data.status == "Draft"}
                  <button
                    class="submit-btn"
                    on:click={submit_btn_clicked}
                    disabled={submiting}
                  >
                    {#if submiting == false}
                      שלח
                    {:else}
                      <Spinner />
                    {/if}
                  </button>
                {:else}
                  <!-- buttons: download as pdf, download as image,copy link-->
                  <button
                    class="btn btn-primary"
                    on:click={() => {
                      download_as_pdf();
                    }}
                  >
                    הורד כ PDF
                  </button>
                  <button
                    class="btn btn-primary"
                    on:click={() => {
                      download_as_image();
                    }}
                  >
                    הורד כ תמונה
                  </button>
                  <button
                    class="btn btn-primary"
                    on:click={() => {
                      copy_link();
                    }}
                  >
                    {copy_link_button_text}
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</main>

<style lang="scss">
.show_image_popup_backdrop {
  width: 100vw;
  height: 100vh;
  display: none;
  position: fixed;
  top: 0;
  background: rgb(158, 157, 157, 0.534);
  z-index: 1001; /*  adobe all elements   */
  &.active {
    display: block;
  }
  #show_image_popup {
    position: absolute; /*  so that not take place   */
    top: 50%;
    left: 50%;
    z-index: 1000; /*  adobe all elements   */
    transform: translate(-50%, -50%); /*  make center   */

    display: none; /*  to hide first time   */
    &.active {
      display: block;
    }
    .close-btn-area {
      #close-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1000;
        background-color: #fff;
        border: 1px solid #000;
        height: 35px;
        width: 35px;
        border-radius: 9999px;
        cursor: pointer;
        &:hover {
          background-color: #000;
          color: #fff;
          font-size: 20px;
        }
      }
    }
    #image-show-area {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
      position: relative;

      #large-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .new-windows-link {
        text-align: center;
        background: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 5px #000;
        cursor: pointer;
      }
    }
  }
}
// #show_image_popup img {
//   max-width: 90%;
//   height: auto;
// }
.flex-center-tr {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // width: 100%;
  // flex-grow: 1;
  // flex-shrink: 0;
  // margin: auto;
  td {
    .wraper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      // width: 100%;
      // text-align: center;

      // #full_name_input.is-invalid {
      //   border: 1px solid #dc3545 !important;
      // }
    }
  }
}
main {
  // a4
  background-color: #fff;
  padding-right: 1rem;
  max-width: 100vw;
  overflow: scroll;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //max: a4
  max-width: 21cm;
  border: 1px solid red;

  margin-bottom: 150px;

  margin: auto;
  // padding: 1rem;
  h5 {
    font-size: 1.5rem;
    text-align: center;
    span {
      font-size: 1.2rem;
      color: #666;
    }
  }
  h4 {
    font-size: 1.2rem;
    text-align: center;
    span {
      font-size: 1rem;
      color: #666;
    }
  }

  table.products {
    background-color: #d8d5d5;
    // box-shadow: 0 0 5px #000;
    width: 100%;
    // overflow: hidden;
    // border: 5px solid blue;
    border-collapse: collapse;
    border-spacing: 0;
    // border: 1px solid red;
    margin: 1rem 0;
    thead {
      background: #eee;
      tr {
        th {
          // padding: 0.5rem;
          border: 1px solid #ddd;
          text-align: center;
          white-space: nowrap;
        }
      }
    }
    tbody {
      tr {
        td {
          // padding: 0.5rem;
          border: 1px solid #ddd;
          border-bottom: 1px solid black;
          // .inline-block {
          //   min-width: max-content;
          //   white-space: nowrap;
          // }
          // &.big-td {
          //   min-width: 250px;
          // }
          &.description-td {
            // min-width: 250px;
            max-width: 217px;
            position: relative;
            .description-wraper {
              overflow-x: hidden;
              position: relative;
              max-height: 95px;
              height: 100%;
              white-space: nowrap;
              overflow-y: hidden;
              margin: auto;
              padding: 0px;
              padding-bottom: 25px;
              transition: all 0.15s ease-in-out;
              :global(ul) {
                // margin-block-start: 0.2em;
                // margin-block-end: 0.2em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                padding-inline-start: 20px;
              }
              :global(li) {
              }
              // @media screen and (max-width: 768px) {
              //   max-width: 150px;
              // }
              &.active {
                max-height: 750px;
                max-width: none;
                position: absolute;
                top: 0px;
                height: auto;
                z-index: 1000;
                background: rgb(216, 213, 213);

                padding: 10px;
                margin-bottom: 50px;
                .markdown-wraper {
                  max-height: 750px;
                }
              }
              .markdown-wraper {
                // max-height: 95px;
                width: fit-content;
                height: 100%;
              }
              .load-more-btn {
                position: absolute;

                bottom: 0px;
                left: 0;
                width: 100%;

                background: linear-gradient(
                  0deg,
                  rgba(100, 100, 100, 0.603) 0%,
                  #ccc 100%
                );
                z-index: 1;
                border: none;
                &:hover {
                  background: linear-gradient(
                    0deg,
                    rgba(100, 100, 100, 0.2) 0%,
                    rgba(204, 204, 204, 0.692) 100%
                  );
                }
                &.active {
                  img {
                    transform: rotate(180deg);
                  }
                }
              }
            }
          }
          .image {
            background: radial-gradient(
              circle,
              white 0%,
              white 32%,
              #c7c7c7 84%
            );
            width: 85px;
            padding: 0.3rem;
          }

          &.items-td {
            width: fit-content;
            padding: 0px;
            margin: 0px;
            .wraper {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: auto;
              width: min-content;
            }
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
        }

        &.total-tr {
          td {
            background: rgb(116, 115, 115);
            padding: 0.5rem;
            border: 1px solid #eee;
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }
    tfoot {
      .simulations-title {
        text-align: center;
        font-size: 1.2rem;
        padding: 0.5rem;
        border: 1px solid #ddd;
        // border: 1px solid red;
      }
      tr {
        td.ftoot-cell {
          .canvas-wraper {
            display: flex;
            justify-content: center;
            .inner-wraper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                margin-top: 0.5rem;
                .title {
                  font-size: 1.2rem;
                  text-align: center;
                  span {
                    font-size: 1rem;
                    color: #666;
                  }
                }
              }
              .actions-2 {
                margin: auto;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;

                .submit-btn {
                  background-color: #4caf50; /* Green */
                  border: none;
                  color: white;
                  padding: 0.5rem 1rem;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  cursor: pointer;
                  transition: all 0.3s ease-in-out;
                  &:hover {
                    background-color: #3e8e41;
                    // box-shadow: 0 0 5px #000;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 900px) {
  * {
    // outline: 1px solid red;
  }
  main {
    table.products {
      & thead {
        display: none;
      }
      & td {
        display: flex;
        // border: none;
      }

      & td::before {
        content: attr(label);
        font-weight: bold;
        width: 120px;
        min-width: 120px;
      }

      tbody {
        & td:nth-of-type(1):before,
        & td:nth-of-type(2):before,
        & td:nth-of-type(3):before,
        & td:nth-of-type(4):before {
          display: none;
        }
        & td:nth-of-type(1):before {
          content: "תמונה";
        }
        & td:nth-of-type(2):before {
          content: "שם";
        }
        & td:nth-of-type(3):before {
          content: "תיאור";
        }
        & td:nth-of-type(4):before {
          content: "פירוט";
        }
        & td:nth-of-type(5):before {
          font-weight: normal;
          margin-left: 25px;
          content: "מחיר ליח' לפי מע\"מ: ";
        }
        & td:nth-of-type(6):before {
          font-weight: normal;
          margin-left: 25px;
          content: "כמות כוללת: ";
        }
        & td:nth-of-type(7):before {
          font-weight: normal;
          margin-left: 25px;
          content: 'סה"כ ללא מע"מ: ';
        }

        & td:nth-of-type(5),
        & td:nth-of-type(6),
        & td:nth-of-type(7) {
          border-top: 1px solid rgb(146, 146, 146);
          text-align: center;
          font-weight: bold;
          // border: 1px solid red;
        }
        tr {
          background: #f5f5f5;
          display: inline-block;
          margin: 0 0 2rem 0;
          width: 100%;
          td {
            white-space: normal;
            font-size: smaller;
            border: none;
            // &.product-name-td {
            //   // max-width: 75px;
            //   // max-width: min-content;
            //   // white-space: normal;
            //   max-width: 75px;
            //   height: 75px;
            //   // border: 1px solid red;
            // }
            &.product-name-td {
              font-weight: bold;
              font-size: large;
            }
            &.description-td {
              // font-size: x-small;
              display: flex;
              max-width: 100%;

              .description-wraper {
                flex: 1;
                flex-grow: 1;
                max-width: 100%;
                padding-bottom: 0px;
                // max-width: 100%;
                // overflow-x: auto;
                width: 100%;
                // width: fit-content;
                max-height: none;
                overflow-x: scroll;
                // height: 100%;
                .load-more-btn {
                  display: none;
                }
                .markdown-wraper {
                  width: 100%;
                  // max-height: 75px;
                  max-height: 100%;
                  min-width: none;
                  overflow-x: scroll;
                  overflow-y: hidden;
                  word-break: break-word;
                  white-space: break-spaces;
                  margin-bottom: 0px;
                }

                &.active {
                  background: #f5f5f5;
                }
              }
            }
          }
        }
      }
      tfoot {
        display: none;
      }
    }
  }
}
</style>
