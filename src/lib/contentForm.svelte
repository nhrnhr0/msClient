<script>
import { successModalStore, userInfoStore } from './../stores/stores';

import { get_csrf_token, get_user_uuid, submit_contact_form } from './../api/api';

    import {BASE_URL, CONTACT_FORM_URL} from './../api/consts';
import { flashy_create_contact } from './flashy';
    let form_name, form_phone,form_email, form_message;
    let mform;
    function contact_submit() {
      
      if(mform.reportValidity()) {
        let data = {
          name: form_name || '',
          email: form_email || '',
          phone:form_phone || '',
          message: form_message || '',
          uuid: get_user_uuid() || ''
        };
        
        flashy_create_contact(data.name, data.email, data.phone)
        if($userInfoStore.isLogin) {
          data.name = $userInfoStore.me['businessName']
          data.email = $userInfoStore.me['email']
          data.phone = '0000000000'
        }
        let response = submit_contact_form(data);
        response.then((json_response)=> {
            if(json_response['status'] == 'success') {
              mform.reset();
              $successModalStore.toggleModal();
            }
          });
      }
    }
    
</script>

<div class="contact-form-wraper2">
    <div class="contact-form-wraper">
        <form bind:this={mform} id="catalog-contact-form" method="post" action="{BASE_URL}/contact-form" class="contact-form">
            
            
            {#if $userInfoStore}
              {#if !$userInfoStore.isLogin}
              <h2 class="form-header">
                לקבלת הצעה משתלמת
                <div class="mark-strong">&nbsp;ללא&nbsp;</div>
                עלות
                <div class="mark-strong">&nbsp;וללא&nbsp;</div>
                התחייבות השאירו פרטים ומיד נחזור אליכם
            </h2>
                <div class="row-spliter">
                <div class="form-group">
                    <input bind:value={form_name} class="form-control" id="id_name" name="name" placeholder="שם - חובה" required="true" title="" type="text">
                </div>
                <div class="form-group">
                    <input bind:value={form_phone} class="form-control" id="id_phone" name="phone" placeholder="פאלפון - חובה" required="true" title="" type="text">
                </div>
                <div class="form-group">
                  <input bind:value={form_email} class="form-control" id="id_email" name="email" placeholder="אימייל" title="" type="text">
                </div>
              </div>
              <div class="row-spliter">
                <div class="form-group message">
                    <textarea bind:value={form_message} class="form-control" cols="40" id="id_message" name="message" placeholder="הודעה" rows="2" title=""></textarea>
                </div>
              </div>
              <div class="row-spliter">
                <div class="form-group btn">
                <button type="submit" on:click|preventDefault={contact_submit} class="btn btn-success form-submit">לשליחת טופס לחץ כאן</button>
                </div>
              </div>
              {:else}
              <h2 class="form-header">
                לכל שאלה או בקשה אנחנו פה לספק לכם תשובות באופן
                <div class="mark-strong">מיידי</div>
                <div class="mark-under">
                  לא להסס לשאול
                </div>
            </h2>
                <div class="form-group">
                  <textarea bind:value={form_message} class="form-control" cols="40" id="id_message" name="message" placeholder="הודעה" rows="7" title=""></textarea>
                </div>
                <div class="form-group">
                  <button type="submit" on:click|preventDefault={contact_submit} class="btn btn-success form-submit">לשליחת טופס לחץ כאן</button>
                </div>
              {/if}
            {/if}

        </form>
    </div>
</div>

<style lang="scss">

.mark-under {
  text-decoration: underline;
  display: inline-block;
}
.contact-form-wraper2 {
  @include bg-gradient();
  //background-color: #FFD880;
  //background-image: var(--clr-primery-bg);
  //background-color: black;
  padding-top: 5px;

  //background-color: #5c6369;
  .contact-form-wraper {
    //background-color: #F0D57A;
    border-radius: 30px;
    //padding-top: 100px;

    .contact-form {
      margin: auto 80px;

      @media screen and (max-width: 490px) {
        margin: auto 10px;
      }

      .form-header {
        color: black;
        //background-color: #ffca43;
        border-radius: 20px;
        padding-right: 10px;
        //margin-bottom: 80px;
        text-align: center;
        width: 100%;
        //overflow: hidden;
        word-break: break-word;
        .mark-strong {
          display: inline;
          font-weight: 700;
        }
      }

      ::placeholder {
        color: black;
      }
      .form-group  {
        padding-bottom: 20px;
      }
      .form-control {
        border-radius: 1rem;
        background-color: rgb(255, 255, 255);
        margin-bottom: 1px;
        width: 100%;
        padding-top: 7px;
        padding-bottom: 7px;
        
        
      }

      .form-submit {
        display: block;
        margin: 0 auto;
      }

      .row-spliter {
        display: flex;
        justify-content: space-around;
        
        .form-group {
          width:100%;
          padding:5px;
          &.message {
            flex:3;
            padding:0px;
          }
          &.btn {
            flex:1;
            width:100%;
            align-self: center;
            button {
              width:100%;
              transition: all 0.2s ease-in-out;
              &:hover {
                box-shadow: 0px 10px 7px rgba(0, 0, 0, 0.7);
              transform: translateY(-3px);
              }
            }
          }
        }
      }
    }
  }
}

</style>