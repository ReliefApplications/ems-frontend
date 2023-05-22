/**
 * Sidenav display types
 */
export const sidenavs = ['side', 'over'] as const;
export type SidenavTypes = (typeof sidenavs)[number];
