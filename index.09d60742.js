(async()=>{const e=window.hasOwnProperty("BeforeInstallPromptEvent");let a,n,t=!1,o=!1,s="./manifest.webmanifest",i=[];const l=navigator.userAgent.includes("iPhone")||navigator.userAgent.includes("iPad")||navigator.userAgent.includes("Macintosh")&&navigator.maxTouchPoints&&navigator.maxTouchPoints>2;window.addEventListener("beforeinstallprompt",(e=>{a=e,o=!0,e.preventDefault()})),document.addEventListener("keyup",(e=>{"Escape"===e.key&&new Promise(((e,a)=>{openmodal=!1,e()}))}));const r=()=>navigator.standalone?navigator.standalone:!!matchMedia("(display-mode: standalone)").matches,c=async()=>{try{const a=await fetch(s),t=await a.json();if(n=t,t)return(e=t).icons&&e.icons[0]?e.name?e.description||console.error("Your web manifest must have a description listed"):console.error("Your web manifest must have a name listed"):console.error("Your web manifest must have atleast one icon listed"),t}catch(e){return null}var e},d=e&&i.length<1&&(o||l);"standalone"in navigator&&!1===navigator.standalone||d&&!1===t?(await(async()=>{try{await c()}catch(e){console.error("Error getting manifest, check that you have a valid web manifest")}"getInstalledRelatedApps"in navigator&&(i=await navigator.getInstalledRelatedApps())})(),console.log("Application is currently ",r()?"installed":"not installed"),console.log(n)):console.log("Application not installable",{showInstaller:d,installed:t},r()?"installed":"not installed")})();
//# sourceMappingURL=index.09d60742.js.map
