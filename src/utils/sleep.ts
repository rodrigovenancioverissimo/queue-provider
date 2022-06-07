export default async function sleep({ ms }: { ms: number }) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
