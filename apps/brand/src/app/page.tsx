import { Button, Card, CardContent, CardHeader, CardTitle } from "@creatorx/ui";

export default function BrandHome() {
  return (
    <main className="min-h-screen bg-canvas p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>CreatorX Brand Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#6B6B7B]">
            Next.js 15 App Router scaffold. Brand screens will be wired from the Mowgli references in Phase 6.
          </p>
          <Button>Open dashboard</Button>
        </CardContent>
      </Card>
    </main>
  );
}
