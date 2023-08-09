<div class="cta-ation-form bg-color-primary">
  <div class="vip-text">
    <div>כל הלקוחות שלנו הם <span class="mark-strong">V.I.P</span> אבל יש כאלה שמרוויחים <span class="mark-strong">יותר</span>...</div>

    <div>
      <span class="mark-strong"> רוצים להרוויח גם? </span>
    </div>

    <div>הצטרפו למועדון הלקוחות שלנו ותתחילו להרוויח <span class="mark-strong">יותר</span> על כל הזמנה!</div>
  </div>
  <div class="cta">
    <span class="mark-strong">השאירו שם וטלפון בטופס </span>
  </div>

  <form class="cta-form" action="https://forms.ms-global.co.il/submits/ms-global-leads/" method="POST">
    <div class="form-fields">
      <input required type="text" name="שם" id="name" placeholder="שם" />
      <input required type="tel" name="טלפון" id="tel" placeholder="טלפון" />
      <input required={false} type="email" name="אימייל" id="email" placeholder="אימייל" />
      <!--
            <div class="form-group">
                <input class="checkbox" checked type="checkbox" name="מעוניין_בתוכן_שיווקי" id="check2">
                <label class="checkbox-title" for="check2">אני מעוניין לקבל תוכן פרסומי</label>
            </div>
            -->
    </div>
    <button class="sub-btn" type="submit">רוצה הצעה משתלמת!</button>
  </form>
</div>

<style lang="scss">
.mark-strong {
  font-weight: bolder;
}

.mark-bigger {
  font-size: larger;
}

.bg-color-primary {
  //background-color: var(--clr-primary);
  @include bg-gradient();
}

.cta-ation-form {
  --defualt-font: 1.5rem;
  font-size: var(--defualt-font);
  direction: rtl;
  text-align: center;
  width: 90%;
  margin: auto;
  border-radius: 25px;
  //margin-top: 50px;
  margin-bottom: 50px;
  padding-bottom: 25px;
  padding-top: 25px;
  color: var(--text-on-background-color);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
    rgba(0, 0, 0, 0.09) 0px -3px 5px;
  @media screen and (max-width: 768px) {
    .vip-text {
      font-size: 1.2rem;
    }
    .cta {
      font-size: 1.4rem;
      padding-left: 5px;
      padding-right: 5px;
    }
  }

  .cta-form {
    .checkbox-title {
      font-size: 0.5rem;
    }

    .sub-btn {
      color: #fff;
      background-color: #28a745;
      border-color: #28a745;
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      //border: 1px solid transparent;
      border: 1px solid #eee;
      padding: 0.375rem 0.75rem;
      font-size: 2rem;
      margin-top: 20px;
      line-height: 1.5;
      border-radius: 0.25rem;
      margin-bottom: 5px;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      border-radius: 25px;
      &:hover {
        color: #fff;
        background-color: #218838;
        border-color: #1e7e34;
      }

      @media screen and (max-width: 450px) {
        font-size: 1.3rem;
      }
    }

    .form-fields {
      flex-direction: column;
      max-height: max-content;
      align-items: center;
      display: flex;
      flex-direction: row;

      * {
        margin-left: 15px;
        margin-right: 15px;
      }

      input:not([type="checkbox"]) {
        font-size: 1.4rem;
        width: 80%;
        margin-bottom: 5px;
        border-radius: 25px;
        border: 1px solid rgb(124, 124, 124);

        &::placeholder {
          text-align: center;
        }
      }
      @media screen and (max-width: 768px) {
        flex-direction: column;
        * {
          margin-left: 0;
          margin-right: 0;
        }
      }

      .img-wraper {
        max-width: 100%;
        flex: 1;
        margin: 30px;
      }
    }
  }
}
</style>
