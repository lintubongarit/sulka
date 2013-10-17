<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

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
				<td>
					<img src="<c:url value="resources/other/luonnontieteellinen_keskusmuseo.gif"/>"></img>
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
					<img src="<c:url value="resources/other/sulka_logo.png"/>" style="height:91px;"></img>
				</td>
			</tr>
		</table>
		
		<div class="local-toolbar">
			<script>
				function clearForm() {
					document.getElementById("filters").reset();
				}
			</script>
			<form id="filters">
				Rengastaja: <input type="text" name="ringer">
				Vuosi (esim. 2005 tai 2005-2006): <input type="text" name="year">
				Laji: <input type="text" name="species">
				Kunta: <input type="text" name="municipality">
				<button id="ok" type="button" onclick="window.sulka.reloadData(this.form)">Ok</button>
				<button id="tyhjenna" type="button" onclick="clearForm()">Tyhjennä</button>
			</form>
		</div>
	
		
		<div id="row-status-box-container">
			<div id="row-status-box" style="padding: 10px"></div>
		</div>
		<div id="slick-grid"></div>
		<div id="columns-pane">
			<table id="columns-table"></table>
		</div>
		
		<form id="tiedot"></form><!-- Added here just to make tests not fail -->
		
		<script src="resources/js/jquery-1.7.min.js"></script>
		<script src="resources/js/jquery.event.drag-2.2.js"></script>
		<script src="resources/js/slick.core.js"></script>
		<script src="resources/js/slick.grid.js"></script>
		<script src="resources/js/sulka.js"></script>

		<script>
			sulka.initGrid();
		</script>
	</body>
</html>
