<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka</title>
		<link rel="stylesheet" href="resources/css/lib/slick.grid.css" type="text/css" />
		<!-- <link rel="stylesheet" href="resources/css/examples.css" type="text/css" /> -->
		<link rel="stylesheet" href="resources/css/sulka.css" type="text/css" />
		<script src="resources/js/lib/jquery-1.7.min.js"></script>
		<script src="resources/js/lib/jquery-ui-1.8.16.custom.min.js"></script>
		<script src="resources/js/lib/jquery.event.drag-2.2.js"></script>
		<script src="resources/js/lib/slick.core.js"></script>
		<script src="resources/js/lib/slick.grid.js"></script>
		<script src="resources/js/lib/moment.min.js"></script>
		<script src="resources/js/sulka.core.js"></script>
		<script src="resources/js/sulka.strings.js"></script>
		<script src="resources/js/sulka.API.js"></script>
		<script src="resources/js/sulka.helpers.js"></script>
	</head>
	<body>
		<table id="global-toolbar" class="global-toolbar">
			<tr class="global-toolbar">
				<td>
					<img src="<c:url value="resources/img/luonnontieteellinen_keskusmuseo.gif"/>"></img>
				</td>
				<!-- <td class="global-toolbar">
					<span class="global-toolbar-app-title">Sulka</span>
					<ul id="feature-list" class="feature-list-tabs"></ul>
				</td> -->
				<!-- <td class="global-toolbar global-toolbar-user-info">
					<span id="global-toolbar-full-name" class="full-name"></span><br>
					<span id="global-toolbar-login-id" class="login-id"></span>
				</td> -->
				
				<td class="global-toolbar-user-info">
					<c:out value="${user.getName()}"/><br>
					<c:out value="${user.getEmail()}"/>
				</td>
				<td class="global-toolbar-logout">
					<a class="global-toolbar-lintuvaara-button" href="logout">Palaa Lintuvaaraan</a>
				</td>
				<td>
					<img src="<c:url value="resources/img/sulka_logo.png"/>" style="height:91px;"></img>
				</td>
			</tr>
		</table>
		
		<div class="local-toolbar">
			<form id="filters">
				Rengastaja: <input type="text" id="filters-ringer" name="ringer" />
				
				<input type="hidden" id="filters-date" name="date" value="" />
				
				
				Laji: <input type="text" id="filters-species" name="species" />
				Kunta: <input type="text" id="filters-municipality" name="municipality" />
				<input type="submit" id="form-submit" value="OK" />
				<input type="reset" id="form-reset" value="Tyhjennä" />
				<input type="checkbox" id="filters-ringings" name="ringings" checked/> Rengastukset
 				<input type="checkbox" id="filters-recoveries" name="recoveries" checked /> Tapaamiset
				<img src="resources/img/ajax-loader.gif" id="loader-animation" />
			</form>
		</div>
	
		<div id="row-status-box-container">
			<div id="row-status-box" style="padding: 1px">
				<span id="last-error"></span>
			</div>
		</div>
		<div id="slick-grid"></div>
		<div id="columns-pane">
			<table id="columns-table"></table>
		</div>
		
		<form id="tiedot"></form><!-- Added here just to make tests not fail -->
	</body>
</html>