<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<html>
	<head>
	</head>
	<body>
		<c:choose>
			<c:when test="${user.accessStatus() == 0}">
				<font color="green" size="20">Welcome ${user.getName()}!</font>
				<p/>
				<a href="${pageContext.request.contextPath}/">Etusivulle</a> 
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
		<p>
	</body>
</html>