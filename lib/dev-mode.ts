/**
 * Dev Webhook Mode utility.
 *
 * When DEV_WEBHOOK_MODE=true:
 *   - Webhook signature validation is skipped
 *   - DM sending is logged to console instead of calling Instagram API
 *   - The /api/dev/simulate-webhook route is enabled
 *
 * For production, set DEV_WEBHOOK_MODE=false (or remove it).
 * No code changes or refactoring needed — just flip the env var.
 */

export function isDevWebhookMode(): boolean {
  return process.env.DEV_WEBHOOK_MODE === 'true'
}

/**
 * Log a simulated DM send (used in dev mode instead of calling IG API).
 */
export function logDevDM(params: {
  igUserId: string
  recipientId: string
  messageText: string
  messageIndex: number
  totalMessages: number
  interactionId: string
  campaignId: string
}) {
  console.log(
    '\n' +
    '╔══════════════════════════════════════════════════════════╗\n' +
    '║  📬 DEV MODE — DM NOT SENT (logged only)               ║\n' +
    '╠══════════════════════════════════════════════════════════╣\n' +
    `║  IG User ID:      ${params.igUserId}\n` +
    `║  Recipient:       ${params.recipientId}\n` +
    `║  Message (${params.messageIndex + 1}/${params.totalMessages}):  ${params.messageText.substring(0, 60)}${params.messageText.length > 60 ? '...' : ''}\n` +
    `║  Interaction ID:  ${params.interactionId}\n` +
    `║  Campaign ID:     ${params.campaignId}\n` +
    '╚══════════════════════════════════════════════════════════╝\n'
  )
}

/**
 * Log a simulated comment reply (used in dev mode).
 */
export function logDevCommentReply(params: {
  commentId: string
  replyMessage: string
}) {
  console.log(
    '\n' +
    '╔══════════════════════════════════════════════════════════╗\n' +
    '║  💬 DEV MODE — COMMENT REPLY NOT SENT (logged only)     ║\n' +
    '╠══════════════════════════════════════════════════════════╣\n' +
    `║  Comment ID:  ${params.commentId}\n` +
    `║  Reply:       ${params.replyMessage.substring(0, 50)}${params.replyMessage.length > 50 ? '...' : ''}\n` +
    '╚══════════════════════════════════════════════════════════╝\n'
  )
}
