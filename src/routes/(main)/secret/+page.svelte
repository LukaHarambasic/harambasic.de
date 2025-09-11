<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		authenticateUser,
		createSession,
		getSession,
		clearSession,
		getAuthErrorMessage,
		validateAuthForm
	} from '$lib/services/secretAuth';
	import {
		processContentList,
		decryptSecretContent,
		getContentErrorMessage
	} from '$lib/services/secretContent';
	import type { AuthFormData, SecretContentMeta, SecretContent } from '$lib/types/secret';
	import type { EncryptedData } from '$lib/util/encryption';

	// Component state
	let authState: 'login' | 'loading' | 'content-list' | 'content-detail' = 'login';
	let isLoading = false;
	let errorMessage = '';
	let userIdentifier = '';

	// Authentication form data
	let formData: AuthFormData = {
		identifier: '',
		word1: '',
		word2: '',
		word3: ''
	};

	// Content state
	let contentList: SecretContentMeta[] = [];
	let currentContent: SecretContent | null = null;

	// Mock encrypted data - in real implementation, this would be fetched from server
	let encryptedUsers: EncryptedData | null = null;
	let encryptedContents: Array<{ slug: string; data: EncryptedData }> = [];

	// Load encrypted data from API endpoints
	async function loadEncryptedData() {
		try {
			// Load encrypted users
			const usersResponse = await fetch('/api/secret/users');
			if (usersResponse.ok) {
				encryptedUsers = await usersResponse.json();
			}

			// Load encrypted content
			const contentResponse = await fetch('/api/secret/content');
			if (contentResponse.ok) {
				encryptedContents = await contentResponse.json();
			}
		} catch (error) {
			console.error('Failed to load encrypted data:', error);
		}
	}

	// Session management
	onMount(async () => {
		if (browser) {
			// Load encrypted data first
			await loadEncryptedData();

			const session = getSession();
			if (session.valid) {
				userIdentifier = session.userIdentifier;
				authState = 'content-list';
				loadContentList();
			}
		}
	});

	// Form validation
	$: isFormValid =
		formData.identifier.trim() &&
		formData.word1.trim() &&
		formData.word2.trim() &&
		formData.word3.trim();

	// Handle authentication
	async function handleAuthentication() {
		if (!isFormValid || !encryptedUsers) {
			errorMessage = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// Validate form data
			if (!validateAuthForm(formData)) {
				errorMessage = 'Invalid form data';
				return;
			}

			// For demo purposes, using a fixed master password
			// In real implementation, this would be securely configured
			const masterPassword = 'demo-master-password-change-in-production';

			const result = await authenticateUser(encryptedUsers, formData, masterPassword);

			if (result.success) {
				userIdentifier = result.userIdentifier;
				createSession(userIdentifier);
				authState = 'content-list';
				await loadContentList();
			} else {
				errorMessage = getAuthErrorMessage(result.error);
			}
		} catch (error) {
			console.error('Authentication error:', error);
			errorMessage = 'Authentication failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Load content list
	async function loadContentList() {
		if (!userIdentifier || encryptedContents.length === 0) {
			contentList = [];
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// Use the user's passphrase as the content decryption key
			const passphrase = `${formData.word1} ${formData.word2} ${formData.word3}`.toLowerCase();

			const result = await processContentList(encryptedContents, passphrase);

			if (result.success) {
				contentList = result.data;
			} else {
				errorMessage = getContentErrorMessage(result.error);
				contentList = [];
			}
		} catch (error) {
			console.error('Content loading error:', error);
			errorMessage = 'Failed to load content list.';
			contentList = [];
		} finally {
			isLoading = false;
		}
	}

	// Load specific content
	async function loadContent(slug: string) {
		const encryptedContent = encryptedContents.find((c) => c.slug === slug);
		if (!encryptedContent) {
			errorMessage = 'Content not found';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const passphrase = `${formData.word1} ${formData.word2} ${formData.word3}`.toLowerCase();

			const result = await decryptSecretContent(encryptedContent.data, passphrase, slug);

			if (result.success) {
				currentContent = result.data;
				authState = 'content-detail';
			} else {
				errorMessage = getContentErrorMessage(result.error);
			}
		} catch (error) {
			console.error('Content detail error:', error);
			errorMessage = 'Failed to load content.';
		} finally {
			isLoading = false;
		}
	}

	// Navigation functions
	function goToContentList() {
		authState = 'content-list';
		currentContent = null;
		errorMessage = '';
	}

	function handleLogout() {
		clearSession();
		authState = 'login';
		userIdentifier = '';
		formData = { identifier: '', word1: '', word2: '', word3: '' };
		contentList = [];
		currentContent = null;
		errorMessage = '';
	}

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();
		handleAuthentication();
	}

	// Clear error message when user starts typing
	function clearError() {
		errorMessage = '';
	}

	// Format date for display
	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Secret Content Access</title>
	<meta name="description" content="Access private content with authentication" />
	<meta name="robots" content="noindex, nofollow" />
	<meta name="cache-control" content="no-store" />
</svelte:head>

<main class="secret-container">
	<!-- Authentication Form -->
	{#if authState === 'login'}
		<section class="auth-section">
			<header class="auth-header">
				<h1>Secret Content Access</h1>
				<p>Enter your credentials to access private content</p>
			</header>

			<form class="auth-form" on:submit={handleSubmit}>
				<div class="form-group">
					<label for="identifier">User Identifier</label>
					<input
						type="text"
						id="identifier"
						bind:value={formData.identifier}
						on:input={clearError}
						placeholder="Enter your identifier"
						autocomplete="username"
						required
					/>
				</div>

				<div class="passphrase-group">
					<p class="passphrase-label">3-Word Passphrase</p>

					<div class="words-container">
						<div class="form-group">
							<label for="word1">First Word</label>
							<input
								type="password"
								id="word1"
								bind:value={formData.word1}
								on:input={clearError}
								placeholder="First word"
								autocomplete="current-password"
								required
							/>
						</div>

						<div class="form-group">
							<label for="word2">Second Word</label>
							<input
								type="password"
								id="word2"
								bind:value={formData.word2}
								on:input={clearError}
								placeholder="Second word"
								autocomplete="current-password"
								required
							/>
						</div>

						<div class="form-group">
							<label for="word3">Third Word</label>
							<input
								type="password"
								id="word3"
								bind:value={formData.word3}
								on:input={clearError}
								placeholder="Third word"
								autocomplete="current-password"
								required
							/>
						</div>
					</div>
				</div>

				{#if errorMessage}
					<div class="error-message" role="alert">
						{errorMessage}
					</div>
				{/if}

				<button type="submit" class="auth-button" disabled={!isFormValid || isLoading}>
					{isLoading ? 'Authenticating...' : 'Access Content'}
				</button>
			</form>
		</section>
	{/if}

	<!-- Content List -->
	{#if authState === 'content-list'}
		<section class="content-section">
			<header class="content-header">
				<h1>Secret Content</h1>
				<div class="user-info">
					<span>Welcome, {userIdentifier}</span>
					<button type="button" class="logout-button" on:click={handleLogout}> Logout </button>
				</div>
			</header>

			{#if isLoading}
				<div class="loading">Loading content...</div>
			{:else if errorMessage}
				<div class="error-message" role="alert">
					{errorMessage}
				</div>
			{:else if contentList.length === 0}
				<div class="empty-state">
					<p>No secret content available.</p>
				</div>
			{:else}
				<div class="content-list">
					{#each contentList as content}
						<article class="content-item">
							<h2 class="content-title">
								<button
									type="button"
									class="content-link"
									on:click={() => loadContent(content.slug)}
								>
									{content.title}
								</button>
							</h2>

							<div class="content-meta">
								<time datetime={content.published.toISOString()}>
									{formatDate(content.published)}
								</time>

								{#if content.updated}
									<span class="updated">
										Updated: {formatDate(content.updated)}
									</span>
								{/if}

								{#if content.tags && content.tags.length > 0}
									<div class="tags">
										{#each content.tags as tag}
											<span class="tag">{tag}</span>
										{/each}
									</div>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Content Detail -->
	{#if authState === 'content-detail' && currentContent}
		<section class="content-detail">
			<header class="detail-header">
				<nav class="breadcrumb">
					<button type="button" class="back-button" on:click={goToContentList}>
						← Back to Content List
					</button>
					<button type="button" class="logout-button" on:click={handleLogout}> Logout </button>
				</nav>

				<h1>{currentContent.title}</h1>

				<div class="content-meta">
					<time datetime={currentContent.published.toISOString()}>
						Published: {formatDate(currentContent.published)}
					</time>

					{#if currentContent.updated}
						<time datetime={currentContent.updated.toISOString()}>
							Updated: {formatDate(currentContent.updated)}
						</time>
					{/if}

					{#if currentContent.tags && currentContent.tags.length > 0}
						<div class="tags">
							{#each currentContent.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			</header>

			{#if isLoading}
				<div class="loading">Loading content...</div>
			{:else if errorMessage}
				<div class="error-message" role="alert">
					{errorMessage}
				</div>
			{:else}
				<div class="content-body">
					<!-- Note: In a real implementation, you'd want to process markdown to HTML -->
					<pre class="markdown-content">{currentContent.content}</pre>
				</div>
			{/if}
		</section>
	{/if}
</main>

<style>
	.secret-container {
		margin: 0 auto;
		padding: 2rem;
		max-width: 800px;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	/* Authentication Styles */
	.auth-section {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		background: #f8f9fa;
	}

	.auth-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.auth-header h1 {
		margin-bottom: 0.5rem;
		color: #2c3e50;
		font-size: 2rem;
	}

	.auth-header p {
		color: #6c757d;
		font-size: 1rem;
	}

	.auth-form {
		margin: 0 auto;
		max-width: 400px;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: #495057;
		font-weight: 600;
	}

	.form-group input {
		padding: 0.75rem;
		width: 100%;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 1rem;
		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
	}

	.form-group input:focus {
		border-color: #007bff;
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	.passphrase-group {
		margin-bottom: 1.5rem;
	}

	.passphrase-label {
		margin-bottom: 1rem;
		color: #495057;
		font-weight: 600;
	}

	.words-container {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}

	@media (width >= 768px) {
		.words-container {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.auth-button {
		padding: 0.75rem;
		width: 100%;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 0.15s ease-in-out;
		cursor: pointer;
	}

	.auth-button:hover:not(:disabled) {
		background-color: #0056b3;
	}

	.auth-button:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	/* Content List Styles */
	.content-section {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		background: #fff;
	}

	.content-header {
		display: flex;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
		justify-content: space-between;
		align-items: center;
	}

	.content-header h1 {
		margin: 0;
		color: #2c3e50;
		font-size: 2rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: #6c757d;
		font-size: 0.9rem;
	}

	.logout-button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		background-color: #dc3545;
		color: white;
		font-size: 0.875rem;
		transition: background-color 0.15s ease-in-out;
		cursor: pointer;
	}

	.logout-button:hover {
		background-color: #c82333;
	}

	.content-list {
		display: grid;
		gap: 1.5rem;
	}

	.content-item {
		padding: 1.5rem;
		border: 1px solid #e9ecef;
		border-radius: 6px;
		transition: box-shadow 0.15s ease-in-out;
	}

	.content-item:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.content-title {
		margin: 0 0 1rem;
		font-size: 1.25rem;
	}

	.content-link {
		padding: 0;
		border: none;
		background: none;
		color: #007bff;
		font-size: inherit;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}

	.content-link:hover {
		color: #0056b3;
		text-decoration: underline;
	}

	.content-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		color: #6c757d;
		font-size: 0.875rem;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
	}

	.tag {
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		background-color: #e9ecef;
		color: #495057;
		font-size: 0.75rem;
	}

	/* Content Detail Styles */
	.content-detail {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		background: #fff;
	}

	.detail-header {
		margin-bottom: 2rem;
	}

	.breadcrumb {
		display: flex;
		margin-bottom: 1rem;
		justify-content: space-between;
		align-items: center;
	}

	.back-button {
		padding: 0.5rem 0;
		border: none;
		background: none;
		color: #007bff;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.back-button:hover {
		color: #0056b3;
		text-decoration: underline;
	}

	.detail-header h1 {
		margin: 0 0 1rem;
		color: #2c3e50;
		font-size: 2rem;
	}

	.content-body {
		color: #343a40;
		line-height: 1.6;
	}

	.markdown-content {
		margin: 0;
		font-family: inherit;
		font-size: 1rem;
		white-space: pre-wrap;
	}

	/* Utility Styles */
	.loading {
		padding: 2rem;
		color: #6c757d;
		font-style: italic;
		text-align: center;
	}

	.error-message {
		margin-bottom: 1rem;
		padding: 0.75rem;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
		background-color: #f8d7da;
		color: #721c24;
	}

	.empty-state {
		padding: 2rem;
		color: #6c757d;
		text-align: center;
	}

	.updated {
		font-style: italic;
	}
</style>
