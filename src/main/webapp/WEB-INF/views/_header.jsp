<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div class="global-toolbar">
	<img src="<c:url value="/resources/img/luonnontieteellinen_keskusmuseo.gif"/>" class="global-toolbar-lumo" />
	<img src="<c:url value="/resources/img/sulka_logo.png"/>" class="global-toolbar-logo" />
	<div class="global-toolbar-user">
		<div class="global-toolbar-user-info">
			<span id="global-toolbar-full-name" class="full-name"><c:out value="${user.getName()}"/></span><br>
			<span id="global-toolbar-login-id" class="login-id"<c:out value="${user.getEmail()}"/>></span>
		</div>
		<a class="global-toolbar-lintuvaara-button" href="<c:url value="/logout" />">Palaa Lintuvaaraan</a>
	</div>
</div>
<ul id="feature-list" class="feature-list-tabs">
	<c:choose>
		<c:when test="${selectedTab.equals('browse')}">
			<li class="current-feature-item"><a id="browse-tab" href="<c:url value="/"/>">Selailu</a></li>
		</c:when>
		<c:otherwise>
			<li><a id="browse-tab" href="<c:url value="/"/>">Selailu</a></li>
		</c:otherwise>
	</c:choose>	
	<c:choose>
		<c:when test="${selectedTab.equals('addRingings')}">
			<li class="current-feature-item"><a id="add-ringings-tab" href="<c:url value="/addRingings"/>">Rengastusten syöttö</a></li>
		</c:when>
		<c:otherwise>
			<li><a id="add-ringings-tab" href="<c:url value="/addRingings"/>">Rengastusten syöttö</a></li>
		</c:otherwise>
	</c:choose>	
	<c:choose>
		<c:when test="${selectedTab.equals('addRecoveries')}">
			<li class="current-feature-item"><a id="add-recoveries-tab" href="<c:url value="/addRecoveries"/>">Kontrollien syöttö</a></li>
		</c:when>
		<c:otherwise>
			<li><a id="add-recoveries-tab" href="<c:url value="/addRecoveries"/>">Kontrollien syöttö</a></li>
		</c:otherwise>
	</c:choose>	
	<c:choose>
		<c:when test="${selectedTab.equals('removeRingings')}">
			<li class="current-feature-item"><a id="remove-ringings-tab" href="<c:url value="/removeRingings"/>">Rengastusten poisto</a></li>
		</c:when>
		<c:otherwise>
			<li><a id="remove-ringings-tab" href="<c:url value="/removeRingings"/>">Rengastusten poisto</a></li>
		</c:otherwise>
	</c:choose>	
</ul>
