document.addEventListener("DOMContentLoaded", () => {

    const toolData = window.getToolLibrary
        ? window.getToolLibrary()
        : [];

    buildDropdown();

    document
        .getElementById("toolSelect")
        .addEventListener("change", calculate);

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



}

function calculate() {

    const select = document.getElementById("toolSelect");
    const spl = parseFloat(select.value); // tool sound power level including uncertainty (dbA)
    const snr = parseFloat(document.getElementById("snrInput").value); // hearing protection snr value (dbA)
    const cWeight = 7; // 7dB standard conversion factor for converting dBA to dbC
    const derating = 4; // 4dB derating factor

    // Don't show anything until both values exist
    if (isNaN(spl) || isNaN(snr) || snr <= 0) {
        return;
    }

    const effective = Math.max(0, (spl + cWeight) - snr + derating);

    console.log("tool sound - ", spl, " dbA");
    console.log("c weight - ", cWeight, " dbA");
    console.log("derating value - ", derating, " dbA");
    console.log("hearing protection snr - ", spl, " dbA");
    console.log("formula should be : (spl + c weight) - (hearing protection snr + derating) ", (spl + 7) - snr + 4 );
    console.log("calculated result - ", effective);


    updateResult(effective, spl, snr);

}

function updateResult(level,spl,snr){

    const output=document.getElementById("output");
    const icon = document.getElementById("result-icon");
    const title=document.getElementById("result-title");
    const exposure=document.getElementById("result-exposure");
    const detail=document.getElementById("result-detail");
    const action=document.getElementById("result-action");
    output.classList.remove("d-none");
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

    if(level<70){
      band = "band-caution";
      heading = "Warning: Over-protection";
      text = "Estimated exposure is very low (" + level + "db(A))";
      advice = "Operative may be isolated and will struggle to hear alarms or communication. Consider a lower SNR level";
    }


    if(level<80){
        band="band-safe";
        heading="Noise level acceptable";
        text="Estimated exposure below 80 dB(A).";
        advice="No additional hearing protection required.";
    }

    else if(level<85){
        band="band-warning";
        heading="Approaching exposure action value";
        text="Estimated exposure between 80 and 85 dB(A).";
        advice="Monitor exposure and provide hearing protection if required.";
    }

    else if(level<=87){
        band="band-alert";
        heading="Hearing protection insufficient";
        text="Estimated exposure exceeds 85 dB(A).";
        advice="Suitable hearing protection must be worn.";
    }

    else{
        band="band-danger";
        heading="Exposure exceeds legal limit";
        text="Estimated exposure is " + level + "db(A)";
        advice="Higher attenuation hearing protection or reduced exposure time is required.";
    }

    output.classList.add(band);

    const icons = {
      safe: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Safe.svg",
      caution: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Caution.svg",
      warning: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Warning.svg",
      alert: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Alert.svg",
      danger: "https://raw.githubusercontent.com/BetonBauen/tool-pages/refs/heads/testing/Assets/Icons/Status/SVG/Danger.svg"
    };

  const exposureLevel = getExposureBand(band);

  icon.innerHTML = `
    <img src="${icons[exposureLevel]}" class="result-status-icon" alt="${exposureLevel}">
  `;

    title.textContent=heading;

    exposure.innerHTML=`
        Tool Noise: <strong>${spl.toFixed(1)} dB(A)</strong><br>
        Protection: <strong>${snr.toFixed(1)} dB SNR</strong><br>
        Estimated Exposure: <strong>${level.toFixed(1)} dB(A)</strong>
    `;

    detail.textContent=text;

    action.textContent=advice;

}
function getExposureBand(band) {
  return band.substring(5);
}
