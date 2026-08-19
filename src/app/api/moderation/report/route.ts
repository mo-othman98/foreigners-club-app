import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { getUserBySessionToken } from "@/lib/auth-store";
import { createReport, type ReportReason } from "@/lib/moderation-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const body = await request.json();
  const reportedEmail = (body.reportedEmail as string | undefined)?.trim();
  const reportedName = (body.reportedName as string | undefined)?.trim() ?? "Unknown";
  const reason = (body.reason as ReportReason | undefined);
  const context = body.context as "profile" | "chat" | "message" | undefined;

  if (!reportedEmail || !reason || !context) {
    return NextResponse.json(
      { error: "reportedEmail, reason, and context are required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (reportedEmail === user.email) {
    return NextResponse.json({ error: "Cannot report yourself" }, { status: 400, headers: CORS_HEADERS });
  }

  const report = await createReport({
    reporterEmail: user.email,
    reportedEmail,
    reportedName,
    reason,
    details: body.details,
    context,
    contentId: body.contentId,
    contentText: body.contentText,
  });

  console.log(`[moderation] Report filed: ${user.email} → ${reportedEmail} (${reason})`);

  return NextResponse.json({ ok: true, reportId: report.id }, { status: 201, headers: CORS_HEADERS });
}
