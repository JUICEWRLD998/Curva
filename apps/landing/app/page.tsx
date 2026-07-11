export default function HomePage() {
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <div className="brand">
            <span className="mark">C</span>
            CURVA
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn btn-ghost" href="https://docs.pears.com" target="_blank" rel="noreferrer">
              Pears docs
            </a>
            <a className="btn btn-primary" href="#install">
              Install app
            </a>
          </div>
        </nav>

        <section className="hero">
          <div>
            <p className="eyebrow">Tether Developers Cup · Pears track</p>
            <h1>The stand has no server.</h1>
            <p>
              CURVA is a real peer-to-peer matchday product: live crowd pulse, chant circles, sealed
              predictions, and immortal match capsules — powered by Hyperswarm, Hypercore, and Corestore.
              Not a chat wrapper. A stadium body for fans worldwide.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#install">
                Run on your machine
              </a>
              <a className="btn btn-ghost" href="#how">
                How it works
              </a>
            </div>
          </div>

          <div className="card pitch">
            <div className="inner">
              <p className="eyebrow">Crowd energy</p>
              <div className="energy">84</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>Brazil vs Germany · CV-7K2MPQ</p>
              <p style={{ color: 'var(--mint)', margin: 0, fontWeight: 700 }}>12 fans in the curva</p>
            </div>
          </div>
        </section>

        <section className="grid3" id="how">
          <article className="card">
            <h3>Pulse</h3>
            <p>
              Fans emit GOAL / SAVE / ROAR events over encrypted Hyperswarm links. Energy aggregates into a
              living waveform — the feeling of a stand, not a comment thread.
            </p>
          </article>
          <article className="card">
            <h3>Seals</h3>
            <p>
              Pre-match picks append to a personal Hypercore. One seal per room. History is append-only —
              no host can quietly rewrite your pick.
            </p>
          </article>
          <article className="card">
            <h3>Capsule</h3>
            <p>
              After full time, export a discovery key for the night&apos;s append-only log. Seed the memory.
              Keep tournament folklore alive without cloud storage bills.
            </p>
          </article>
        </section>

        <section className="section" id="install">
          <h2>Install & run</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '60ch' }}>
            Real Pears networking requires the desktop app (Hyperswarm is not browser-native). This site is
            the public front door — the product is the Electron + pear-runtime app in <code>apps/curva</code>.
          </p>
          <pre>{`git clone <your-repo-url>
cd tether/apps/curva
npm install
npm run dev

# open a second instance to join the same room code
# Instance A: Create room → copy CV-XXXXXX
# Instance B: Join with that code → fire GOAL`}</pre>
        </section>

        <section className="section">
          <h2>Stack (eligibility)</h2>
          <div className="grid3">
            <article className="card">
              <h3>Hyperswarm</h3>
              <p>Room discovery + encrypted peer links. Topic derived from room code.</p>
            </article>
            <article className="card">
              <h3>Corestore / Hypercore</h3>
              <p>Identity, prediction seals, and match capsule persistence.</p>
            </article>
            <article className="card">
              <h3>pear-runtime</h3>
              <p>Bare worker owns all P2P logic. React/TS UI talks only through a secure bridge.</p>
            </article>
          </div>
        </section>

        <footer className="footer">
          <span>CURVA · MIT · Built for Tether Developers Cup</span>
          <span>Theme: football · Track: Pears</span>
        </footer>
      </div>
    </main>
  )
}
