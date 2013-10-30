<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:set var="selectedTab" value="addRingings" />
<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka - Lisää rengastuksia</title>
		<link rel="stylesheet" href="resources/css/lib/slick.grid.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/sulka.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/examples.css" type="text/css" />
		<script src="resources/js/lib/jquery-1.10.2.min.js"></script>
    	<script src="resources/js/lib/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="resources/js/lib/jquery.event.drag-2.2.js"></script>
		<script src="resources/js/lib/moment.min.js"></script>
				<script src="resources/js/lib/plugins/slick.autotooltips.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangedecorator.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangeselector.js"></script>
		<script src="resources/js/lib/plugins/slick.cellselectionmodel.js"></script>
		<script src="resources/js/lib/plugins/slick.cellcopymanager.js"></script>
		<script src="resources/js/lib/slick.editors.js"></script>
		<script src="resources/js/lib/slick.core.js"></script>
		<script src="resources/js/lib/slick.grid.js"></script>
		<script src="resources/js/lib/slick.rowselectionmodel.js"></script>
		<script src="resources/js/sulka.core.js"></script>
		<script src="resources/js/sulka.strings.js"></script>
		<script src="resources/js/sulka.API.js"></script>
		<script src="resources/js/sulka.helpers.js"></script>
		<script src="resources/js/sulka.addRingings.js"></script>		
	</head>
	<body>
		<%@include file="_header.jsp" %>
		<table class="local-toolbar">
			<tr>
				<td>
					<form id="filters">
						Aika (esim. 2005 tai 2005-2006): <input type="text" id="filters-date" name="date" />
						Laji: <input type="text" id="filters-species" name="species" />
						Kunta: <input type="text" id="filters-municipality" name="municipality" />
						<input type="submit" id="form-submit" value="OK" />
						<input type="reset" id="form-reset" value="Tyhjennä" />
						<img src="resources/img/ajax-loader.gif" id="loader-animation" />
					</form>
				</td>
				<td>
					<button type="button" id="validate" class="local-toolbar-menu" onclick="sulka.validate();">Validoi</button>
					<button type="button" class="local-toolbar-menu" value="new row" onclick="sulka.addInvalidRow();">Lisää invalidi rivi</button>
				</td>
			</tr>
		</table>
		<%@include file="_slickGrid.jsp" %>
	</body>
</html>
