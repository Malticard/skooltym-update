import { StaffLogin } from "@/interfaces/StaffLogin";

export interface MenuItem {
  path?: string;
  icon?: string;
  type?: string;
  badge?: string;
  Names?: string;
  badgetxt?: string;
  badge1?: boolean;
  background?: string;
  active?: boolean;
  selected?: boolean;
  title?: string;
  menutitle?: string;
  Items?: (MenuItem | NestedMenuItem)[];
  children?: Array<any>
}

export interface NestedMenuItem extends MenuItem {
  children: (MenuItem | NestedMenuItem)[];
}


export const MENUITEMS: (MenuItem | NestedMenuItem)[] = [
  {
    menutitle: "DASHBOARD",
    Items: [
      {
        path: "/dashboard",
        icon: "ti-pie-chart",
        type: "link",
        active: true,
        selected: true,
        title: "Dashboard",
      },
      {
        path: "/dashboard/Students",
        icon: "ti-user",
        type: "link",
        active: false,
        selected: false,
        title: "Students",
      }, {
        path: "/dashboard/Staff",
        icon: "ti-home",
        type: "link",
        active: false,
        selected: false,
        title: "Staff",
      }, {
        path: "/dashboard/Guardians",
        icon: "ti-user",
        type: "link",
        active: false,
        selected: false,
        title: "Guardians",
      }, {
        path: "/dashboard/Classes",
        icon: "ti-home",
        type: "link",
        active: false,
        selected: false,
        title: "Classes",
      }, {
        path: "/dashboard/Streams",
        icon: "ti-home",
        type: "link",
        active: false,
        selected: false,
        title: "Streams",
      },

    ]

    ,
  },
  {
    menutitle: "MONITORING SECTION",
    Items: [
      {
        path: "/dashboard/PendingOvertime",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Pending Overtime",
      }, {
        path: "/dashboard/ClearedOvertime",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Cleared Overtime",
      },
      {
        path: "/dashboard/staffClocking",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Staff Clocking",
      }, {
        path: "/dashboard/studentClocking",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Student Clocking",
      }, {
        path: "/dashboard/PickUps",
        icon: "ti-arrow-up",
        type: "link",
        active: false,
        selected: false,
        title: "Pick Ups",
      }, {
        path: "/dashboard/DropOffs",
        icon: "ti-arrow-down",
        type: "link",
        active: false,
        selected: false,
        title: "Drop Offs",
      },

    ],
  },
  {
    menutitle: "SETTINGS SECTION",
    Items: [
      {
        path: "/dashboard/ChangePassword",
        icon: " ti-lock",
        type: "link",
        active: false,
        selected: false,
        title: "Change Password",
      }, {
        path: "/dashboard/Settings",
        icon: " ti-settings",
        type: "link",
        active: false,
        selected: false,
        title: "Settings",
      },
    ],
  }
];

export const Finance: (MenuItem | NestedMenuItem)[] = [
  {
    menutitle: "DASHBOARD",
    Items: [
      {
        path: "/dashboard",
        icon: "ti-pie-chart",
        type: "link",
        active: true,
        selected: true,
        title: "Dashboard",
      },
    ]
  },
  {
    menutitle: "MONITORING SECTION",
    Items: [
      {
        path: "/dashboard/PendingOvertime",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Pending Overtime",
      }, {
        path: "/dashboard/ClearedOvertime",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Cleared Overtime",
      }, {
        path: "/dashboard/Payments",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Payments",
      },
    ],
  },
  {
    menutitle: "SETTINGS SECTION",
    Items: [
      {
        path: "/dashboard/ChangePassword",
        icon: " ti-lock",
        type: "link",
        active: false,
        selected: false,
        title: "Change Password",
      },
    ],
  }
];