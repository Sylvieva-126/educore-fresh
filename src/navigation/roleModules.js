/**
 * roleModules — maps the signed-in role to that role's feature module.
 *
 * CONTRACT (this is the ONLY thing navigation knows about features):
 *   features/<role>/index.js  →  export const <role>Module = { HomeScreen }
 *
 * A module without a HomeScreen (an empty stub) is fine: RoleWorkspaceScreen
 * shows its built-in "Your role pages go here" fallback for that role.
 * An unknown role returns null — same fallback; never a crash and never
 * silent access to the admin workspace.
 */
import { adminModule } from '../features/admin';
import { teacherModule } from '../features/teacher';
import { studentModule } from '../features/student';
import { parentModule } from '../features/parent';

const MODULES_BY_ROLE = {
  ADMIN: adminModule,
  PRINCIPAL: adminModule, // ← THE FIX: the demo context signs in as PRINCIPAL
  SCHOOL_OFFICE: adminModule,
  ACCOUNTS: adminModule,
  TEACHER: teacherModule,
  STUDENT: studentModule,
  PARENT: parentModule,
};

export function roleModule(role) {
  if (!role) return null;
  return MODULES_BY_ROLE[String(role).trim().toUpperCase()] ?? null;
}