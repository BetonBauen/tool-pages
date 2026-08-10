document.addEventListener("DOMContentLoaded", () => {

    const toolData = window.getToolLibrary
        ? window.getToolLibrary()
        : [];

    buildDropdown();

    document
        .getElementById("snrInput")
        .addEventListener("input", calculate);

});

function buildDropdown() {

    const select = document.getElementById("toolSelect");
    const tools = window.getToolLibrary();

    tools
        .filter(t => t.category === "preset")
        .sort((a,b)=>a.manufacturer.localeCompare(b.manufacturer) || a.name.localeCompare(b.name))
        .forEach(tool=>{

            const option=document.createElement("option");

            option.value=tool.soundpower;

            option.textContent=
                `${tool.manufacturer} ${tool.name}`;

            option.dataset.name=tool.name;
            option.dataset.manufacturer=tool.manufacturer;

            select.appendChild(option);

        });

    select.addEventListener("change",calculate);

}

function calculate(){
console.log("CALCULATE FIRED");
    const select=document.getElementById("toolSelect");

    const snr=parseFloat(document.getElementById("snrInput").value)||0;

    const spl=parseFloat(select.value)||0;

    const effective=spl-snr;

    updateResult(effective,spl,snr);

}

function updateResult(level,spl,snr){

    const output=document.getElementById("output");

    const title=document.getElementById("result-title");
    const exposure=document.getElementById("result-exposure");
    const detail=document.getElementById("result-detail");
    const action=document.getElementById("result-action");
    const icon = document.getElementById("result-icon");

    output.className="alert result";

    if(!spl){

        title.textContent="";

        exposure.textContent="";

        detail.textContent="";

        action.textContent="";

        return;

    }

    let band;
    let heading;
    let text;
    let advice;

    if(level<80){

        band="band-safe";

        heading="Noise level acceptable";

        text="Estimated exposure below 80 dB(A).";

        advice="No additional hearing protection required.";

    }
    else if(level<85){

        band="band-caution";

        heading="Approaching exposure action value";

        text="Estimated exposure between 80 and 85 dB(A).";

        advice="Monitor exposure and provide hearing protection if required.";

    }
    else if(level<=87){

        band="band-warning";

        heading="Hearing protection required";

        text="Estimated exposure exceeds 85 dB(A).";

        advice="Suitable hearing protection must be worn.";

    }
    else{

        band="band-danger";

        heading="Exposure exceeds legal limit";

        text="Estimated exposure exceeds 87 dB(A).";

        advice="Higher attenuation hearing protection or reduced exposure time is required.";

    }

    output.classList.add(band);

    title.textContent=heading;

    exposure.innerHTML=`
        Tool Noise: <strong>${spl.toFixed(1)} dB(A)</strong><br>
        Protection: <strong>${snr.toFixed(1)} dB SNR</strong><br>
        Estimated Exposure: <strong>${level.toFixed(1)} dB(A)</strong>
    `;

 const exposureLevel = getExposureBand(band);

console.log("band:", band);
console.log("exposureLevel:", exposureLevel);
console.log("result-icon element:", icon);

  const icons = {
    safe: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Safe.svg",
    caution: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Caution.svg",
    warning: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Warning.svg",
    alert: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Alert.svg",
    danger: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Danger.svg"
  };
console.log("band =", band);
console.log("exposureLevel =", exposureLevel);
console.log("icon =", icon);
console.log("icon URL =", icons[exposureLevel]);
  icon.innerHTML = `
    <img src="${icons[exposureLevel]}" class="result-status-icon" alt="${exposureLevel}">
  `;

console.log("test ", icon.innerhtml);
    detail.textContent=text;

    action.textContent=advice;

}

function getExposureBand(band) {
  return band.substring(6);
}
