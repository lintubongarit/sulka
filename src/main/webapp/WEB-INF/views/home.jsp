<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<title>Home</title>
</head>
<body>
	<h1>Hello world!</h1>
	${json}
	<table border=1>
		<c:forEach items="${json}" var="species">
			<tr>
				<td><b>${species.getId()}</b></td>
				<c:forEach items="${species.getName()}" var="name">
					<td>content: ${name.getContent()}</td>
					<td>Lang: ${name.getLang()}</td>
				</c:forEach>
				<td>${species.getEuringCode()}</td>
				<td>${species.getProtectionStatus()}</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
