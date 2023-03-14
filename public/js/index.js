const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

function updateScheduleView(json) {
    // Format the data into YYYY-MM buckets
    let monthBuckets = {};
    for(let i = 0; i < json.length; i++) {
        let key = json[i].start.datetime.slice(0, 7); // YYYY-MM
        if(!monthBuckets[key]) {
            monthBuckets[key] = [];
        }
        monthBuckets[key].push(json[i]);
    }
    console.log(monthBuckets);

    // Create a new table for each element
    let schedule = document.getElementById("schedule-view");
    let keys = Object.keys(monthBuckets);
    for(let i = 0; i < keys.length; i++) {
        console.log('bucket)');
        schedule.innerHTML += createTableTitle(keys[i]);
        schedule.innerHTML += createTable(monthBuckets[keys[i]]);
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
    console.log(bucket);
    for(let i = 0; i < bucket.length; i++) {
        let e = bucket[i];
        let date = new Date(e.start.datetime);
        //console.log(e);
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

console.log('Hello World');


fetch("./schedule")
  .then((response) => response.json())
  .then((data) => updateScheduleView(data));