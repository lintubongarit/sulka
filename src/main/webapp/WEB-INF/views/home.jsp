<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
	<title>Home</title>
</head>
<body>
	<h1>Hello world!</h1>
	
	<p>The time on the server is ${serverTime}.</p>
	
	<c:choose>
		<c:when test="${rows != null}">
			<table id="rows-table">
				<tr>
					<th>Rengastaja</th>
					<th>Lajikoodi</th>
					<th>Laji</th>
				</tr>
				<c:forEach var="row" items="${rows}">
					<tr>
						<td><c:out value="${row.ringer}" /></td>
						<td><c:out value="${row.speciesCode}" /></td>
						<td><c:out value="${row.speciesFullName}" /></td>
					</tr>
				</c:forEach>
			</table>
		</c:when>
		<c:otherwise>
			<p class="error"><c:out value="${rowsError}" /></p>
		</c:otherwise>
	</c:choose>
	
	<table id="ringers-table">
		<tr>
			<th>Nimi</th>
			<th>Rengastajanumero</th>
		</tr>
		<c:forEach var="ringer" items="${ringers}">
			<tr>
				<td><c:out value="${ringer.firstName}" /> <c:out value="${ringer.lastName}" /></td>
				<td><c:out value="${ringer.ID}" /></td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
