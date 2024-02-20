function fetchWithRetry(constructor, tries) {
    return constructor().catch((error) => {
        if (tries <= 0) {
            return Promise.reject(error);
        }

        tries--;

        return fetchWithRetry(constructor, tries);
    })
}

fetchWithRetry(() => fetch('https://jsonplaceholder.typicode.com/posts'), 3).then(console.log, console.error);
