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

export let uuid;
export let data;
let submiting = false;
let canvas;
let signaturePad;
let is_signing = false;
onMount(() => {
  if (canvas) {
    signaturePad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
    });
  }
});

function submit_btn_clicked(e) {
  e.preventDefault();
  if (signaturePad.isEmpty()) {
    alert("נא לחתום על המסמך");
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
</script>

<main id="main">
  <h5><b>לחתימת </b>{data.client_name}</h5>
  <h4><span>{uuid}</span></h4>
  <table class="table products">
    <thead>
      <tr>
        <!-- name,description,cimage,price,show_details -->
        <th> תמונה </th>
        <th> שם </th>
        <th> תיאור </th>
        <th> פירוט </th>
        <th> מחיר ליח</th>
        <th> כמות </th>
        <th> סה"כ </th>
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
            <div class="image">
              <img
                src={product.cimage}
                alt={product.name}
                class="img-fluid"
                width="150px"
              />
            </div>
          </td>
          <td>{product.name}</td>
          <td class="big-td"><SvelteMarkdown source={product.description} /></td
          >

          <td>
            {#if product.show_details}
              <!-- @const size_codes_dict = {size_code1: size_name1,} -->
              {@const size_codes_dict = product.details.reduce(
                (acc, detail) => {
                  acc[detail.size_code] = detail.size_name;
                  return acc;
                },
                {}
              )}
              {@const orderd_codes = Object.keys(size_codes_dict)
                .sort()
                .reverse()}
              {@const colors_set = Array.from(
                new Set(product.details.map((detail) => detail.color_name))
              )}
              {@const varient_set = Array.from(
                new Set(product.details.map((detail) => detail.varient_name))
              )}
              <!-- clr_ver_crtz = [{clr1, ver1}, {clr1, ver2}] -->
              {@const clr_ver_crtz = colors_set.reduce((acc, color) => {
                varient_set.forEach((varient) => {
                  acc.push({ color, varient });
                });
                return acc;
              }, [])}
              {@const use_varient =
                varient_set.length > 1 && varient_set[0] !== ""}
              <table class="table items">
                <thead>
                  <tr>
                    <th> צבע </th>
                    {#if use_varient}
                      <th> מודל </th>
                    {/if}

                    {#each orderd_codes as code}
                      <th>
                        {size_codes_dict[code]}
                      </th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each clr_ver_crtz as row}
                    <tr>
                      <td>{row.color}</td>
                      {#if use_varient}
                        <td>{row.varient}</td>
                      {/if}
                      {#each orderd_codes as code}
                        <td>
                          {#each product.details as detail}
                            {#if detail.size_code == code && detail.color_name == row.color && detail.varient_name == row.varient}
                              {detail.quantity}
                            {/if}
                          {/each}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>

              <!-- pivot table of  
                cols: size_name (order by size_code)
                rows: color_name, varient_name
                cells: quantity
             -->
            {/if}
          </td>
          <td>
            {product.price}₪
          </td>
          <td>
            {total_amount}
          </td>
          <td>
            {product.price * total_amount}₪
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
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

<!-- 
                                                        example data:
                                                        {
                                                    "uuid": "af3e45b6-c5e5-4f09-890f-c8faa1509954",
                                                    "client_name": "באן תאי מ.נ. מרקט בע\"מ321",
                                                    "status": "Published",
                                                    "items": [
                                                        {
                                                        "id": 66,
                                                        "name": "תיק צד עור לגבר2",
                                                        "description": "",
                                                        "cimage": "http://res.cloudinary.com/ms-global/image/upload/v1665515881/site/signiture-pics/%D7%AA%D7%99%D7%A7_%D7%A6%D7%93_%D7%A2%D7%95%D7%A8_%D7%9C%D7%92%D7%91%D7%A866.png",
                                                        "price": "1444.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 95,
                                                            "quantity": 33,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 67,
                                                        "name": "תיק צד צבאי הסוואה לחגורה2",
                                                        "description": "",
                                                        "cimage": "http://res.cloudinary.com/ms-global/image/upload/v1665964710/site/signiture-pics/%D7%AA%D7%99%D7%A7_%D7%A6%D7%93_%D7%A6%D7%91%D7%90%D7%99_%D7%94%D7%A1%D7%95%D7%95%D7%90%D7%94_%D7%9C%D7%97%D7%92%D7%95%D7%A8%D7%9467.png",
                                                        "price": "323.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 96,
                                                            "quantity": 36,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 65,
                                                        "name": "תיק צד דמוי עור31",
                                                        "description": "* תיק צד אלגנטי בעל רצועה לתליה\r\n* עמיד לאורך זמן",
                                                        "cimage": "http://res.cloudinary.com/ms-global/image/upload/v1665515746/site/signiture-pics/%D7%AA%D7%99%D7%A7_%D7%A6%D7%93_%D7%93%D7%9E%D7%95%D7%99_%D7%A2%D7%95%D7%A865.png",
                                                        "price": "21.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 94,
                                                            "quantity": 17,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 47,
                                                        "name": "גרבי קרסול",
                                                        "description": "* גרביים גובה קרסול",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672481/site/products/%D7%92%D7%A8%D7%91_%D7%A7%D7%A8%D7%A1%D7%95%D7%9C-removebg-preview_KcsWP1B_P5WbcGt_Ltmu5kq.png",
                                                        "price": "3.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 62,
                                                            "quantity": 24,
                                                            "color_id": 77,
                                                            "color_name": "שחור",
                                                            "size_id": 118,
                                                            "size_code": "0",
                                                            "size_name": "43-47",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 43,
                                                        "name": "ארנק עור חלק לגבר",
                                                        "description": "* ארנקים גבר עור עם קופסה הרבה דוגמאות",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672427/site/products/%D7%90%D7%A8%D7%A0%D7%A7%D7%99%D7%9D_%D7%92%D7%91%D7%A8_%D7%A2%D7%95%D7%A8_%D7%9C%D7%95%D7%A0%D7%93%D7%95%D7%9F_%D7%A2%D7%9D_%D7%A7%D7%95%D7%A4%D7%A1%D7%94_%D7%94%D7%A8%D7%91%D7%94_%D7%93%D7%95%D7%92%D7%9E%D7%90%D7%95%D7%AA-removebg-preview_1hA7AuZ_yJJfjLt.png",
                                                        "price": "21.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 58,
                                                            "quantity": 10,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 42,
                                                        "name": "ארנק דמוי עור",
                                                        "description": "* ארנק דמוי עור במגוון דוגמאות",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1646125929/site/products/11264001744905122557152SW13890148971394542393140855596414878677161488950102-removebg-preview",
                                                        "price": "14.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 57,
                                                            "quantity": 10,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 45,
                                                        "name": "גליל דבק שקוף 150 מ'",
                                                        "description": "* גליל דבק שקוף 150 מ'",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672422/site/products/%D7%93%D7%91%D7%A7_%D7%A2%D7%91%D7%95%D7%93%D7%94_%D7%9E%D7%9C%D7%97%D7%9E%D7%94_150_%D7%9E%D7%98%D7%A8-removebg-preview_kWQpl64_zmaWaaI.png",
                                                        "price": "9.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 60,
                                                            "quantity": 124,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 46,
                                                        "name": "גרבי ספורט312",
                                                        "description": "* גרבי כותנה גבוהות\r\n* עבות ואיכותיות",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672331/site/products/%D7%92%D7%A8%D7%91%D7%99_%D7%A1%D7%A4%D7%95%D7%A8%D7%98_uBLcEGO_F2qhVi2_bSu2lWG_YL4VqpL_bwqc2vL_o2BI4nt.png",
                                                        "price": "3.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 61,
                                                            "quantity": 25,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 44,
                                                        "name": "ארנק צד בד לחגורה",
                                                        "description": "* ארנק צד לחגורה לגבר לפלאפון מגוון דוגמאות רחב",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672433/site/products/%D7%90%D7%A8%D7%A0%D7%A7_%D7%A6%D7%93_%D7%9C%D7%97%D7%92%D7%95%D7%A8%D7%94_%D7%9C%D7%A4%D7%9C%D7%90%D7%A4%D7%95%D7%9F_%D7%9B%D7%9C_%D7%94%D7%92%D7%93%D7%9C%D7%99%D7%9D-removebg-preview_7f09WYr_nUsewgf.png",
                                                        "price": "11.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 59,
                                                            "quantity": 12,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 41,
                                                        "name": "אוזניית בלוטוס ש22לט קפי2222צית - RETRACTABLE",
                                                        "description": "* עד 7 שעות שיחה והאזנה למוסיקה, 4.1 BLUETOOTH.\r\n*  חיבור 2 מכשירי טלפון בו זמנית, מפחית את רמת הקרינה.\r\n* עד 10 מטרים טווח פעולה.\r\n* עד 270 שעות זמן המתנה.\r\n* בערכה: כבל טעינה Micro USB, למכשירי אפל – חווי טעינה על צג הסמארטפון, קליפס לתלייה על דש החולצה.",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672398/site/products/%D7%90%D7%95%D7%96%D7%A0%D7%99%D7%AA_%D7%A9%D7%9C%D7%98_%D7%A7%D7%A4%D7%99%D7%A6%D7%99%D7%AA_-_RETRACTABLE-removebg-preview_Gu4wwDw_Irp1D1a_By59SKw.png",
                                                        "price": "60.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 56,
                                                            "quantity": 31,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 48,
                                                        "name": "חולצת דרייפיט שרוול ארוך",
                                                        "description": "* 100% פוליאסטר\r\n* מנדפת זיעה\r\n* מתאימה לאנשי שטח שנמצאים הרבה שעות בשמש\r\n* מגוון צבעים\r\n* אפשרות לרקמה או הדפסה",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672283/site/products/%D7%93%D7%A8%D7%99%D7%99%D7%A4%D7%98_%D7%90%D7%A8%D7%95%D7%9A_T3m7U0G_UuHvFWr.png",
                                                        "price": "19.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 63,
                                                            "quantity": 10,
                                                            "color_id": 80,
                                                            "color_name": "כחול כהה",
                                                            "size_id": 87,
                                                            "size_code": "bb",
                                                            "size_name": "S",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 64,
                                                            "quantity": 10,
                                                            "color_id": 80,
                                                            "color_name": "כחול כהה",
                                                            "size_id": 88,
                                                            "size_code": "bc",
                                                            "size_name": "M",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 65,
                                                            "quantity": 10,
                                                            "color_id": 80,
                                                            "color_name": "כחול כהה",
                                                            "size_id": 89,
                                                            "size_code": "bd",
                                                            "size_name": "L",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 49,
                                                        "name": "חולצת דרייפיט שרוול קצר",
                                                        "description": "* 100% פוליאסטר\r\n* מנדפת זיעה\r\n* מתאימה לעובדי שטח\r\n* מגוון רחב של צבעים\r\n* אפשרות לרקמה או הדפסה",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672282/site/products/%D7%93%D7%A8%D7%99%D7%99%D7%A4%D7%98_%D7%A7%D7%A6%D7%A8_ZlLUyjq_f2dRfRl_4xE9yEo_XHoSumJ.png",
                                                        "price": "12.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 67,
                                                            "quantity": 10,
                                                            "color_id": 97,
                                                            "color_name": "מעורבב כהה",
                                                            "size_id": 89,
                                                            "size_code": "bd",
                                                            "size_name": "L",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 66,
                                                            "quantity": 10,
                                                            "color_id": 97,
                                                            "color_name": "מעורבב כהה",
                                                            "size_id": 88,
                                                            "size_code": "bc",
                                                            "size_name": "M",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 50,
                                                        "name": "חולצת טריקו 160 גרם שרוול קצר",
                                                        "description": "* חולצת טריקו איכותית\r\n* 100% כותנה\r\n* 160 גרם\r\n* מגוון רחב של צבעים\r\n* אופציה לכיס\r\n* אפשרות לרקמה או הדפסה",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672333/site/products/%D7%98%D7%A8%D7%99%D7%A7%D7%95_%D7%A9_m8O8yFW_3hEXpcc_5RjP1BK_CmqCLCa.png",
                                                        "price": "13.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 68,
                                                            "quantity": 10,
                                                            "color_id": 97,
                                                            "color_name": "מעורבב כהה",
                                                            "size_id": 88,
                                                            "size_code": "bc",
                                                            "size_name": "M",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 69,
                                                            "quantity": 10,
                                                            "color_id": 97,
                                                            "color_name": "מעורבב כהה",
                                                            "size_id": 89,
                                                            "size_code": "bd",
                                                            "size_name": "L",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 51,
                                                        "name": "חולצת טריקו שרוול ארוך",
                                                        "description": "* 100% כותנה\r\n* 180 גרם\r\n* חולצה איכותית ונוחה\r\n* מגוון צבעים רחב\r\n* אפשרות לרקמה או הדפסה",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672281/site/products/%D7%98%D7%A8%D7%99%D7%A7%D7%95_%D7%90%D7%A8%D7%95%D7%9A_A2tvQPQ_z8mPhV8_CZVpzlB_Q5xfWtH_KlOJTBw_8X4FojN_fN2SwCu_wIdCPue.png",
                                                        "price": "19.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 70,
                                                            "quantity": 15,
                                                            "color_id": 77,
                                                            "color_name": "שחור",
                                                            "size_id": 87,
                                                            "size_code": "bb",
                                                            "size_name": "S",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 71,
                                                            "quantity": 15,
                                                            "color_id": 77,
                                                            "color_name": "שחור",
                                                            "size_id": 88,
                                                            "size_code": "bc",
                                                            "size_name": "M",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            },
                                                            {
                                                            "id": 72,
                                                            "quantity": 10,
                                                            "color_id": 77,
                                                            "color_name": "שחור",
                                                            "size_id": 89,
                                                            "size_code": "bd",
                                                            "size_name": "L",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 52,
                                                        "name": "טייגר בלאם",
                                                        "description": "* משחת טייגר בלאם להקלת כאבי שרירים",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672483/site/products/%D7%98%D7%99%D7%99%D7%92%D7%A8_%D7%91%D7%90%D7%9C%D7%9D-removebg-preview_7gbMRy7.png",
                                                        "price": "8.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 73,
                                                            "quantity": 12,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 53,
                                                        "name": "כובע סהרה",
                                                        "description": "* כובע איכותי ונוח\r\n* מגן על כל חלקי הפנים, העורף, והצוואר\r\n* פתחי אוויר בצידי הראש\r\n* שרוך להקטנה והגדלה\r\n* מתאים במיוחד לעובדים הנמצאים הרבה שעות בשמש\r\n* אפשרות להדפסה או רקמה",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1650884006/site/products/כובע_סהרה-removebg-preview",
                                                        "price": "19.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 74,
                                                            "quantity": 12,
                                                            "color_id": 80,
                                                            "color_name": "כחול כהה",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 54,
                                                        "name": "כובע קש נשים",
                                                        "description": "* כובע קש נשים",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672488/site/products/%D7%9B%D7%95%D7%91%D7%A2_%D7%A7%D7%A9_%D7%A0%D7%A9%D7%99%D7%9D_%D7%A7%D7%A8%D7%90%D7%95%D7%A1-removebg-preview_YVhz68J.png",
                                                        "price": "11.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 75,
                                                            "quantity": 12,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": 6,
                                                            "varient_name": "רחב שוליים"
                                                            },
                                                            {
                                                            "id": 76,
                                                            "quantity": 12,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": 7,
                                                            "varient_name": "צר שוליים"
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 62,
                                                        "name": "סט 3 קופסאות קליפר",
                                                        "description": "* סט 3 קופסאות איכסון באריזה אחת! \r\n* 2 ליטר \r\n* 1.10 ליטר \r\n* 550 מל",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1654525146/site/products/photo_2022-06-06_17-18-04-removebg-preview",
                                                        "price": "19.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 91,
                                                            "quantity": 24,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 59,
                                                        "name": "מספריים לילדים",
                                                        "description": "* מספרי ציפורניים איכותיים לילד",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1650382873/site/products/WhatsApp-Image-2018-05-14-at-13",
                                                        "price": "4.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 88,
                                                            "quantity": 20,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 57,
                                                        "name": "מכונת תספורת מקצועית מפוארת",
                                                        "description": "* מכונת תספורת מקצועית",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1657009227/site/products/WhatsApp_Image_2022-06-15_at_09",
                                                        "price": "65.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 86,
                                                            "quantity": 4,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 60,
                                                        "name": "משאבת רגל לניפוח כדורים ואופניים",
                                                        "description": "* משאבת רגל לניפוח כדורים ואופניים",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1650884450/site/products/משאבת_רגל_לניפוח_כדורים_ואופניים-removebg-preview",
                                                        "price": "18.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 89,
                                                            "quantity": 2,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 63,
                                                        "name": "סט 4 קופסאות אכסון",
                                                        "description": "* סט 4 קופסאות אכסון ארוז קומפקטי ונוח לשימוש",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672610/site/products/%D7%A1%D7%98-4-%D7%A7%D7%95%D7%A4%D7%A1%D7%90%D7%95%D7%AA-%D7%9E%D7%9C%D7%91%D7%9F-%D7%A8%D7%95%D7%99-600x600-removebg-preview_ja4YYFS_MUnpSKJ.png",
                                                        "price": "12.00",
                                                        "show_details": false,
                                                        "details": [
                                                            {
                                                            "id": 92,
                                                            "quantity": 35,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "id": 61,
                                                        "name": "משקפי שמש",
                                                        "description": "* מגוון ענק של משקפי שמש\r\n* עשרות דגמים וסוגים\r\n* 12 יח' במארז",
                                                        "cimage": "https://res.cloudinary.com/ms-global/image/upload/v1635672362/site/products/%D7%9E%D7%A9%D7%A7%D7%A4%D7%99_%D7%A9%D7%9E%D7%A9_%D7%9E%D7%91%D7%97%D7%A8_%D7%A2%D7%A0%D7%A7-removebg-preview_iUsCIRu_DRGaNg9.png",
                                                        "price": "10.00",
                                                        "show_details": true,
                                                        "details": [
                                                            {
                                                            "id": 90,
                                                            "quantity": 60,
                                                            "color_id": 76,
                                                            "color_name": "no color",
                                                            "size_id": 86,
                                                            "size_code": "cc",
                                                            "size_name": "one size",
                                                            "varient_id": "",
                                                            "varient_name": ""
                                                            }
                                                        ]
                                                        },........
 -->
<style lang="scss">
main {
  // a4
  background-color: #fff;
  width: min-content;

  margin: auto;
  padding: 1rem;
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
    box-shadow: 0 0 5px #000;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid red;
    margin: 1rem 0;
    thead {
      background: #eee;
      tr {
        th {
          padding: 0.5rem;
          border: 1px solid #ddd;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-bottom: 1px solid black;
          .inline-block {
            min-width: max-content;
            white-space: nowrap;
          }
          &.big-td {
            min-width: 250px;
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
        }
      }
    }
    tfoot {
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
                    box-shadow: 0 0 5px #000;
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
table.items {
  tbody {
    tr {
      td {
        border-bottom: 1px solid #ddd !important;
        // padding: 0px !important;
      }
    }
  }
}
</style>
