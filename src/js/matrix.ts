const params = new URLSearchParams(window.location.search);
if (params.has('redirect')) {
	window.location.href = "https://matrix.to/#/@kybe:kybe.xyz";
}
