import React, { useEffect, useState } from 'react';

function App() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Artificial delay to demonstrate client-side loading
        setTimeout(() => {
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
                .then(response => response.json())
                .then(data => {
                    setPosts(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }, 1500);
    }, []);

    return (
        <>
            <header>
                <h1>simple-monolith</h1>
                <p className="subtitle">
                    A lightweight, bot-aware rendering framework.
                    Static for users. SSR for bots.
                </p>
            </header>

            <div className="card-grid">
                <div className="card">
                    <h3>⚡️ Blazing Fast</h3>
                    <p>Serves static HTML to real users for instant page loads and zero server overhead.</p>
                </div>
                <div className="card">
                    <h3>🤖 Bot Friendly</h3>
                    <p>Detects crawlers and serves fully rendered HTML via Puppeteer for perfect SEO.</p>
                </div>
                <div className="card">
                    <h3>📦 Monorepo Ready</h3>
                    <p>Built on Turbopack with clear separation of concerns: API, Frontend, and SSR.</p>
                </div>
            </div>

            <section className="data-section">
                <h2>Client-Side Data</h2>
                <p className="subtitle">
                    This section loads data from an external API on the client side.
                    <br />
                    If you are a bot, you will see the fully rendered content below!
                </p>

                {loading ? (
                    <div className="loading">Loading amazing content...</div>
                ) : (
                    <div className="card-grid">
                        {posts.map(post => (
                            <div key={post.id} className="card">
                                <h3>{post.title.substring(0, 30)}...</h3>
                                <p>{post.body.substring(0, 100)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default App;
