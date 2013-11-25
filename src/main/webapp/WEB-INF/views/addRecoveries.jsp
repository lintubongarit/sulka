<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:set var="selectedTab" value="addRecoveries" />
<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka - Lisää tapaamisia</title>
		<link rel="stylesheet" href="resources/css/lib/slick.grid.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/examples.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/sulka.css" type="text/css" />
		<link rel="stylesheet" href="resources/css/lib/slick.dragdrop.css" type="text/css" />
		<script src="resources/js/lib/jquery-1.10.2.min.js"></script>
    	<script src="resources/js/lib/jquery-ui-1.10.3.custom.min.js"></script>
   		<script src="resources/js/lib/plugins/jquery.event.drag-2.2.js"></script>
   		<script src="resources/js/lib/plugins/jquery.event.drop-2.2.js"></script>
		<script src="resources/js/lib/plugins/jquery.mousewheel.js"></script>
		<script src="resources/js/lib/moment.min.js"></script>
		<script src="resources/js/lib/plugins/slick.autotooltips.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangedecorator.js"></script>
		<script src="resources/js/lib/plugins/slick.cellrangeselector.js"></script>
		<script src="resources/js/lib/plugins/slick.cellselectionmodel.js"></script>
		<script src="resources/js/lib/plugins/slick.cellcopymanager.js"></script>
		<script src="resources/js/lib/plugins/slick.rowselectionmodel.js"></script>
		<script src="resources/js/lib/plugins/slick.rowmovemanager.js"></script>
		<script src="resources/js/lib/slick.editors.js"></script>
		<script src="resources/js/lib/slick.formatters.js"></script>
		<script src="resources/js/lib/slick.editors.js"></script>
		<script src="resources/js/lib/slick.core.js"></script>
		<script src="resources/js/lib/slick.grid.js"></script>
		<script src="resources/js/sulka.core.js"></script>
		<script src="resources/js/sulka.strings.js"></script>
		<script src="resources/js/sulka.helpers.js"></script>
		<script src="resources/js/sulka.API.js"></script>
		<script src="resources/js/sulka.groups.js"></script>
		<script src="resources/js/sulka.freeze.js"></script>
		<script src="resources/js/sulka.addCore.js"></script>
		<script src="resources/js/sulka.addRecoveries.js"></script>
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
					<button type="button" id="saveSettings" class="local-toolbar-menu" onclick="sulka.saveSettings();">Tallenna asetukset</button>
					<button type="button" id="loadSettings" class="local-toolbar-menu" onclick="sulka.fetchSettings();">Lataa asetukset</button>
				</td>
				<td>
				    <div id="dropzone" class="recycle-bin">
				         Roskakori
				    </div>
				</td>
			</tr>
		</table>
		<%@include file="_slickGrid.jsp" %>
	</body>
</html>