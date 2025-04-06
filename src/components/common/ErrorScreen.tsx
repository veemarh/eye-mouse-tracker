export function ErrorScreen({error, session}: { error: string, session: any }) {
    return (
        <>
            <h1>{error}</h1>
            <div>
                {!session ? <div>Session not found.</div> : <div>Something went wrong.</div>}
                <button onClick={() => window.location.reload()}>Reload the page</button>
            </div>
        </>
    )
}
