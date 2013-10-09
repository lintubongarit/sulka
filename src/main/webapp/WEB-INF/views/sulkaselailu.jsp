<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
	<title>Sulkaselailu</title>
	<link rel="stylesheet" type="text/css" href="shared.css" />
	<link rel="stylesheet" type="text/css" href="table.css" />
	<script>
		function formReset(){
			document.getElementById("tiedot").reset();
		}
	</script>
			
</head>
<body>
	<h1>Sulka!</h1>
	
	<div class="local-toolbar">
	Täytä tiedot, jos haluat selata 
	<form id="tiedot">
		Rengastaja: <input type="text" name="ringer">
		Vuosi (esim. 2005 tai 2005-2006): <input type="text" name="year">
		Laji: <input type="text" name="species">
		Kunta: <input type="text" name="state">
		<input type="button" onclick="loadJSONDoc()" value="Ok">
		<input type="button" onclick="formReset()" value="Peruuta">
		</form>
	</div>
	
	<script>
	function loadJSONDoc(){
		var getvalue1=document.getElementById("tiedot").getAttribute("ringer");
		var getvalue2=document.getElementById("tiedot").getAttribute("year");
		var getvalue3=document.getElementById("tiedot").getAttribute("species");
		var getvalue4=document.getElementById("tiedot").getAttribute("state");
		
		var jsonhttp;
		if (window.JSONHttpRequest){
	  		jsonhttp=new JSONHttpRequest();
		}else{
	  		jsonhttp=new ActiveXObject("Microsoft.JSONHTTP");
	  	}
			jsonhttp.onreadystatechange=function(){
	  			if (jsonhttp.readyState==4 && jsonhttp.status==200){
	    			document.getElementById("tiedot").innerJSON=JSONhttp.responseText;
	    			}
	 		 }
			jsonhttp.open("POST","/setFilters",true);
			jsonhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			jsonhttp.send("ringer=getvalue1&year=getvalue2&species=getvalue3&state=getvalue4");	
	}
		/* - Hae formin tiedot muuttujiin
			- Muuta JSON:ksi
			- Lähetä JSON controllerille
			- Ota vastaan controllerin palauttama päivitetty lista riveistä
			(- Päivitä taulukko uusilla riveillä)
			*/
	</script>
	
</body>
</html>

