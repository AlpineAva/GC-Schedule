const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
var json = "";

function getFilteredResults() {
    let filter = document.getElementById('search').value;
    if(!filter) {
        return json;
    }

    let results = [];
    for(let i = 0; i < json.length; i++) {
        let opponentName = json[i].opponent_name;
        let location = json[i].location;
        
        if(opponentName.includes(filter) || location.includes(filter)) {
            results.push(json[i]);
        }
    }

    return results;
}

function updateScheduleView() {
    // Format the data into YYYY-MM buckets
    let monthBuckets = {};
    let filteredJson = getFilteredResults();
    for(let i = 0; i < filteredJson.length; i++) {
        let key = filteredJson[i].start.datetime.slice(0, 7); // YYYY-MM
        if(!monthBuckets[key]) {
            monthBuckets[key] = [];
        }
        monthBuckets[key].push(filteredJson[i]);
    }

    // Create a new table for each element
    let schedule = document.getElementById("schedule-view");
    schedule.innerHTML = ""; // reset the view...
    let keys = Object.keys(monthBuckets);
    console.log(keys.length);
    if(keys.length === 0) {
        schedule.innerHTML = `<div>No Results</div>`
    } else {
        for(let i = 0; i < keys.length; i++) {
            schedule.innerHTML += createTableTitle(keys[i]);
            schedule.innerHTML += createTable(monthBuckets[keys[i]]);
        }
    }
}

function createTableTitle(key) {
    let date = new Date(key);
    date.setDate(date.getDate() + 2); // add 2 days to avoid UTC conversion changing the month...
    let monthString = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return `<div class="table-title">` + monthString + `</div>`;
}

function createTable(bucket) {
    let rowHTML = '';
    for(let i = 0; i < bucket.length; i++) {
        let e = bucket[i];
        let date = new Date(e.start.datetime);
        rowHTML += `<tr class="` + (i+1 == bucket.length ? 'bottom-row-style' : 'row-style') + `">
        <td class="td-style">
            <div class="left-column-style">
                <div class="topleft-div-style">` + DAYS[date.getDay()] + `</div>
                <div class="bottomleft-div-style">` + date.getDate() + `</div>
            </div>
            <div class="right-column-style">
                <div class="topright-div-style">` + 
                    (e.home_away === "home" ? "vs. " : "@ ") + e.opponent_name +
                `</div>
                <div class="bottomright-div-style">at ` + e.location +`</div>
            </div>
        </td></tr>`;
    }
    
    return `<div class="card">
                <table class="table table-style">
                    <tbody>`
                        + rowHTML +
                    `</tbody>
                </table>
            </div>
            <br/>
            <br/>`
}

const searchListener = document.getElementById('search');
searchListener.addEventListener('input', updateScheduleView);


fetch("./schedule")
  .then((response) => response.json())
  .then((data) => {
    json = data;
    updateScheduleView();
  });