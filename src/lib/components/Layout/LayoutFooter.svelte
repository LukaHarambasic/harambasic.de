<footer>
	<ul>
		<li><a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a></li>
		<li><a href="https://github.com/LukaHarambasic">GitHub</a></li>
		<li><a href="https://bsky.app/profile/harambasic.de">BlueSky</a></li>
	</ul>
	<ul>
		<li><a href="/imprint">Imprint</a></li>
		<li><a href="/data-privacy">Data Privacy</a></li>
		<li><a href="/#contact">Contact</a></li>
	</ul>
</footer>

<style lang="postcss">
	footer {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		align-content: stretch;
		@media screen and (width <= 42rem) {
			flex-direction: column;
			align-items: center;
			gap: var(--m);
		}
	}
	ul {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: stretch;
		gap: var(--m);
		@media screen and (width <= 42rem) {
			flex-wrap: wrap;
		}
		@media screen and (width <= 32rem) {
			flex-direction: column;
			align-items: center;
		}
		li {
			a {
				color: var(--c-font);
				font-size: var(--font-m);
				text-decoration: none;
			}
		}
	}
</style>
