document.addEventListener("DOMContentLoaded", function () {
  /*
    const iframe = document.createElement('iframe');
    document.documentElement.appendChild(iframe);
    iframe.contentDocument.body.innerHTML = `
    <div id="modal">TEST TEdsdfST TESTddd</div>
    `;*/
  const div = document.createElement("div");
  div.innerHTML = `
<div id="modal"><strong style="font-weight: 800;"></strong><img src="https://www.privacytechlab.org/static/images/plt_logo.png"></div>
`;
  document.body.appendChild(div);
});
