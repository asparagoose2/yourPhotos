// get parameters from query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const URL = 'http://localhost:3000'

const createTable = (events) => {
    const table = $("#events-table");
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
    name.text(event.name);
    date.text(event.date);
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
        window.location = `/edit.html?id=${event.id}`;
    });
    return button;
}



$document.ready(() => {
    $.get(URL + '/api/events', function(data,status) {
        createTable(data.data);
    });
});
