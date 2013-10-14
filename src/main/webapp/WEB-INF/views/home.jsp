<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>Home</title>
</head>
<body>
	<c:choose>
		<c:when test="${user.accessStatus() == 0}">
			<font color="green" size="20">Welcome fellow ringer!</font>
		</c:when>
		<c:otherwise>
			<font color="red" size="20">You shall not pass!</font>
			<c:choose>
				<c:when test="${user.accessStatus() == 1}">
					<p>
						<i>Access expired</i>
				</c:when>
			</c:choose>
		</c:otherwise>
	</c:choose>

	<c:choose>
		<c:when test="${rows != null}">
			<table id="rows-table">
				<tr>
					<th>Rengastaja</th>
					<th>Lajikoodi</th>
					<th>Lajin nimi</th>
					<th>Päivämäärä</th>
				</tr>
				<c:forEach var="row" items="${rows}">
					<tr>
						<td><c:out value="${row.ringer}" /></td>
						<td><c:out value="${row.species}" /></td>
						<td><c:out value="${row.speciesFullName}" /></td>
						<td><c:out value="${row.eventDate}" /></td>
					</tr>
				</c:forEach>
			</table>
		</c:when>
		<c:otherwise>
			<p class="error">
				<c:out value="${rowsError}" />
			</p>
		</c:otherwise>
	</c:choose>

	<table id="ringers-table">
		<tr>
			<th>Nimi</th>
			<th>Rengastajanumero</th>
		</tr>
		<c:forEach var="ringer" items="${ringers}">
			<tr>
				<td><c:out value="${ringer.firstName}" /> <c:out
						value="${ringer.lastName}" /></td>
				<td><c:out value="${ringer.ID}" /></td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
