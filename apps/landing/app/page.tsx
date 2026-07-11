export default function HomePage() {
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <div className="brand">
            <span className="mark">X</span>
            CURVAX
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn btn-ghost" href="https://docs.pears.com" target="_blank" rel="noreferrer">
              Pears docs
            </a>
            <a className="btn btn-primary" href="#install">
              Download app
            </a>
          </div>
        </nav>

        <section className="hero">
          <div>
            <p className="eyebrow">Tether Developers Cup · Pears track</p>
            <h1>The stand has no server.</h1>
            <p>
              CURVAX is a true peer-to-peer matchday experience: live crowd pulse, synchronized chant circles, 
              cryptographic prediction seals, and immortal match capsules — powered by Hyperswarm, Hypercore, 
              and Corestore. Not a chat wrapper. A stadium atmosphere for fans worldwide.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#install">
                Download CURVAX
              </a>
              <a className="btn btn-ghost" href="#how">
                How it works
              </a>
            </div>
          </div>

          <div className="card pitch">
            <div className="inner">
              <p className="eyebrow">Live match energy</p>
              <div className="energy">84</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>Brazil vs Germany · Room CV-7K2MPQ</p>
              <p style={{ color: 'var(--mint)', margin: 0, fontWeight: 700 }}>12 fans connected peer-to-peer</p>
            </div>
          </div>
        </section>

        <section className="grid3" id="how">
          <article className="card">
            <h3>Pulse</h3>
            <p>
              Fans emit GOAL / SAVE / ROAR events over encrypted Hyperswarm connections. Energy aggregates 
              into a living waveform — the feeling of a stadium stand, not a comment thread.
            </p>
          </article>
          <article className="card">
            <h3>Seals</h3>
            <p>
              Pre-match predictions append to your personal Hypercore. One seal per room. History is 
              append-only and cryptographically verifiable — no one can rewrite your picks.
            </p>
          </article>
          <article className="card">
            <h3>Capsule</h3>
            <p>
              After full time, export a discovery key for the match&apos;s append-only log. Seed the memory. 
              Keep tournament folklore alive without cloud storage or corporate silos.
            </p>
          </article>
        </section>

        <section className="section" id="install">
          <h2>Install & run</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '60ch' }}>
            CURVAX is a desktop app using Electron + pear-runtime. Real Hyperswarm networking isn&apos;t 
            browser-native, so you run it locally. Zero servers. Pure peer-to-peer.
          </p>
          <pre>{`# Clone the repository
git clone https://github.com/yourusername/tether.git
cd tether/apps/curvax

# Install dependencies
npm install

# Start the app
npm run dev

# Test peer-to-peer (open a second terminal):
npm run dev
# Instance A: Create room → copy code (CV-XXXXXX)
# Instance B: Join with that code → fire GOAL → watch energy sync!`}</pre>
        </section>

        <section className="section">
          <h2>Stack (Pears track eligibility)</h2>
          <div className="grid3">
            <article className="card">
              <h3>Hyperswarm</h3>
              <p>
                Distributed peer discovery + encrypted connections. Room topics derived from user codes. 
                DHT-based rendezvous without central coordination.
              </p>
            </article>
            <article className="card">
              <h3>Corestore / Hypercore</h3>
              <p>
                Append-only logs for identity, prediction seals, and match history. Local-first storage 
                with cryptographic verification and network replication.
              </p>
            </article>
            <article className="card">
              <h3>pear-runtime</h3>
              <p>
                Bare worker runs all P2P logic. React/TypeScript UI communicates through secure IPC. 
                Clean separation between network layer and presentation.
              </p>
            </article>
          </div>
        </section>

        <footer className="footer">
          <span>CURVAX · MIT License · Built for Tether Developers Cup</span>
          <span>Theme: Football · Track: Pears</span>
        </footer>
      </div>
    </main>
  )
}
