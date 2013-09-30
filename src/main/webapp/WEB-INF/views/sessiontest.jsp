<h2>Adding of a String into the session</h2>

<form action="remember" method="post">
	<table>
		<tbody>
			<tr>
				<td>To remember:</td>
				<td><input name="thoughtParam" type="text"></td>
			</tr>
			<tr>
				<td><input type="submit"></td>
				<td></td>
			</tr>
		</tbody>
	</table>
</form>
<a href="${pageContext.request.contextPath}/">Main page</a>
<p>Don't forget: ${thought}</p>
