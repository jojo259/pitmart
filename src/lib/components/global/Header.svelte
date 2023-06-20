<script lang="ts">
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import NavBar from "./NavBar.svelte";

	export let user: any;

	import { goto } from "$app/navigation";

	let tag = "";

	function handleSubmit(event: Event) {
		event.preventDefault();
		goto(`/player/${tag}`);
	}

	//document.getElementById("search-input").focus();
	//document.getElementById("search-input").select();
	
</script>

<NavBar user={user} />

<CenteredDiv>
	<div>
		<div>
			<h1>P<a href="/player/mcpqndq" class="blanklink">i</a>tMart</h1>
			<h2>BETA!</h2>
		</div>
		<div>
            <div class="userbox-row infobox">
				<form on:submit={handleSubmit}>

                <div class="search-player">
                    <img src="/person_search.svg" class="icon" alt="Person with magnifying glass">
                    <input bind:value={tag} id="search-input" class="search-input" type="text" placeholder="Search for a player...">
                    <img src="/search.svg" class="icon" alt="Magnifying glass">
                </div>
			</form>

            </div>
		</div>
	</div>
</CenteredDiv>

<style>
	h1 {
		font-size: 64px;
		margin: 0;
		margin-top: 100px;
		background: linear-gradient(150deg, #e51bbc 0%, #f5d254 100%);
      	background-clip: text;
      	-webkit-background-clip: text;
      	color: transparent;
	}


	h2 {
		font-size:48px;
		color:#ffc400;
		position:absolute;
		top:68px;
		left: 53%;
		transform:rotate(30deg);
		transition: all .5s ease;
	}

	h2:hover {
		font-size: 96px;
		top:16px;
		left: 49%;
		color: #f00;
	}

	h1, h2 {
		user-select: none;
	}

	a {
		text-decoration: none;
	}
</style>
