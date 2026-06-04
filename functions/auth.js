export async function onRequest(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  
  // Redirect the user to GitHub's authorization screen
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  return Response.redirect(url, 302);
}