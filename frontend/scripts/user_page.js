// get parameters from query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const API_URL = 'http://localhost:3000'

const createTable = (events) => {
    const table = $("#events-table");
    console.log(events);    
    events.forEach(element => {
        const event = createRow(element);
        table.append(event);
    });
}

const createRow = (event) => {
    const row = $("<tr>");
    const name = $("<td>");
    const date = $("<td>");
    const edit = $("<td>");
    name.text(event.event_name);
    date.text(new Date(event.event_date).toLocaleDateString('il-he'));
    edit.append(createEditButton(event));
    row.append(name);
    row.append(date);
    row.append(edit);
    return row;
}

const createEditButton = (event) => {
    const button = $("<button>");
    button.text("Edit");
    button.addClass("btn btn-primary");
    button.click(() => {
        window.location = `/edit.html?id=${event.event_id}`;
    });
    return button;
}

$(document).ready(() => {
    console.log(API_URL + '/api/events/' + urlParams.get("id"));
    $.get(API_URL + '/api/events/' + urlParams.get("id"), function(data,status) {
        console.log(data);
        if(data.status) {
            createTable(data.events);
            $("#addBtn").click(() => {
                window.location = `/create_event.html?id=${urlParams.get("id")}`;
            });
        } else {
            window.location = "http://localhost:3000/info.html";
        }
    });
});
