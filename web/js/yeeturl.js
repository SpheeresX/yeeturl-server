"use strict";

const yeeturl = {};

// comment this if self-hosting
yeeturl.sinstance = 'https://yeeturl.github.io';

yeeturl.shorten = async () => {
  const output = document.getElementById('result');
  const url_input = document.getElementById('inputLink').value; // the url the user wants to shorten
  const password = yeeturl.passwords.generate(10); // generate a password

  output.innerText = 'Shortening - yeeturl may be unresponsive for a while...';

  if (!yeeturl.validateURL(url_input))
    return output.innerText = 'It appears that this URL is invalid. Make sure it has been typed correctly.';

  // encrypt the url
  const encrypted = sjcl.encrypt(password, url_input, { iter: 275000 });

  // send it to the server
  const res = await fetch(`${document.location.origin}/api/shorten`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: encrypted
    })
  });

  if (!res.ok) {
    switch (res.status) {
      case 429:
        return output.innerText = 'You are sending too much requests. Please try again later.';
      case 413:
        return output.innerText = 'The link you have provided is too long.';
      default:
        return output.innerText = 'An unknown error has occured.';
    }
  }

  const data = await res.json();
  document.getElementById("result").innerHTML = `Shortened link: <a rel="noopener noreferrer" target="_blank" href=${yeeturl.sinstance || document.location.origin}/#${yeeturl.sanitizeURL(data.link)}/${password}>${document.location.origin}/#${yeeturl.sanitizeURL(data.link)}/${password}</a>`;
}

yeeturl.getShortenedLink = async () => {
  // code[0] is the id for the url we're going to send to the server,
  // and code[1] is the password we're decrypting the url with
  const code = window.location.hash.replace("#", "").split("/");
  const longURLRedirect = document.getElementById('long-url-redirect');

  longURLRedirect.innerHTML = "<p>Please wait - decrypting link...</p>";

  const url = `${document.location.origin}/api/getlink?id=${encodeURIComponent(code[0])}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(res.status);
    switch (res.status) {
      case 404:
        return longURLRedirect.innerHTML = "<p>We couldn't find this link! It may have been removed.</p>"
      case 429:
        return longURLRedirect.innerHTML = "<p>You are sending too many requests. Try again in a few minutes.</p>";
      default:
        return longURLRedirect.innerHTML = "<p>An unknown error has occured while getting this encrypted URL.</p>"
    }
  }
  const data = await res.text();

  var decrypted;
  try {
    decrypted = sjcl.decrypt(code[1], data);
  } catch(e) {
    // if the data is invalid, or the password is incorrect, catch the error.
    console.error(e);
    return longURLRedirect.innerHTML = "<p>An error has occured while decrypting this link. This often happens when the password (short link) is invalid - make sure to check for any typos.</p>";
  }

  if (!yeeturl.validateURL(decrypted))
    return longURLRedirect.innerHTML =
      "<p>The URL you were supposed to get redirected to is invalid and has been blocked to prevent attacks.</p>";

  longURLRedirect.innerHTML = `<p>You are about to get redirected to: </p>
  <p><b><a rel="noopener noreferrer" href="${yeeturl.sanitizeURL(decrypted)}">${yeeturl.sanitizeURL(decrypted)}</a></b></p>
  <p><sub>For security reasons, you have to click on the URL above to get redirected. If it looks suspicious, please do not click on it.</sub></p>`;
};

yeeturl.passwords = {
  _pattern: /[a-zA-Z0-9_\-\+\.]/,

  _getRandomByte: function () {
    // https://caniuse.com/#feat=getrandomvalues
    if (window.crypto && window.crypto.getRandomValues) {
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    } else if (window.msCrypto && window.msCrypto.getRandomValues) {
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    } else {
      alert('Your browser does not support secure ways of generating random values. This might put the security of your links at risk - please update your browser.')
      return Math.floor(Math.random() * 256);
    }
  },

  generate: function (length) {
    return Array.apply(null, {
      length: length
    })
      .map(function () {
        var result;
        while (true) {
          result = String.fromCharCode(this._getRandomByte());
          if (this._pattern.test(result)) {
            return result;
          }
        }
      }, this)
      .join("");
  }
};

yeeturl.sanitizeURL = string => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&grave;"
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, match => map[match]);
};

yeeturl.validateURL = value => {
  const urlSchema = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  return urlSchema.test(value);
};

yeeturl.refreshUI = () => {
  if (window.location.hash.split('/').length === 2) {
    document.getElementById('shorten-page').classList.add('hidden');
    document.getElementById('long-url-redirect').classList.remove('hidden');
    yeeturl.getShortenedLink();
  } else {
    // do the exact opposite
    document.getElementById('shorten-page').classList.remove('hidden');
    document.getElementById('long-url-redirect').classList.add('hidden');
  }
}

/* ============================== */

// enable the shorten button once our js has finished loading
document.getElementById('shorten').removeAttribute('disabled');

document.getElementById('shorten').addEventListener('click', () => {
  event.preventDefault();
  yeeturl.shorten();
});

// hide the "shorten url" page and get the long url if a hash (short link) is provided
yeeturl.refreshUI();

// beta: when the hash changes, just refresh the ui (?) instead of reloading the
//       whole page to not waste the user's internet
window.onhashchange = yeeturl.refreshUI;

// make the logo rainbow on pride month for fun
// yeeturl doesn't care about your opinions,
// feel free to use it no matter who you are or
// what you believe in
if (new Date().getMonth() === 5 && !navigator.userAgent.indexOf("Firefox") != -1) {
  document.getElementById('logo').classList.add('rainbow-text');
}

console.warn(
  "%cStop!",
  "font: 2em sans-serif; color: yellow; background-color: red;"
);
console.warn(
  "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here you don't fully understand, there is a 99.99% chance that you're getting hacked.",
  "font: 1.5em sans-serif; color: grey;"
);