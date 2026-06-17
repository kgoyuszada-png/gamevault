// Variant 1 — async/await ilə
import GamePlayer from "@/app/components/GamePlayer";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GamePlayer slug={slug} />;
}