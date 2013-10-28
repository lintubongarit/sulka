<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML>
<html>
	<head>
		<title>Sulka - Kirjaudu sisään</title>
	</head>
	<body>
		<img alt="404-bird" src="<c:url value="/resources/img/404-bird.jpg" />" style="float:right">
		<h1><c:out value="${msg}" /></h1>
		<p><a href="http://lintuvaara.ihku.fi">Click here to authenticate in Lintuvaara</a></p>
	</body>
</html>