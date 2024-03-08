const lat_input = document.getElementById('latitude_input');
const lon_input = document.getElementById('longitude_input');
function clearInputs() {
    lat_input.value = null;
    lon_input.value = null;
}
function saveInputs() {
    localStorage.setItem('latitude', lat_input.value.toString());
    localStorage.setItem('longitude', lon_input.value.toString());
}
window.addEventListener('load', function() {
    const rows = document.querySelectorAll('tbody tr');
    if (rows.length > 0) {
        const data = [];
        rows.forEach(row => {
            const rowData = {};
            const cells = row.querySelectorAll('td');

            rowData.time = cells[0].textContent.trim();
            rowData.temperature = cells[1].textContent.trim();
            rowData.rain = cells[2].textContent.trim();
            rowData.snow = cells[3].textContent.trim();
            rowData.pressure = cells[4].textContent.trim();

            data.push(rowData);
        });
        const jsonData = JSON.stringify(data);
        localStorage.setItem('tableData', jsonData);
        // Set expiry in 24 hours
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        const expiryTimestamp = expiryDate.getTime();
        localStorage.setItem('tableDataExpiry', expiryTimestamp);
    }
});
const latitude = localStorage.getItem('latitude');
const longitude = localStorage.getItem('longitude');
if (latitude && longitude) {
    lat_input.value = latitude;
    lon_input.value = longitude;
}
const tableDataExpiry = localStorage.getItem('tableDataExpiry');
if (tableDataExpiry && Date.now() < parseInt(tableDataExpiry, 10)) {
    const tableData = localStorage.getItem('tableData');
    if (tableData) {
        const newTbody = document.createElement('tbody');
        JSON.parse(tableData).forEach(rowData => {
            const tr = document.createElement('tr');
            Object.values(rowData).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            newTbody.appendChild(tr);
        });

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = "<tr><th>Time</th><th>°C</th><th>Rain (mm)</th><th>Snow (cm)</th><th>Pressure (hPa)</th></tr>";
        table.appendChild(thead);
        table.appendChild(newTbody);
        
        document.getElementById('table').appendChild(table);
    }
}