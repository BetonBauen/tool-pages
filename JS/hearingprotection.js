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

    const spl = parseFloat(select.value);

    const snr = parseFloat(document.getElementById("snrInput").value);

    // Don't show anything until both values exist
    if (isNaN(spl) || isNaN(snr) || snr <= 0) {
        return;
    }

    const effective = Math.max(0, spl - (snr - 4));

    updateResult(effective, spl, snr);

}

function updateResult(level,spl,snr){

    const output=document.getElementById("output");

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

    detail.textContent=text;

    action.textContent=advice;

}
