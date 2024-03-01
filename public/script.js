// Declaration
const lat_input = document.getElementById('latitude_input');
const lon_input = document.getElementById('longitude_input');

// Images toggle
const toggleButton = document.getElementById('shitpostsbtn');
const shitpostsDiv = document.getElementById('shitposts');
toggleButton.addEventListener('click', () => {
    shitpostsDiv.classList.toggle('hidden');
});

// Clear inputs
function clearInputs() {
    lat_input.value = null;
    lon_input.value = null;
}

// Save cookies
function saveInputs() {
    document.cookie = `latitude=${lat_input.value.toString()}`;
    document.cookie = `longitude=${lon_input.value.toString()}`;
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
        document.cookie = `tableData=${jsonData}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }
});


//Load cookies
const cookies = document.cookie.split('; ');
lat_input.value = cookies.find(row => row.startsWith('latitude')).split('=')[1];
lon_input.value = cookies.find(row => row.startsWith('longitude')).split('=')[1];

if (!document.querySelector('table')) {
    const tableCookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('tableData='))
        ?.split('=')[1];

    const tableData = JSON.parse(tableCookieValue);
    const newTbody = document.createElement('tbody');
    tableData.forEach(rowData => {
        const tr = document.createElement('tr');
        Object.values(rowData).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        newTbody.appendChild(tr);
    });

    document.getElementById("table").innerHTML =
        "<table>\n" +
        "            <thead>\n" +
        "            <tr>\n" +
        "                <th>Time</th>\n" +
        "                <th>°C</th>\n" +
        "                <th>Rain (mm)</th>\n" +
        "                <th>Snow (cm)</th>\n" +
        "                <th>Pressure (hPa)</th>\n" +
        "            </tr>\n" +
        "            </thead>";
    document.getElementsByTagName("table")[0].appendChild(newTbody);
    document.getElementById("table").innerHTML += "</table>";
}
