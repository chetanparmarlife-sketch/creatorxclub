import { Badge, Card, CardContent, CardHeader, CardTitle } from "@creatorx/ui";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-canvas p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>CreatorX Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#6B6B7B]">
            Next.js 15 App Router scaffold. Admin queues and controls will be implemented in Phase 7.
          </p>
          <Badge>System scaffold ready</Badge>
        </CardContent>
      </Card>
    </main>
  );
}
