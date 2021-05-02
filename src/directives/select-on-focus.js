import Vue from 'vue'

Vue.directive('select-on-focus', {
  bind(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.addEventListener('focus', selectContents);
    }
    else {
      el.querySelector('input').addEventListener('focus', selectContents)
    }
  },

  unbind(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.removeEventListener('focus', selectContents);
    }
    else {
      el.querySelector('input').removeEventListener('focus', selectContents)
    }
  }
});

const selectContents = e => {
  const start = 0;
  const end = -1;

  if (e.currentTarget.hasAttribute("contenteditable")) {
    selectNodeContents(e.currentTarget, start, end);
  } else {
    e.currentTarget.setSelectionRange(start, end);
  }
};

const selectNodeContents = ($el, start, end) => {
  let textNode = $el.childNodes[0];

  let r = document.createRange();

  r.setStart(textNode, start);

  if (end < 0 || end > textNode.textContent.length) {
    end = textNode.textContent.length;
  }
  r.setEnd(textNode, end);

  let s = window.getSelection();
  s.removeAllRanges();
  s.addRange(r);
};
