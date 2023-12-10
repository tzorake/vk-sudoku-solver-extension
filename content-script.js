const iframe = document.querySelector("#app_51461148_container iframe");
const url = new URL(iframe.src);
const query = url.query;

async function replaceURL() {
  const response = await fetch("http://localhost:6969/set-url?encodedUrl=" + btoa(iframe.src), {
    method: "POST"
  });
  console.info(response)
  if (response.ok) {
    iframe.src = "http://localhost:6969/sudoku" + url.search;
  }
}

replaceURL();