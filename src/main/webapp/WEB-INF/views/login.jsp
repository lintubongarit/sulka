<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
	<head>
	</head>
	<body>
		<c:choose>
			<c:when test="${accessStatus == 0}">
				<font color="green" size="20">Welcome fellow ringer!</font>
			</c:when>
			<c:otherwise>
				<font color="red" size="20">You shall not pass!</font>
				<c:choose>
					<c:when test="${accessStatus == 1}">
						<p>
						<i>Access expired</i>
					</c:when>
				</c:choose>
			</c:otherwise>
		</c:choose>
		<p>
	</body>
</html>