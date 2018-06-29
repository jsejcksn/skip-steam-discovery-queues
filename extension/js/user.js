{
  'use strict';

  const btnItem = 'body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div.next_in_queue_area > div.btn_next_in_queue.btn_next_in_queue_trigger',
        btnQueue = '#refresh_queue_btn',
        urlItemBase = 'https://store.steampowered.com/app/',
        urlQueue = 'https://store.steampowered.com/explore/';

  window.addEventListener('load', init);

  function dialogShow (state) {
    const css = `
      .animated {
        animation-duration: 1s;
        animation-fill-mode: both;
      }

      .skip-dialog {
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #ccc;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        color: #000;
        font-family: sans-serif;
        font-size: 32px;
        font-weight: normal;
        padding: 1em;
        width: 400px;
        position: fixed;
        top: 0;
        left: 50%;
        margin-left: -200px;
        z-index: 999;
      }

      .skip-dialog p {
        box-sizing: border-box;
        margin-top: 0;
      }

      .skip-dialog button {
        box-sizing: border-box;
        border: 0;
        font-family: sans-serif;
        font-size: 32px;
        font-weight: normal;
      }

      .skip-qty {
        box-sizing: border-box;
        background-color: #000;
        border-radius: 25px;
        color: #fff;
        height: 50px;
        line-height: 0;
        margin-top: 32px;
        width: 50px;
      }

      .skip-cancel {
        box-sizing: border-box;
        background-color: inherit;
        color: #000;
        height: 40px;
        margin: 0;
        padding: 0;
        width: 40px;
        position: absolute;
        top: 0;
        right: 0;
      }

      @keyframes slideInDown {
        from {
          transform: translate3d(0, -100%, 0);
          visibility: visible;
        }

        to {
          transform: translate3d(0, 0, 0);
        }
      }

      .slideInDown {
        animation-name: slideInDown;
      }

      @keyframes slideOutUp {
        from {
          transform: translate3d(0, 0, 0);
        }

        to {
          visibility: hidden;
          transform: translate3d(0, -100%, 0);
        }
      }

      .slideOutUp {
        animation-name: slideOutUp;
      }
    `;

    let html;
    if (state === 'begin') {
      html = `
        <div id="skip-dialog" class="animated skip-dialog slideInDown">
          <p>Number of discovery queues to skip:</p>
          <button id="skip-cancel" class="skip-cancel">&times;</button>
          <button class="skip-qty">1</button>
          <button class="skip-qty">2</button>
          <button class="skip-qty">3</button>
        </div>
      `;
    }
    else if (state === 'end') {
      html = `
        <div id="skip-dialog" class="animated skip-dialog slideInDown">
          <p>Discovery queues completed</p>
          <button id="skip-cancel" class="skip-cancel">&times;</button>
        </div>
      `;
    }
    else if (state === 'loading') {
      html = `
        <div id="skip-dialog" class="animated skip-dialog slideInDown">
          <p>Loading next discovery queue</p>
        </div>
      `;
    }

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', html);
    if (state === 'begin') {
      let buttons = document.querySelectorAll('#skip-dialog button');
      for (let i = 1; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
          dialogSubmit('skip', i);
        });
      }
    }
    if (state === 'begin' || state === 'end') {
      document.getElementById('skip-cancel').addEventListener('click', () => {
        dialogSubmit('cancel');
      });
    }
  }

  function dialogSubmit (action, int) {
    if (action === 'skip') {
      sessionStorage.setItem('queueSkip', 'active');
      sessionStorage.setItem('queueQty', int);
      document.getElementById('skip-dialog').classList.replace('slideInDown', 'slideOutUp');
      document.querySelector(btnQueue).click();
    }
    else {
      document.getElementById('skip-dialog').classList.replace('slideInDown', 'slideOutUp');
    }
  }

  function evaluateQueue () {
    sessionStorage.queueQty = Number(sessionStorage.queueQty) - 1;
    if (Number(sessionStorage.queueQty) > 0) {
      dialogShow('loading');
      document.querySelector(btnQueue).click();
    }
    else {
      dialogShow('end');
      sessionStorage.removeItem('queueSkip');
      sessionStorage.removeItem('queueQty');
    }
  }

  function init () {
    if (location.href === urlQueue) {
      if (sessionStorage.queueSkip === 'active') {
        evaluateQueue();
      }
      else {
        dialogShow('begin');
      }
    }
    else if (location.href.slice(0, urlItemBase.length) === urlItemBase && sessionStorage.queueSkip === 'active') {
      document.querySelector(btnItem).click();
    }
  }

}
