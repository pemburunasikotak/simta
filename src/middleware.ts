import { LoaderFunctionArgs, redirect } from "react-router";

import { filterPermission } from "./utils/permission";
import { SessionUser } from "./libs/localstorage";
import { PERMISSIONS } from "./commons/constants/permissions";
import { paths } from "./commons/constants/paths";

const mappingRoutePermissions = [
  {
    path: paths.dashboard,
    permissions: [PERMISSIONS.DASHBOARD.READ_DASHBOARD],
  },
  {
    path: paths.profile,
    permissions: [PERMISSIONS.MAHASISWA.PROFILE_EDIT],
  },
  {
    path: paths.ta.progress,
    permissions: [PERMISSIONS.MAHASISWA.TA_UPLOAD],
  },
  {
    path: paths.ta.revisions,
    permissions: [PERMISSIONS.MAHASISWA.TA_PRINT],
  },
  {
    path: paths.ta.review,
    permissions: [PERMISSIONS.DOSEN.TA_READ],
  },
  {
    path: paths.ta.proposals,
    permissions: [PERMISSIONS.AKADEMIK.PROPOSAL_READ_ALL],
  },
  {
    path: paths.users.list,
    permissions: [PERMISSIONS.AKADEMIK.USER_CRUD],
  },
  {
    path: paths.schedules.list,
    permissions: [PERMISSIONS.DEFAULT],
  },
  {
    path: paths.schedules.manage,
    permissions: [PERMISSIONS.AKADEMIK.SCHEDULE_CRUD],
  },
];

const mappingPublicRoutes = ["/auth/login", "/auth/oauth-callback", "/dashboard"];

export const middleware = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const session = SessionUser.get();
  const userPermissions =
    session?.user?.roles?.map((role) => role.permissions.map((perm: any) => perm.name))?.flat() || [];

  const pathname = url.pathname;

  const allowedPermissions = filterPermission(
    mappingRoutePermissions,
    (route) =>
      (session && route.path === pathname && route.permissions
        ? route.permissions.some((permission) => permission ?? userPermissions?.some(permission))
        : true) || false,
  );

  if (mappingPublicRoutes.includes(pathname)) {
    return null;
  }

  // if (!session) {
  //   return redirect(paths.auth.login);
  // }

  if (allowedPermissions.length === 0) {
    return redirect(paths.dashboard);
  }

  return null;
};
