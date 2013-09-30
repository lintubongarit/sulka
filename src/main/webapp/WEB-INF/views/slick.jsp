<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka</title>
		<link rel="stylesheet" href="resources/css/slick.grid.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/example.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/jquery-ui-1.8.16.custom.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/sulka.css" type="text/css" />
	</head>
	<body>
		<table id="global-toolbar" class="global-toolbar">
			<tr class="global-toolbar">
				<td class="global-toolbar">
					<span class="global-toolbar-app-title">Rengas14</span>
					<ul id="feature-list" class="feature-list-tabs"></ul>
				</td>
				<td class="global-toolbar global-toolbar-user-info">
					<span id="global-toolbar-full-name" class="full-name"></span><br>
					<span id="global-toolbar-login-id" class="login-id"></span>
				</td>
				<td class="global-toolbar" style="text-align: right">
					<a class="global-toolbar-lintuvaara-button" href="logout">Palaa Lintuvaaraan</a>
				</td>
			</tr>
		</table>
		<div id="row-status-box-container">
			<div id="row-status-box" style="padding: 10px"></div>
		</div>
		<div id="slick-grid"></div>
		<div id="columns-pane">
			<table id="columns-table"></table>
		</div>
		<script src="resources/js/jquery-1.7.min.js"></script>
		<script src="resources/js/jquery.event.drag-2.2.js"></script>
		<script src="resources/js/slick.core.js"></script>
		<script src="resources/js/slick.grid.js"></script>		
		
		<script>
			var grid;
			var columns = [{id: "title", name: "Title", field: "title"},
			               {id: "rndm", name: "Rndm", field: "rndm"}];
			var options = {
					enableCellNavigation: true,
					enableColumnReorder: false
			};
			$(function () {
				var data = [];
				for (var i = 0; i < 500; i++){
					data[i] = {
							title: "Task " + i,
							rndm: Math.round(Math.random()*100)
					};
				}
				grid = new Slick.Grid("#slick-grid", data, columns, options);
			});
		</script>
	</body>
</html>
