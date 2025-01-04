<script lang="ts">
	import Icon from '@iconify/svelte';
	import BaseToClipboardButton from '$lib/components/Base/BaseToClipboardButton.svelte';
	import { getRandomItems } from '$lib/util/helper';
	import type { Project } from '$lib/types/project';
	import type { UsesEntry } from '$lib/types/usesEntry';
	import type { Post } from '$lib/types/post';
	import type { PageData } from './$types';
	// import type { Shareable } from '$lib/types/shareable'

	// TODO: remove eager and only load images that got randomly selected
	const pictures = import.meta.glob(
		'../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../assets/img/projects/${name}`];
		if (!image) {
			return {};
		}
		return image.default;
	};

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const [posts] = data.posts;
	const [projects] = data.projects;
	const [uses] = data.uses;
	// const [shareables] = data.shareables

	const randomProjects: Project[] = getRandomItems(projects, 2);
	const randomUses: UsesEntry[] = getRandomItems(uses, 3);
	const randomPosts: Post[] = getRandomItems(posts, 2);
	// const randomShareables: Shareable[] = getRandomItems(shareables, 4)
</script>

<section class="heyho">
	<div class="inner">
		<enhanced:img
			src="../../assets/img/profile.jpeg?w=1280;640;400"
			sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
			alt="Profile of Luka Harambasic"
			class="profile"
		/>
		<div class="content rich-text">
			<h2>Heyho, I'm Luka!</h2>
			<p>
				I'm a German/Croatian, based in the beautiful Copenhagen (Denmark). At <a
					href="https://monta.com/">Monta</a
				>, I work as a Product Manger (Home Energy Management). Feel free to explore my past
				<a href="/projects">projects</a>
				or check out my <a href="https://www.linkedin.com/in/harambasic/">LinkedIn profile</a>. If
				you want to <a href="#contact">chat</a>, just start a conversation about handball,
				woodworking, cooking, sustainability, or dive into product and tech topics.
			</p>
		</div>
	</div>
</section>
<section class="featured">
	<h2>Explore</h2>
	<div class="posts group">
		<h3 class="section-label">
			<span>Posts</span>
			<Icon icon="ph:files-bold" />
		</h3>
		<ul>
			{#each randomPosts as post}
				<li>
					<a class="card text" href={post.relativePath}>
						<Icon icon="ph:arrow-circle-right-bold" />
						<strong>{post.title}</strong>
						<time class="date dt-published" datetime={post?.published?.raw?.toString()}>
							{post.published.display}
						</time>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<div class="lists group">
		<h3 class="section-label">
			<span>Uses</span>
			<Icon icon="ph:clipboard-text-bold" />
		</h3>
		<ul>
			{#each randomUses as usesEntry}
				<li>
					<a class="card text" href={usesEntry.url}>
						<Icon icon="ph:arrow-square-out-bold" />
						<strong>{usesEntry.title}</strong>
						<p>{usesEntry.description}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<div class="project group">
		<h3 class="section-label">
			<span>Projects</span>
			<Icon icon="ph:projector-screen-chart-bold" />
		</h3>
		<ul>
			{#each randomProjects as project}
				<li>
					<a class="card no-spacing image" href="/projects?slug={project.slug}">
						<Icon icon="ph:arrow-circle-right-bold" />
						<enhanced:img
							src={getImage(project.image)}
							sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
							alt={project.title}
						/>
						<div class="content">
							<strong>{project.title}</strong>
							<p>{project.description}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<!-- <div class="shareables group">
    <h3 class="section-label">
      <span>Shareables</span>
      <Icon icon="ph:share-bold" />
    </h3>
    <ul>
      {#each randomShareables as shareable}
        <li>
          <a class="card text" href={shareable.url}>
            <Icon icon="ph:arrow-square-out-bold" />
            <strong>{shareable.title}</strong>
            <time class="date dt-published" datetime={shareable?.published?.raw?.toString()}>
              {shareable.published.display}
            </time>
          </a>
        </li>
      {/each}
    </ul>
  </div> -->
</section>
<section class="contact" id="contact">
	<div class="group">
		<div class="meta">
			<strong>E-Mail</strong>
			<small>luka@harambasic.de</small>
		</div>
		<div class="segmented-buttons">
			<a href="mailto:luka@harambasic.de" class="button">Write</a>
			<BaseToClipboardButton toClipboard="luka@harambasic.de">Copy</BaseToClipboardButton>
		</div>
	</div>
	<div class="group">
		<div class="meta">
			<strong>Socials</strong>
			<small>Get in touch!</small>
		</div>
		<div class="segmented-buttons">
			<a
				href="https://signal.me/#eu/nEQUfJVmtAbHirhDccRIQMkqWOiIiq2/7VROG9o/YrlzrC9ejHlCxYgFg1HMGx2B"
				class="button">Signal</a
			>
			<a href="https://www.linkedin.com/in/harambasic/" class="button">LinkedIn</a>
			<a href="https://twitter.com/luka_harambasic" class="button">Twitter</a>
			<a href="https://github.com/LukaHarambasic" class="button">GitHub</a>
		</div>
	</div>
	<div class="group">
		<div class="meta">
			<strong>Book a time</strong>
			<small>Wanna talk?</small>
		</div>
		<div class="segmented-buttons">
			<a href="https://cal.com/luhara/1" class="button">Book</a>
		</div>
	</div>
</section>

<style lang="postcss">
	.heyho {
		display: flex;
		position: relative;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		width: var(--layout-l);
		margin: var(--xl) 0;
		@media screen and (max-width: 56rem) {
			width: 100%;
		}
		.inner {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: flex-start;
			gap: var(--l);
			@media screen and (max-width: 44rem) {
				flex-direction: column;
			}
			.profile {
				size: 14.5rem;
				border-radius: var(--border-radius);
				@media screen and (max-width: 32rem) {
					width: 100%;
					height: auto;
				}
			}
			.content {
				h2 {
					margin: 0 0 0.5rem 0;
					font-weight: 900;
					font-size: var(--font-l);
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
				p {
					font-weight: normal;
					line-height: 1.5;
					a {
						line-break: loose;
					}
				}
			}
		}
	}
	.featured {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		width: 100%;
		h2 {
			margin: var(--xl) 0 var(--m) 0;
			font-weight: 900;
			font-size: var(--font-xl);
			line-height: 1.2;
			font-family: var(--font-family);
			letter-spacing: var(--font-letter-spacing-headline);
			text-align: center;
		}
		.group {
			position: relative;
			@media screen and (max-width: 86rem) {
				position: static;
			}
			h3 {
				display: flex;
				position: absolute;
				top: 1.8rem;
				left: -11rem;
				flex-wrap: nowrap;
				align-content: center;
				justify-content: flex-end;
				align-items: center;
				gap: 0.25rem;
				width: 10rem;
				height: 1.5rem;
				font-weight: 600;
				font-size: var(--font-m);
				font-family: var(--font-family);
				letter-spacing: var(--font-letter-spacing-headline);
				text-align: right;
				@media screen and (max-width: 86rem) {
					position: static;
					top: none;
					left: none;
					width: 100%;
					height: auto;
					justify-content: flex-start;
					text-align: center;
					margin: 0 0 var(--m) var(--xs);
				}
				span {
					line-height: 1;
				}
				:global(svg) {
					size: 1.5rem;
				}
			}
			> ul {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: stretch;
				gap: var(--l);
				@media screen and (max-width: 68rem) {
					flex-wrap: wrap;
				}
				> li {
					flex: 1 1 auto;
					&:first-child:nth-last-child(1),
					&:first-child:nth-last-child(1) ~ li {
						width: 100%;
					}
					&:first-child:nth-last-child(2),
					&:first-child:nth-last-child(2) ~ li {
						width: calc(100% / 2);
						@media screen and (max-width: 68rem) {
							width: 100%;
						}
					}
					&:first-child:nth-last-child(3),
					&:first-child:nth-last-child(3) ~ li {
						width: calc(100% / 3);
						@media screen and (max-width: 60rem) {
							width: 100%;
						}
					}
					&:first-child:nth-last-child(4),
					&:first-child:nth-last-child(4) ~ li {
						width: calc(100% / 4);
						@media screen and (max-width: 60rem) {
							width: 100%;
						}
					}
					.card {
						display: block;
						position: relative;
						transition: var(--transition);
						border-radius: var(--border-radius);
						background: var(--c-surface);
						height: 100%;
						color: var(--c-font);
						text-decoration: none;
						&:hover {
							transform: scale(0.97);
							cursor: pointer;
							cursor: pointer;
							:global(svg) {
								opacity: 1;
							}
						}
						:global(svg) {
							size: var(--l);
							position: absolute;
							top: var(--m);
							right: calc((-1) * var(--m));
							opacity: 0;
							transition: var(--transition);
							border: 4px solid var(--c-light);
							border-radius: 100%;
							background: var(--c-light);
							z-index: 1000;
						}
						&.text {
							padding: var(--l);
						}
						&.image {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							align-content: stretch;
							justify-content: flex-start;
							align-items: stretch;
							gap: 0;
							@media screen and (max-width: 32rem) {
								flex-direction: column;
							}
							&:hover {
								> picture {
									source,
									img {
										filter: grayscale(0);
										opacity: 1;
									}
								}
							}
							> picture {
								width: 12rem;
								height: 12rem;
								@media screen and (max-width: 32rem) {
									width: 100%;
									height: auto;
								}
								img {
									width: inherit;
									height: inherit;
									border-radius: var(--border-radius) 0 0 var(--border-radius);
									aspect-ratio: 1 / 1;
									filter: grayscale(1);
									opacity: 0.5;
									@media screen and (max-width: 32rem) {
										border-radius: var(--border-radius) var(--border-radius) 0 0;
									}
								}
							}
							> .content {
								padding: var(--l);
								display: flex;
								flex-direction: column;
								flex-wrap: nowrap;
								justify-content: flex-start;
								align-content: stretch;
								align-items: stretch;
							}
						}
					}
					> a {
						strong {
							display: block;
							font-weight: 900;
							font-size: var(--font-m);
							line-height: 1.2;
							font-family: var(--font-family);
							letter-spacing: var(--font-letter-spacing-headline);
						}
						time {
							display: inline-block;
							margin: 0 0 var(--xs) 0;
							font-weight: 400;
							font-size: var(--font-s);
							text-decoration: none;
							font-style: italic;
						}
						p {
							margin: var(--xs) 0 0 0;
							line-height: 1.5;
							font-size: var(--font-m);
						}
					}
				}
			}
		}
	}
	.contact {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		width: var(--layout-m);
		margin: var(--xl) 0;
		@media screen and (max-width: 46rem) {
			width: 100%;
		}
		.group {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: space-between;
			align-items: flex-start;
			border-bottom: 1px solid var(--c-surface);
			padding: var(--l);
			@media screen and (max-width: 40rem) {
				flex-direction: column;
				gap: var(--l);
			}
			.meta {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: stretch;
				strong {
					margin: 0 0 var(--xs) 0;
					font-weight: 900;
					font-size: var(--font-m);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
				small {
					font-size: var(--font-s);
				}
			}
		}
	}
</style>
