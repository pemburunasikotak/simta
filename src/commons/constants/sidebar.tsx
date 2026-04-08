import {
  AccountCircleOutlined,
  CalendarTodayOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  GroupOutlined,
  HistoryEduOutlined,
  PrintOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";

import { paths } from "./paths";
import { PERMISSIONS } from "./permissions";

export type TSidebarItem = {
  key: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
  permissions?: string[];
  children?: TSidebarItem[];
};

export const SIDEBAR_ITEMS: TSidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: paths.dashboard,
    icon: <DashboardOutlined />,
    permissions: [PERMISSIONS.DEFAULT],
  },
  {
    key: "profile",
    label: "Akun Saya",
    path: paths.profile,
    icon: <AccountCircleOutlined />,
    permissions: [PERMISSIONS.MAHASISWA.PROFILE_EDIT],
  },
  {
    key: "ta-mahasiswa",
    label: "Tugas Akhir",
    icon: <DescriptionOutlined />,
    permissions: [PERMISSIONS.MAHASISWA.TA_VIEW],
    children: [
      {
        key: "ta-progress",
        label: "Progress TA",
        path: paths.ta.progress,
        icon: <UploadFileOutlined />,
        permissions: [PERMISSIONS.MAHASISWA.TA_UPLOAD],
      },
      {
        key: "ta-revisions",
        label: "Hasil Revisi",
        path: paths.ta.revisions,
        icon: <PrintOutlined />,
        permissions: [PERMISSIONS.MAHASISWA.TA_PRINT],
      },
      {
        key: "ta-hasil",
        label: "Hasil Sidang",
        path: paths.ta.hasil,
        icon: <DescriptionOutlined />,
        permissions: [PERMISSIONS.MAHASISWA.TA_VIEW],
      },
    ],
  },
  {
    key: "ta-dosen",
    label: "Review TA",
    path: paths.ta.review,
    icon: <HistoryEduOutlined />,
    permissions: [PERMISSIONS.DOSEN.TA_READ],
  },
  {
    key: "ta-akademik",
    label: "Proposal TA",
    path: paths.ta.proposals,
    icon: <DescriptionOutlined />,
    permissions: [PERMISSIONS.AKADEMIK.PROPOSAL_READ_ALL],
  },
  {
    key: "users",
    label: "Manajemen User",
    icon: <GroupOutlined />,
    permissions: [PERMISSIONS.AKADEMIK.USER_CRUD],
    children: [
      {
        key: "users-dosen",
        label: "Dosen",
        path: paths.users.dosen,
        permissions: [PERMISSIONS.AKADEMIK.USER_CRUD],
      },
      {
        key: "users-mahasiswa",
        label: "Mahasiswa",
        path: paths.users.mahasiswa,
        permissions: [PERMISSIONS.AKADEMIK.USER_CRUD],
      },
      {
        key: "users-akademis",
        label: "Akademik",
        path: paths.users.akademis,
        permissions: [PERMISSIONS.AKADEMIK.USER_CRUD],
      },
    ],
  },
  {
    key: "schedules",
    label: "Jadwal Ujian",
    icon: <CalendarTodayOutlined />,
    permissions: [PERMISSIONS.DEFAULT],
    children: [
      {
        key: "schedule-list",
        label: "Lihat Jadwal",
        path: paths.schedules.list,
        permissions: [PERMISSIONS.DEFAULT],
      },
      {
        key: "schedule-manage",
        label: "Kelola Jadwal",
        path: paths.schedules.manage,
        permissions: [PERMISSIONS.AKADEMIK.SCHEDULE_CRUD],
      },
      {
        key: "schedule-review",
        label: "Review Sidang",
        path: paths.schedules.review,
        permissions: [PERMISSIONS.DOSEN.TA_READ],
      },
    ],
  },
];
