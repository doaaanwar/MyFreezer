var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });
var id = getUrlVars()["id"];

var db;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
    db.transaction(getReportList, transaction_error);
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

function getReportList(tx) {
	$('#busy').show();
	var sql = "select e.id, e.firstName, e.lastName, e.title, e.picture, count(r.id) reportCount " + 
		"from item e left join item r on r.managerId = e.id " +
		"where e.managerId=:id group by e.id order by e.lastName, e.firstName";
	tx.executeSql(sql, [id], getReportList_success);
}

function getReportList_success(tx, results) {
	$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
    	var item = results.rows.item(i);
		$('#reportList').append('<li><a href="itemdetails.html?id=' + item.id + '">' +
				'<img src="pics/' + item.picture + '" class="list-icon"/>' +
				'<p class="line1">' + item.firstName + ' ' + item.lastName + '</p>' +
				'<p class="line2">' + item.title + '</p>' +
				'<span class="bubble">' + item.reportCount + '</span></a></li>');
	}
	setTimeout(function(){
		scroll.refresh();
	});
	db = null;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}