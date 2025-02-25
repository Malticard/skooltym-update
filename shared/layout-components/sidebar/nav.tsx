import { fetchSettings } from "@/utils/data_fetch";

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

const sidebarLinks: Array<MenuItem | NestedMenuItem> = [
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
        title: "Students & Reports",
      }, {
        path: "/dashboard/Staff",
        icon: "ti-home",
        type: "link",
        active: false,
        selected: false,
        title: "Staff & Reports",
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

    ],
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
    menutitle: "STUDENT CLOCKING",
    Items: [
      {
        path: "/dashboard/clocking/studentClockingIn",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Clock In",
      }, {
        path: "/dashboard/clocking/studentClockingOut",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Clock Out",
      }
    ]
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
  }, {
    menutitle: "STAFF HUMAN RESOURCE",
    Items: [
      {
        path: "/dashboard/StaffHR/ClockIn",
        icon: "ti-timer",
        type: "link",
        active: false,
        selected: false,
        title: "Staff Clock In",
      }, {
        path: "/dashboard/StaffHR/ClockOut",
        icon: "ti-time",
        type: "link",
        active: false,
        selected: false,
        title: "Staff Clock Out",
      }, {
        path: "/dashboard/StaffHR/Overtime",
        icon: "ti-time",
        type: "link",
        active: false,
        selected: false,
        title: "Staff Overtime",
      }, {
        path: "/dashboard/StaffHR/LateRecords",
        icon: "ti-time",
        type: "link",
        active: false,
        selected: false,
        title: "Staff Late Records",
      }, {
        path: "/dashboard/StaffHR/Settings",
        icon: "ti-settings",
        type: "link",
        active: false,
        selected: false,
        title: "Settings",
      }
    ]
  }
];

let MENUITEMS: (MenuItem | NestedMenuItem)[] = sidebarLinks;

// fetchSettings().then((settings) => {
//   console.log("settings loaded");
//   if (settings.clock_in_clock_out) {
//     MENUITEMS = sidebarLinks.splice(2, 0, {
//       menutitle: "STUDENT CLOCKING",
//       Items: [
//         {
//           path: "/dashboard/clocking/studentClockingIn",
//           icon: "ti-timer",
//           type: "link",
//           active: false,
//           selected: false,
//           title: "Clock In",
//         }, {
//           path: "/dashboard/clocking/studentClockingOut",
//           icon: "ti-timer",
//           type: "link",
//           active: false,
//           selected: false,
//           title: "Clock Out",
//         }
//       ]
//     },)
//   }
// });
export { MENUITEMS };


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