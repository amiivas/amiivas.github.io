var dbTable = false;
var selectedMonth = $("#selMonth").val();

function initDataTable(){
	oTable = $("#inc-table").dataTable({
		"bLengthChange": false,
		"iDisplayLength":10,
		"aoColumns": [ 
		              { "bSortable": true },//Disable sorting on this column
		              { "bSortable": false },
		              { "bSortable": false },
		              { "bSortable": false },
		              { "bSortable": false },
		              { "bSortable": false }
		          ]
	});
	dbTable = true;
}
var data = [];
var data = [[]];
function dsbRenderer(autoFlag){
	
	if (autoFlag) {
		data = new Array();
		data = [['Acc', 40],['Inc', 60],['Exp', 20]];
	}else {
		data = [['Acc', 70],['Inc', 80],['Exp', 70]];
	}
	
}

var plot;

function plotDashboard(auto,selMonth) {
	dsbRenderer(auto);
	if (plot){
		plot.destroy();
	}
	if (selectedMonth == undefined) {
		selectedMonth = selMonth;
	}
		
plot = $.jqplot('chart3', [data], {
    // Tell the plot to stack the bars.
   // dataRenderer: data,
    //stackSeries: true,
    //captureRightClick: true,
	title: selectedMonth,
    seriesColors:['#00749F', '#73C774', '#C7754C'],
    seriesDefaults:{
      renderer:$.jqplot.BarRenderer,
      rendererOptions: {
          // Put a 30 pixel margin between bars.
          //barMargin: 30
          // Highlight bars when mouse button pressed.
          // Disables default highlighting on mouse over.
          //highlightMouseDown: true   
    	  varyBarColor: true
      },
      pointLabels: {show: true}
    },
    axes: {
      xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer
          //ticks: ticks
      },
      yaxis: {
        // Don't pad out the bottom of the data range.  By default,
        // axes scaled as if data extended 10% above and below the
        // actual range to prevent data points right on grid boundaries.
        // Don't want to do that here.
    	  rendererOptions: { forceTickAt0: true, forceTickAt100: true },
        tickOptions: {formatString: '%dk'}
      }
    },
    legend: {
      show: false,
      //location: 'e',
      //placement: 'outside'
    }      
  });
	
		
return plot;
}

function deleteRow(id,itemClass) {
	
	if (itemClass == "accounts") {
	var tbl = document.getElementById('acc-table');
	var tblbody = tbl.getElementsByTagName('tbody')[0];
	var rowId = id + '-row';
	var row = document.getElementById(rowId);
	tblbody.removeChild(row);
	
	}
	$.ajax({
		  type: "POST",
		  url: "form.htm",
		  data: { deleteRow: "true", id: id, itemClass: itemClass }
		}).done(function( msg ) {
		  alert( "Row Deleted " + $(msg).text() );
		});
}


function appendRow(title,id) {
	
	var tbl = document.getElementById('acc-table');
	var tblbody = tbl.getElementsByTagName('tbody')[0];
	var row = tblbody.insertRow(tblbody.rows.length);
	// insert table cells to the new row
    for (var i = 0; i < tbl.rows[0].cells.length; i++) {
        createCell(row.insertCell(i), i, title,id);
    }
    var rowId = itemId + '-row';
    row.setAttribute('id',rowId);
	
}

//create DIV element and append to the table cell
var itemId = '';
function createCell(cell, i, title,id) {
    var div = document.createElement('div'); // create DIV element
    var count = 0;
    if(i!=4){
    	div.style.width="100px";
    }
    var chgTitle = '';
    if(i==0){
    	chgTitle = validateTitle(title);
    	
    	if (chgTitle.indexOf('#') > 0) {
    		count = chgTitle.split('#')[1];
    		id = id+count;
    	}
    	itemId = id;
    }else {
    	id = itemId;
    }
    
	var divid = id+'-div';
    if(i==0){
    	div.setAttribute('id', divid);    // set DIV class attribute for IE (?!)
    	div.setAttribute('name', divid);    // set DIV class attribute for IE (?!)
    	var txt = document.createTextNode(chgTitle); // create text node
    	//incItems.push(1);
		var input = document.createElement('input');
    	var inpid = id+'-txt';
    	input.type = 'hidden';
    	input.setAttribute('id',inpid);
    	input.setAttribute('name',inpid);
    	input.setAttribute('value',chgTitle);
    	div.appendChild(input);
    	div.appendChild(txt);                    // append text node to the DIV
    	div.setAttribute('class', 'item');        // set DIV class attribute
        div.setAttribute('className', 'item');    // set DIV class attribute for IE (?!)
        div.style.width = "100%";
        cell.setAttribute('nowrap', 'nowrap');
    }
    if(i==1){
    	var prevId = id+'-prev';
    	div.setAttribute('id', prevId);
    	//setPreviousBalance(div,prevId);
    	var txt = document.createTextNode(0);
		div.appendChild(txt);
    }
    if (i==2){
    	var input = document.createElement('input');
    	var inpid = id+'-inp';
    	input.type = 'text';
    	input.setAttribute('id',inpid);
    	input.setAttribute('name',inpid);
    	input.style.width="90%";
    	div.appendChild(input);
    }
    if (i==3){
    	var annualId = id+'-annual';
    	div.setAttribute('id', annualId);
    }
    if(i==4){
    	var img = document.createElement('img');
    	var imgId = id + '-img';
    	img.setAttribute('id',imgId);
    	img.setAttribute('src','images/delete.png');
    	div.appendChild(img);
    	cell.style.width="20px";
    }
    cell.appendChild(div);                   // append DIV to the table cell
}

/*function setPreviousBalance(div,prevId){
	
	var prevBal = 0;
	$.ajax({
		  type: "POST",
		  url: "ajax.form",
		  data: {flag:"prevBal",prevId:prevId}
		}).done(function( msg) {
			alert($(msg).text());
			prevBal = $(msg).text();
			var txt = document.createTextNode(prevBal);
			div.appendChild(txt);
		});
}*/

function validateTitle(title) {
	var j = 0;
	var chgTitle = title;
	var tbl = document.getElementById('acc-table');
	var tblbody = tbl.getElementsByTagName('tbody')[0];
	for ( var i = 0; i < tblbody.rows.length; i++) {
		var cell = tblbody.rows[i].cells[0];
		var cellTitle = cell.innerText;
		if (cellTitle == undefined) {
			cellTitle = cell.textContent;
		}
		
		if (cellTitle.indexOf('#') > 0) {
			cellTitle = cellTitle.split('#')[0];
			cellTitle = $.trim(cellTitle);
		}
		if (cellTitle == title) {
			j = j + 1;
		}
	}
	if (j != 0){
		chgTitle = title + ' #' + j;
	}
	return chgTitle;
}

function autoPopulate(id) {
	if (id != "custInp") {
	var inpId =id.split('-')[0] + '-inp';
	inpId = '#'+inpId;
	var inputVal = $(inpId).val();
	if (inputVal != ''){
		var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
	    if(!numericReg.test(inputVal)) {
	        alert("Please enter only numeric characters.");
	        $(inpId).val('');
	        $(inpId).focus();
	    }else{
	    	 var selId = '#'+id.split('-')[0]+'-sel';
	    	 var totalVal = getAnnualAmount($(selId).val(),inputVal);
	    	 /*$(selId).change(function () {
	             var str = "";
	             $("select option:selected").each(function () {
	                   str += $(this).text() + " ";
	                 });
	             alert(str);
	           })
	           .trigger('change');*/
	    	var totalId = '#'+id.split('-')[0]+'-annual';
	    	var prevId = '#'+id.split('-')[0]+'-prev';
	    	if (prevId == '')
	    		prevId = 0;
	    	
	    	totalVal = parseInt(totalVal) + parseInt($(prevId).text());
	    	$(totalId).text(totalVal);
	    	
	    	updateTotal();
	    	plotDashboard(true);
	    }
	}
	}
}


function getAnnualAmount(option,inputValue){
	
	var noOfDays = 365;
	var d = new Date();
	var year = d.getFullYear(); 
	if(isleap(year)){
		noOfDays = 366;
	}
	switch (option) {
	    case 'Daily':
	        inputValue = inputValue * noOfDays;
	        break;
	    case 'Weekly':
	    	inputValue = Math.round(inputValue * (noOfDays/7));
	        break;
	    case 'Fortnightly':
	    	inputValue = inputValue * 24;
	        break;     
	    case 'Monthly':
	    	inputValue = inputValue * 12;
	        break;
	    case 'Quarterly':
	    	inputValue = Math.round(inputValue * 3);
	        break;
	    case 'Half Yearly':
	    	inputValue = Math.round(inputValue * 2);
	        break;     
	    default://Annual or one off
	    	break;
	}
	    
	    return inputValue;
	
}

function numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}




function updateTotal(page){
	var totalInc = 0;
	var tbl = document.getElementById('acc-table');
	var tblbody = tbl.getElementsByTagName('tbody')[0];
	var rwLength = tbl.rows.length - 1; 
	for (var i=0;i<rwLength;i++){
		var cell = tblbody.rows[i].cells[3];
		var div = cell.getElementsByTagName("div")[0];
		var totalVal = $(div).text();
		if (isNaN(parseInt(totalVal))) {
			totalVal = 0;
		}
		totalInc = parseInt(totalInc) + parseInt(totalVal);
	}
	totalInc = "Rs " + totalInc;
	$("#total_inc").text(totalInc);
	
}


function saveForm() {
	var fullDate = new Date();
	//Thu May 19 2011 17:25:38 GMT+1000 {}
	  
	//convert month to 2 digits
	var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
	  
	var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
	var txt = "Data saved on " + currentDate;
	$('#saveTxt').text(txt);
	$('.blink').hide();
	$('.savedMsg').show();
	var formInp = $('#saveIncForm').serialize();
	alert(formInp);
	//var resp = $.post('login.htm', data);
	$.post('form.htm', formInp,function(data) {
		  $('#saveTxt').text($(data).text());
		});

}

function saveData()
{
var xmlhttp;

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
	  if (tid == 'myTable') 
		  document.getElementById("delMsg1").innerHTML="Row successfully deleted!";
	  else
		  document.getElementById("delMsg2").innerHTML="Row successfully deleted!";	  
    }
  };
  
  
var url = "delcustData.form?desc="+desc + "&value="+value ;
xmlhttp.open("POST",url,true);
xmlhttp.send();
}

function addSelectBox(cell,id){
	var select = document.createElement("select");
	var selId = id +'-sel';
	select.setAttribute("name", selId);
	select.setAttribute("id", selId);
	select.setAttribute("class", "styled-select");
	select.style.width="90%";
	
	/* setting an onchange event 
	selectNode.onchange = function() {dbrOptionChange()};*/
	var option;
	
	/* we are going to add two options */
	/* create options elements */
	option = document.createElement("option");
	option.setAttribute("value", "Daily");
	option.innerHTML = "Daily";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Weekly");
	option.innerHTML = "Weekly";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Fortnightly");
	option.innerHTML = "Fortnightly";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Monthly");
	option.innerHTML = "Monthly";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Quarterly");
	option.innerHTML = "Quarterly";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Half Yearly");
	option.innerHTML = "Half Yearly";
	select.appendChild(option);
	
	option = document.createElement("option");
	option.setAttribute("value", "Annually-One off");
	option.innerHTML = "Annually-One off";
	select.appendChild(option);
	
	cell.appendChild(select);
}

function isleap(yr)
{
 if ((parseInt(yr)%4) == 0)
 {
  if (parseInt(yr)%100 == 0)
  {
    if (parseInt(yr)%400 != 0)
    {
    return "false";
    }
    if (parseInt(yr)%400 == 0)
    {
    return "true";
    }
  }
  if (parseInt(yr)%100 != 0)
  {
    return "true";
  }
 }
 if ((parseInt(yr)%4) != 0)
 {
    return "false";
 } 
}
