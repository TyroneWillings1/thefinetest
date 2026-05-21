const SUPABASE_URL = "https://cwchbeqfhxdsumbrtgen.supabase.co";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function env(name) {
  return Netlify.env.get(name);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function supabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

async function getRows(path, serviceRoleKey) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: supabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function patchRow(path, body, serviceRoleKey) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: {
      ...supabaseHeaders(serviceRoleKey),
      Prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function getOwnerEmail(ownerId, serviceRoleKey) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${ownerId}`, {
    headers: supabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const user = await response.json();
  return user.email || "";
}

function buildEmail({ submission, test, answers, adminUrl }) {
  const name = submission.name || "Anonymous";
  const answerRows = answers
    .map(
      (answer) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(answer.question_prompt)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(answer.option_label)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;text-align:right;">${Number(answer.points || 0)}</td>
        </tr>
      `
    )
    .join("");

  const subject = `${name} scored ${submission.percent}% on ${test.title}`;
  const text = [
    `New compatibility result for ${test.title}`,
    ``,
    `Name: ${name}`,
    `Score: ${submission.percent}% (${submission.score}/${submission.max_score})`,
    `Result: ${submission.result_tier}`,
    submission.result_message ? `Message: ${submission.result_message}` : "",
    ``,
    `View results: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#ffffff;color:#111827;">
      <div style="padding:28px;border-radius:16px;background:#050505;color:#ffffff;">
        <p style="margin:0 0 12px;color:#67e8f9;font-size:12px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;">thefinetest</p>
        <h1 style="margin:0;font-size:30px;line-height:1.1;">New compatibility result</h1>
        <p style="margin:16px 0 0;color:#d4d4d8;font-size:16px;">${escapeHtml(name)} submitted ${escapeHtml(test.title)}.</p>
      </div>
      <div style="padding:24px 0;">
        <div style="display:inline-block;margin-right:16px;">
          <div style="font-size:48px;font-weight:900;line-height:1;color:#050505;">${Number(submission.percent || 0)}%</div>
          <div style="margin-top:8px;color:#0891b2;font-size:20px;font-weight:900;">${escapeHtml(submission.result_tier)}</div>
        </div>
        <p style="color:#374151;font-size:15px;line-height:1.6;">Score: ${Number(submission.score || 0)} out of ${Number(submission.max_score || 0)}</p>
        ${submission.result_message ? `<p style="color:#374151;font-size:15px;line-height:1.6;">${escapeHtml(submission.result_message)}</p>` : ""}
        <p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;margin-top:8px;padding:12px 16px;border-radius:999px;background:#050505;color:#ffffff;text-decoration:none;font-weight:800;">Open results</a></p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="padding:12px;border-bottom:2px solid #111827;text-align:left;color:#111827;">Question</th>
            <th style="padding:12px;border-bottom:2px solid #111827;text-align:left;color:#111827;">Answer</th>
            <th style="padding:12px;border-bottom:2px solid #111827;text-align:right;color:#111827;">Points</th>
          </tr>
        </thead>
        <tbody>${answerRows}</tbody>
      </table>
    </div>
  `;

  return { subject, text, html };
}

async function sendEmail({ to, subject, text, html }) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("RESULTS_EMAIL_FROM");

  if (!apiKey || !from) {
    return { skipped: true, reason: "Email environment variables are not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export default async (request) => {
  if (request.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    return json({ ok: false, skipped: true, reason: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, 202);
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const submissionId = String(payload.submissionId || "");
  if (!UUID_PATTERN.test(submissionId)) {
    return json({ error: "Invalid submission id." }, 400);
  }

  try {
    const [submission] = await getRows(
      `compatibility_submissions?id=eq.${submissionId}&select=id,test_id,name,score,max_score,percent,result_tier,result_message,created_at,notification_sent_at`,
      serviceRoleKey
    );

    if (!submission) {
      return json({ error: "Submission not found." }, 404);
    }

    if (submission.notification_sent_at) {
      return json({ ok: true, skipped: true, reason: "Notification already sent." });
    }

    const [test] = await getRows(
      `compatibility_tests?id=eq.${submission.test_id}&select=id,title,public_id,owner_id`,
      serviceRoleKey
    );

    if (!test) {
      return json({ error: "Test not found." }, 404);
    }

    const [answers, ownerEmail] = await Promise.all([
      getRows(
        `compatibility_answers?submission_id=eq.${submission.id}&select=question_prompt,option_label,points,created_at&order=created_at.asc`,
        serviceRoleKey
      ),
      getOwnerEmail(test.owner_id, serviceRoleKey),
    ]);

    const to = env("RESULTS_EMAIL_TO") || ownerEmail;
    if (!to) {
      return json({ ok: false, skipped: true, reason: "No recipient email found." }, 202);
    }

    const origin = env("SITE_URL") || new URL(request.url).origin;
    const adminUrl = `${origin}/compatible/${test.public_id}`;
    const email = buildEmail({ submission, test, answers, adminUrl });
    const emailResult = await sendEmail({ to, ...email });

    if (!emailResult.skipped) {
      await patchRow(
        `compatibility_submissions?id=eq.${submission.id}`,
        { notification_sent_at: new Date().toISOString() },
        serviceRoleKey
      );
    }

    return json({ ok: true, ...emailResult });
  } catch (error) {
    console.error("notify-result failed", error);
    return json({ ok: false, error: "Notification failed." }, 500);
  }
};

export const config = {
  path: "/api/notify-result",
  method: ["POST", "OPTIONS"],
};
