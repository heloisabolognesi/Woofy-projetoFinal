export const roles = ["tutor", "veterinario", "admin"] as const
export const approvalStatuses = ["pending", "approved", "rejected"] as const

export type UserRole = (typeof roles)[number]
export type ApprovalStatus = (typeof approvalStatuses)[number]

export const defaultRole: UserRole = "tutor"

export function isUserRole(role: string | null | undefined): role is UserRole {
  return roles.includes(role as UserRole)
}

export function isApprovalStatus(status: string | null | undefined): status is ApprovalStatus {
  return approvalStatuses.includes(status as ApprovalStatus)
}

export function getRoleHome(role: string | null | undefined) {
  if (role === "admin") return "/dashboard"
  if (role === "veterinario") return "/veterinario"
  return "/tutor"
}
