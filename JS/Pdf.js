document.addEventListener("DOMContentLoaded", () => {

    const printButton = document.getElementById("generatePdf");

    if (printButton) {
        printButton.addEventListener("click", generatePdfReport);
    }

});

function generatePdfReport() {

    console.log("generatePdfReport called");

    populatePdfReport();

    alert("about to print");

    //window.print();
 //setTimeout(savePdfReport,5000);

};




function populatePdfReport() {

    // Work details

    document.getElementById("pdfEmployee").textContent = document.getElementById("employeeName").value;
    console.log("employeeName")

    document.getElementById("pdfSite").textContent = document.getElementById("siteName").value;
    console.log("siteName")

   const dateValue = document.getElementById("startDate").value;

    if (dateValue) {
        const [year, month, day] = dateValue.split("-");
        document.getElementById("pdfDate").textContent = `${day}/${month}/${year}`;
        console.log("pdfDate")
    } else {
        document.getElementById("pdfDate").textContent = "";
    }


    // Tool table

    const tbody = document.getElementById("pdfToolRows");

    tbody.innerHTML = "";

    let totalPoints = 0;

    const rows = document.querySelectorAll("#standaloneContainer .standalone-calculator-row");

    rows.forEach(row => {

        const tool = row.querySelector(".standalone-tool-select")?.textContent.trim() || "";
     
        const magnitude = row.querySelector(".standalone-vibration")?.value || "";

        const hours = parseFloat(row.querySelector(".standalone-hours")?.value) || 0;

        const minutes = parseFloat(row.querySelector(".standalone-minutes")?.value) || 0;

        if (!tool || tool === "Select tool") return;

        const triggerTime = `${hours}h ${minutes}m`;

        const points =
            Number(row.dataset.points) || 0;

        totalPoints += points;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${tool}</td>
            <td>${magnitude}</td>
            <td>${triggerTime}</td>
            <td>${Math.round(points)}</td>
        `;

        tbody.appendChild(tr);
        console.log("row complete")
    });

    document.getElementById("pdfTotalPoints").textContent = Math.round(totalPoints);


    // Result summary

    document.getElementById("pdfExposure").textContent = document.getElementById("result-exposure").textContent;
   console.log("result-exposure")

    document.getElementById("pdfStatus").textContent = document.getElementById("result-title").textContent;
   console.log("result-title")
    
   document.getElementById("pdfDetail").textContent = document.getElementById("result-detail").textContent;
   console.log("result-detail")

    document.getElementById("pdfAction").textContent = document.getElementById("result-action").textContent;
   console.log("result-action")

    // Copy result band styling

    const output = document.getElementById("output");

    const pdfResult = document.getElementById("pdfResult");

    pdfResult.className = output.className;

    // Copy status icon if present

    const sourceIcon = document.getElementById("result-icon");

    const targetIcon = document.getElementById("pdfResultIcon");

    if (sourceIcon && targetIcon) {
        targetIcon.innerHTML = sourceIcon.innerHTML;
          console.log("icon")
    }
savePdfReport();
}

function savePdfReport() {
//alert("timeout expired");

var element = document.getElementById('pdfReport');
//var opt = {
//  allowTaint: true,
//  useCORS: true,
//  margin: 0,
//  filename: 'testingpdf.pdf',
//  image: { type: 'jpeg', quality: 0.98 },
// html2canvas: { scale: 2, useCORS: true, removeContainer: true},
// pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
//  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compressPDF: true 
//  },
//};
const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;
html2pdf()
    .from(element)
    .set({
        //top, left, bottom, right
        margin:       [2, 1, 2, 1],
        allowTaint: true,
        useCORS: true,
        filename:     'Hand Arm Vibration Monitoring ' + pdfEmployee.textContent + ' ' + currentDate,
        image:        { type: 'jpeg',quality: 0.98 },
        html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true, useCORS: true, removeContainer: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' },
        pagebreak: { before: '.page-break', avoid: 'table' }
        })
    .toPdf()
    .get('pdf').then(function (pdf) {
        var totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor('#3e3e3e');
            pdf.text('HS&E 14 | Hand Arm Vibration Monitoring - Revision 3 - 10/07/2026 ', pdf.internal.pageSize.getWidth() - 205, pdf.internal.pageSize.getHeight() - 8);
            pdf.text('Page ' + i + '/' + totalPages+'', pdf.internal.pageSize.getWidth() - 18, pdf.internal.pageSize.getHeight() - 8);
            pdf.setTextColor('#00b0f0');
            pdf.text('|', pdf.internal.pageSize.getWidth() - 191.1, pdf.internal.pageSize.getHeight() - 8);
          } 
    }).save();

//html2pdf().set(opt).from(element).save();
}


