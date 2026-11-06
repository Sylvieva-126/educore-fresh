const MODULES_BY_ROLE = {
  ADMIN: adminModule,
  PRINCIPAL: adminModule,      // ← THE FIX: the demo context signs in as PRINCIPAL
  SCHOOL_OFFICE: adminModule,
  ACCOUNTS: adminModule,
  TEACHER: teacherModule,
  STUDENT: studentModule,
  PARENT: parentModule,
};