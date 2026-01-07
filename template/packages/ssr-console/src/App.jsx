import React, { useState } from 'react';

function App() {
    const [path, setPath] = useState('/');
    const [userAgent, setUserAgent] = useState('Simple-Monolith-Bot/1.0');
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'

    const handleRender = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setHtml('');

        try {
            const response = await fetch(`http://localhost:8080/render?url=${encodeURIComponent(path)}&ua=${encodeURIComponent(userAgent)}`);
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            const data = await response.text();
            setHtml(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header>
                <h1>SSR Console 🖥️</h1>
                <p>Debug your server-side rendered pages.</p>
            </header>

            <main>
                <section>
                    <form onSubmit={handleRender}>
                        <div className="grid">
                            <div>
                                <label htmlFor="path">Path or URL</label>
                                <input
                                    type="text"
                                    id="path"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                    placeholder="/ or http://example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="ua">User Agent (Simulation)</label>
                                <input
                                    type="text"
                                    id="ua"
                                    value={userAgent}
                                    onChange={(e) => setUserAgent(e.target.value)}
                                    placeholder="Googlebot, etc."
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Rendering...' : 'Render'}
                        </button>
                        <small>Enter a relative path (e.g., /) or a full URL to test external sites.</small>
                    </form>
                </section>

                {error && (
                    <article className="error">
                        <header>Error</header>
                        {error}
                    </article>
                )}

                {html && (
                    <section>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Output</h3>
                            <div role="group">
                                <button
                                    className={viewMode === 'preview' ? '' : 'outline'}
                                    onClick={() => setViewMode('preview')}
                                >Preview</button>
                                <button
                                    className={viewMode === 'code' ? '' : 'outline'}
                                    onClick={() => setViewMode('code')}
                                >HTML Source</button>
                            </div>
                        </header>

                        {viewMode === 'code' ? (
                            <div className="result-box">
                                <pre><code>{html}</code></pre>
                            </div>
                        ) : (
                            <div className="preview-box">
                                <iframe
                                    srcDoc={html}
                                    title="SSR Preview"
                                    sandbox="allow-scripts" // careful with this
                                />
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default App;
