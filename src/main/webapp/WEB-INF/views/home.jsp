<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
	<title>Home</title>
</head>
<body>
	<h1>Hello world!</h1>
	
	<p>The time on the server is ${serverTime}.</p>
	
	<table id="ringers-table">
		<tr>
			<th>Nimi</th>
			<th>Rengastajanumero</th>
		</tr>
		<c:forEach var="ringer" items="${ringers}">
			<tr>
				<td>${ringer.firstName} ${ringer.lastName}</td>
				<td>${ringer.ID}</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
