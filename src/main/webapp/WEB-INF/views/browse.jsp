<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<c:set var="selectedTab" value="browse" />
<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka - Selaa rivejä</title>
		<link rel="stylesheet" href="resources/css/lib/slick.grid.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/sulka.css" type="text/css" />
   		<script src="resources/js/lib/jquery-1.10.2.min.js"></script>
    	<script src="resources/js/lib/jquery-ui-1.10.3.custom.min.js"></script>
   		<script src="resources/js/lib/jquery.event.drag-2.2.js"></script>
		<script src="resources/js/lib/moment.min.js"></script>
		<script src="resources/js/lib/plugins/slick.autotooltips.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangedecorator.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangeselector.js"></script>
		<script src="resources/js/lib/plugins/slick.cellcopymanager.js"></script>
		<script src="resources/js/lib/plugins/slick.cellselectionmodel.js"></script>
		<script src="resources/js/lib/slick.core.js"></script>
		<script src="resources/js/lib/slick.editors.js"></script>
		<script src="resources/js/lib/slick.grid.js"></script>
		<script src="resources/js/sulka.core.js"></script>
		<script src="resources/js/sulka.strings.js"></script>
		<script src="resources/js/sulka.API.js"></script>
		<script src="resources/js/sulka.helpers.js"></script>
	</head>
	<body>
		<%@include file="_header.jsp" %>
		<table class="local-toolbar">
			<tr>
				<td>
					<form id="filters">
					    <sec:authorize access="hasRole('ADMIN')">
        					Rengastaja: <input type="text" id="filters-ringer" name="ringer" />
    					</sec:authorize>
						Aika (esim. 2005 tai 2005-2006): <input type="text" id="filters-date" name="date" />
						Laji: <input type="text" id="filters-species" name="species" />
						Kunta: <input type="text" id="filters-municipality" name="municipality" />
						<input type="submit" id="form-submit" value="OK" />
						<input type="reset" id="form-reset" value="Tyhjennä" />
						<input type="checkbox" id="filters-ringings" name="ringings" checked/> Rengastukset
		 				<input type="checkbox" id="filters-recoveries" name="recoveries" checked /> Tapaamiset
						<img src="resources/img/ajax-loader.gif" id="loader-animation" />
					</form>
				</td>
			</tr>
		</table>
		<%@include file="_slickGrid.jsp" %>
	</body>
</html>
