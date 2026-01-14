export default function Navbar() {
  return (
    <div className="nav">
      <div className="navInner">
        <a className="brand" href="/">
          <span className="brandDot" />
          <span>PHISHLENS</span>
        </a>

        <div className="links">
          <a href="/demo">Demo</a>
          <a href="/xai">Explainability</a>
          <a href="/metrics">Metrics</a>
          <a href="/about">About</a>
        </div>
      </div>
    </div>
  );
}
