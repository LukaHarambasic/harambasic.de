<footer>
	<ul>
		<li><a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a></li>
		<li><a href="https://github.com/LukaHarambasic">GitHub</a></li>
		<li><a href="https://twitter.com/luka_harambasic">Twitter</a></li>
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
		align-content: stretch;
		justify-content: space-between;
		align-items: flex-start;
		@media screen and (max-width: 42rem) {
			flex-direction: column;
			align-items: center;
			gap: var(--m);
		}
	}
	ul {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: flex-start;
		gap: var(--m);
		@media screen and (max-width: 42rem) {
			flex-wrap: wrap;
		}
		@media screen and (max-width: 32rem) {
			flex-direction: column;
			align-items: center;
		}
		li {
			a {
				color: var(--c-font);
				text-decoration: none;
				font-size: var(--font-m);
			}
		}
	}
</style>
