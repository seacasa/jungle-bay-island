// Public mirror of the live function at https://memetics.wtf/api/hello
// memetics.wtf api-lane probe · frame play v1 · staged 2026-08-23
// Proves two things at once, and each would read DIFFERENTLY if false:
//   1. Files in api/ deploy as Vercel functions on THIS project (a static
//      repo with no package.json). If not: /api/hello serves the box's
//      answer through the /api/:path* rewrite instead of this JSON.
//   2. The filesystem wins over the rewrite for a path it owns, per the
//      current Vercel doc (read 2026-08-23): "precedence is given to the
//      filesystem prior to rewrites being applied."
//      vercel.com/docs/project-configuration/vercel-json
// The `node` field is the discriminator: the box runs Bun behind
// junglebayisland.lat; only a Vercel Node function answers with process.version.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    lane: 'memetics-api',
    probe: 'frame-hello-v1',
    node: process.version
  });
};
