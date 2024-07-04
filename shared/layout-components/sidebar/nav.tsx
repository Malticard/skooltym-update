export interface MenuItem {
  path?: string;
  icon?: string;
  type?: string;
  badge?: string;
  Names?:string;
  badgetxt?: string;
  badge1?:boolean;
  background?:string;
  active?: boolean;
  selected?: boolean;
  title?: string;
  menutitle?: string;
  Items?: (MenuItem | NestedMenuItem)[];
  children? : Array<any>
}

export interface NestedMenuItem extends MenuItem {
  children: (MenuItem | NestedMenuItem)[];
}

export const MENUITEMS: (MenuItem | NestedMenuItem)[] = [
  {
    menutitle: "DASHBOARD",
    Items: [
      {
        path: "/components/dashboard/dashboard",
        icon: "ti-home",
        type: "link",
        active: false,
        selected: false,
        title: "Dashboard",
      },
      {
        title: "Crypto Currencies",
        icon: "ti-wallet",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/crypto-currencies/dashboard",
            type: "link",
            active: false,
            selected: false,
            title: "Dashboard",
          },
          {
            path: "/components/crypto-currencies/marketcap",
            type: "link",
            active: false,
            selected: false,
            title: "Marketcap",
          },
          {
            path: "/components/crypto-currencies/currency-exchange",
            type: "link",
            active: false,
            selected: false,
            title: "Currency exchange",
          },
          {
            path: "/components/crypto-currencies/buy-sell",
            type: "link",
            active: false,
            selected: false,
            title: "Buy & Sell",
          },
          {
            path: "/components/crypto-currencies/wallet",
            type: "link",
            active: false,
            selected: false,
            title: "Wallet",
          },
          {
            path: "/components/crypto-currencies/transactions",
            type: "link",
            active: false,
            selected: false,
            title: "Transactions",
          },
        ],
      },
      {
        title: "ECommerce",
        icon: "ti-shopping-cart-full",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/ecommerce/dashboard",
            type: "link",
            active: false,
            selected: false,
            title: "Dashboard",
          },
          {
            path: "/components/ecommerce/products",
            type: "link",
            active: false,
            selected: false,
            title: "Products",
          },
          {
            path: "/components/ecommerce/product-details",
            type: "link",
            active: false,
            selected: false,
            title: "Product Details",
          },
          {
            path: "/components/ecommerce/cart",
            type: "link",
            active: false,
            selected: false,
            title: "Cart",
          },
          {
            path: "/components/ecommerce/wishlist",
            type: "link",
            active: false,
            selected: false,
            title: "Wishlist",
          },
          {
            path: "/components/ecommerce/checkout",
            type: "link",
            active: false,
            selected: false,
            title: "Checkout",
          },
          {
            path: "/components/ecommerce/orders",
            type: "link",
            active: false,
            selected: false,
            title: "Orders",
          },
          {
            path: "/components/ecommerce/add-product",
            type: "link",
            active: false,
            selected: false,
            title: "Add Product",
          },
          {
            path: "/components/ecommerce/account",
            type: "link",
            active: false,
            selected: false,
            title: "Account",
          },
        ],
      },
    ],
  },
  {
    menutitle: "LANDING",
    Items: [
      {
        path: "/components/landingpage/landingpage",
        icon: "ti-layout",
        type: "link",
        active: false,
        selected: false,
        title: "Landing Page",
      },
    ],
  },
  {
    menutitle: "APPLICATIONS",
    Items: [
      {
        title: "Apps",
        icon: "ti-write",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/apps/widgets",
            type: "link",
            active: false,
            selected: false,
            title: "Widgets",
          },
          {
            path: "/components/apps/sweetalert",
            type: "link",
            active: false,
            selected: false,
            title: "Sweet Alerts",
          },
          {
            title: "Mail",
            icon: "ti-email",
            type: "sub",
            active: false,
            selected: false,
            children: [
              {
                path: "/components/apps/mail/mail-inbox",
                type: "link",
                active: false,
                selected: false,
                title: "Mail-Inbox",
              },
              {
                path: "/components/apps/mail/view-mail",
                type: "link",
                active: false,
                selected: false,
                title: "View-Mail ",
              },
              {
                path: "/components/apps/mail/mail-compose",
                type: "link",
                active: false,
                selected: false,
                title: "Mail-Compose",
              },
            ],
          },
          {
            title: "Maps",
            type: "sub",
            active: false,
            selected: false,
            children: [
              {
                path: "/components/apps/maps/leafletsmaps",
                type: "link",
                active: false,
                selected: false,
                title: "Leaflet Maps",
              }
            ],
          },
          {
            title: "Tables",
            icon: "ti-agenda",
            type: "sub",
            active: false,
            selected: false,
            children: [
              {
                path: "/components/apps/tables/basic-tables",
                type: "link",
                active: false,
                selected: false,
                title: "Basic Tables",
              },
              {
                path: "/components/apps/tables/gridjs-tables",
                type: "link",
                active: false,
                selected: false,
                title: "Grid Js Tables",
              },
              {
                path: "/components/apps/tables/data-tables",
                type: "link",
                active: false,
                selected: false,
                title: "Data Tables",
              },
            ],
          },
          {
            title: "Blog",
            icon: "ti-agenda",
            type: "sub",
            active: false,
            selected: false,
            children: [
              {
                path: "/components/apps/blog/blog-page",
                type: "link",
                active: false,
                selected: false,
                title: "Blog",
              },
              {
                path: "/components/apps/blog/blog-details",
                type: "link",
                active: false,
                selected: false,
                title: "Blog-details",
              },
              {
                path: "/components/apps/blog/blog-post",
                type: "link",
                active: false,
                selected: false,
                title: "Blog-post",
              },
            ],
          },
          {
            title: "File Manager",
            icon: "ti-agenda",
            type: "sub",
            active: false,
            selected: false,
            children: [
              {
                path: "/components/apps/file-manager/file-manager",
                type: "link",
                active: false,
                selected: false,
                title: "File-manager",
              },
              {
                path: "/components/apps/file-manager/file-manager-list",
                type: "link",
                active: false,
                selected: false,
                title: "File-manager-list",
              },
              {
                path: "/components/apps/file-manager/file-details",
                type: "link",
                active: false,
                selected: false,
                title: "File-details",
              },
           
            ],
          },
          {
            title: "Icons",
            type: "link",
            active: false,
            selected: false,
            path:"/components/apps/icons/icons",
            children: [
              {
                path: "/components/apps/icons/font-awesome",
                type: "link",
                active: false,
                selected: false,
                title: "Font Awesome",
              },
              {
                path: "/components/apps/icons/material-design-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Material Design icons",
              },
              {
                path: "/components/apps/icons/simple-line-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Simple Line icons",
              },
              {
                path: "/components/apps/icons/feather-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Feather icons",
              },
              {
                path: "/components/apps/icons/ionic-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Ionic icons",
              },
              {
                path: "/components/apps/icons/flag-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Flags icons",
              },
              {
                path: "/components/apps/icons/pe7-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Pe7 icons",
              },
              {
                path: "/components/apps/icons/themify-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Themify icons",
              },
              {
                path: "/components/apps/icons/typicons-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Typicons icons",
              },
              {
                path: "/components/apps/icons/weather-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Weather icons",
              },
              {
                path: "/components/apps/icons/material-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Material icons",
              },
              {
                path: "/components/apps/icons/bootstrap-icons",
                type: "link",
                active: false,
                selected: false,
                title: "Bootstrap icons",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    menutitle: "components",
    Items: [
      {
        title: "Elements",
        icon: "ti-package",
        type: "sub",
        Names:"mega-menu",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/elements/accordion",
            type: "link",
            active: false,
            selected: false,
            title: "Accordions & Collapse",
          },
          {
            path: "/components/elements/alerts",
            type: "link",
            active: false,
            selected: false,
            title: "Alerts",
          },
       
          {
            path: "/components/elements/avatar",
            type: "link",
            active: false,
            selected: false,
            title: "Avatars",
          },
          {
            path: "/components/elements/breadcrumbs",
            type: "link",
            active: false,
            selected: false,
            title: "Breadcrumbs",
          },
          {
            path: "/components/elements/buttons",
            type: "link",
            active: false,
            selected: false,
            title: "Buttons",
          },
          {
            path: "/components/elements/buttongroup",
            type: "link",
            active: false,
            selected: false,
            title: "Button Group",
          },
          {
            path: "/components/elements/badge",
            type: "link",
            active: false,
            selected: false,
            title: "Badge",
          },
          {
            path: "/components/elements/dropdown",
            type: "link",
            active: false,
            selected: false,
            title: "Dropdowns",
          },
          {
            path: "/components/elements/images$figures",
            type: "link",
            active: false,
            selected: false,
            title: "Images & Figures",
          },
         
          {
            path: "/components/elements/list-group",
            type: "link",
            active: false,
            selected: false,
            title: "List Group",
          },
          {
            path: "/components/elements/tabs",
            type: "link",
            active: false,
            selected: false,
            title: "Navs & Tabs",
          },
      
          {
            path: "/components/elements/objectfit",
            type: "link",
            active: false,
            selected: false,
            title: "Object Fit",
          },
          {
            path: "/components/elements/pagination",
            type: "link",
            active: false,
            selected: false,
            title: "Pagination",
          },
          {
            path: "/components/elements/popover",
            type: "link",
            active: false,
            selected: false,
            title: "Popover",
          },
          {
            path: "/components/elements/progress",
            type: "link",
            active: false,
            selected: false,
            title: "Progress",
          },
          {
            path: "/components/elements/spinners",
            type: "link",
            active: false,
            selected: false,
            title: "Spinners",
          },
      
          {
            path: "/components/elements/typography",
            type: "link",
            active: false,
            selected: false,
            title: "Typography",
          },
          {
            path: "/components/elements/tooltip",
            type: "link",
            active: false,
            selected: false,
            title: "Tooltips",
          },
        
          {
            path: "/components/elements/toast",
            type: "link",
            active: false,
            selected: false,
            title: "Toasts",
          },
          {
            path: "/components/elements/tags",
            type: "link",
            active: false,
            selected: false,
            title: "Tags",
          },
        ],
      },
      {
        title: "AdvancedUI",
        icon: "ti-briefcase",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/advancedui/chat",
            type: "link",
            active: false,
            selected: false,
            title: "Chat",
          },
          {
            path: "/components/advancedui/card",
            type: "link",
            active: false,
            selected: false,
            title: "cards",
          },
          {
            path: "/components/advancedui/calendar",
            type: "link",
            active: false,
            selected: false,
            title: "Calendar",
          },
          {
            path: "/components/advancedui/contacts",
            type: "link",
            active: false,
            selected: false,
            title: "Contacts",
          },

          {
            path: "/components/advancedui/carousel",
            type: "link",
            active: false,
            selected: false,
            title: "Carousel",
          },
          
          {
            path: "/components/advancedui/modals",
            type: "link",
            active: false,
            selected: false,
            title: "Modals",
          },
          {
            path: "/components/advancedui/offCanvas",
            type: "link",
            active: false,
            selected: false,
            title: "OffCanvas",
          },
          {
            path: "/components/advancedui/timeline",
            type: "link",
            active: false,
            selected: false,
            title: "Timeline",
          },

      
          {
            path: "/components/advancedui/placeholders",
            type: "link",
            active: false,
            selected: false,
            title: "Placeholders",
          },
          {
            path: "/components/advancedui/ratings",
            type: "link",
            active: false,
            selected: false,
            title: "Ratings",
          },
          {
            path: "/components/advancedui/scrollspy",
            type: "link",
            active: false,
            selected: false,
            title: "Scrollspy",
          },
          {
            path: "/components/advancedui/search",
            type: "link",
            active: false,
            selected: false,
            title: "Search",
          },
          {
            path: "/components/advancedui/userlist",
            type: "link",
            active: false,
            selected: false,
            title: "Userlist",
          },
          {
            path: "/components/advancedui/notification",
            type: "link",
            active: false,
            selected: false,
            title: "Notification",
          },
          {
            path: "/components/advancedui/three-view",
            type: "link",
            active: false,
            selected: false,
            title: "Tree-view",
          },
        ],
      },
    ],
  },
  {
    menutitle: "OTHER PAGES",
    Items: [
      {
        title: "Pages",
        icon: "ti-palette",
        type: "sub",
        menutitle: "",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/pages/profile",
            type: "link",
            active: false,
            selected: false,
            title: "Profile",
          },
          {
            path: "/components/pages/about-us",
            type: "link",
            active: false,
            selected: false,
            title: "About us",
          },
          {
            path: "/components/pages/notifications-list",
            type: "link",
            active: false,
            selected: false,
            title: "Notification list",
          },
          {
            path: "/components/pages/settings",
            type: "link",
            active: false,
            selected: false,
            title: "Settings",
          },

          {
            path: "/components/pages/invoice",
            type: "link",
            active: false,
            selected: false,
            title: "Invoice",
          },
          {
            path: "/components/pages/faqs",
            type: "link",
            active: false,
            selected: false,
            title: "Faqs",
          },
          {
            path: "/components/pages/pricing",
            type: "link",
            active: false,
            selected: false,
            title: "Pricing",
          },
          {
            path: "/components/pages/gallery",
            type: "link",
            active: false,
            selected: false,
            title: "Gallery",
          },
          {
            path: "/components/pages/success-message",
            type: "link",
            active: false,
            selected: false,
            title: "Success Message",
          },
          {
            path: "/components/pages/danger-message",
            type: "link",
            active: false,
            selected: false,
            title: "Danger Message",
          },
          {
            path: "/components/pages/warning-message",
            type: "link",
            active: false,
            selected: false,
            title: "Warning Message",
          },
          {
            path: "/components/pages/empty-page",
            type: "link",
            active: false,
            selected: false,
            title: "Empty Page",
          },
        
        ],
      },

      {
        title: "Utilities",
        icon: "ti-shield",
        type: "sub",
        children: [
          {
            path: "/components/utilities/breakpoints",
            type: "link",
            active: false,
            selected: false,
            title: "Breakpoints",
          },
       
          {
            path: "/components/utilities/border",
            type: "link",
            active: false,
            selected: false,
            title: "Border",
          },
    
          {
            path: "/components/utilities/gutters",
            type: "link",
            active: false,
            selected: false,
            title: "Gutters",
          },
          {
            path: "/components/utilities/helpers",
            type: "link",
            active: false,
            selected: false,
            title: "Helpers",
          },
          {
            path: "/components/utilities/display",
            type: "link",
            active: false,
            selected: false,
            title: "Display",
          },
          {
            path: "/components/utilities/flex",
            type: "link",
            active: false,
            selected: false,
            title: "Flex",
          },
          {
            path: "/components/utilities/columns",
            type: "link",
            active: false,
            selected: false,
            title: "Columns",
          },
       
          
          {
            path: "/components/utilities/position",
            type: "link",
            active: false,
            selected: false,
            title: "Position",
          },
          {
            path: "/components/utilities/more",
            type: "link",
            active: false,
            selected: false,
            title: "More",
          },
       
        
        ],
      },
      {
        title: "Submenus",
        icon: "ti-menu ",
        type: "sub",
        active: false,
        selected: false,
        children:[
          
            {
      
             type:"link",
               path:`#`,
              active: false,
              selected: false,
              title: "Submenu-01",
            },
            {
      
                 type:"sub",
                 active: false,
                 selected: false,
                 title: "Submenu-02",
                 children:[
                  {
      
                      type:"link",
                        path:`#`,
                       active: false,
                       selected: false,
                       title: "Level-01",
                     },
                     {
      
                        type:"link",
                        path:`#`,
                         active: false,
                         selected: false,
                         title: "Level-02",
                       },
                ]
               },
        ]
      },
      {
        title: "Authentication",
        icon: "ti-lock",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/authentication/signin",
            type: "link",
            active: false,
            selected: false,
            title: " Sign In",
          },
          {
            path: "/components/authentication/signup",
            type: "link",
            active: false,
            selected: false,
            title: " Sign Up",
          },
          {
            path: "/components/authentication/forgot-password",
            type: "link",
            active: false,
            selected: false,
            title: " Forgot Password",
          },
          {
            path: "/components/authentication/reset-password",
            type: "link",
            active: false,
            selected: false,
            title: " Reset Password",
          },
          {
            path: "/components/authentication/under-construction",
            type: "link",
            active: false,
            selected: false,
            title: " UnderConstruction",
          },
          {
            path: "/components/authentication/lockscreen",
            type: "link",
            active: false,
            selected: false,
            title: "Lockscreen",
          },
          {
            path: "/components/authentication/error404",
            type: "link",
            active: false,
            selected: false,
            title: " Error404",
          },
          {
            path: "/components/authentication/error505",
            type: "link",
            active: false,
            selected: false,
            title: " Error505",
          },
        ],
      },
    ],
  },
  {
    menutitle: "FORMS & CHARTS",
    Items: [
      {
        title: "Forms",
        icon: "ti-receipt",
        type: "sub",
        background: "hor-rightangle",
        active: false,
        selected: false,
        children: [
          {
            path: "/components/forms/formelements",
            type: "sub",
            active: false,
            selected: false,
            title: "Form Elements",
            children:[
              {
                path: "/components/forms/formelements/inputs",
                type: "link",
                active: false,
                selected: false,
                title: "Inputs",
              },
              {
                path: "/components/forms/formelements/inputgroup",
                type: "link",
                active: false,
                selected: false,
                title: "Input Group",
              },
              {
                path: "/components/forms/formelements/checkradios",
                type: "link",
                active: false,
                selected: false,
                title: "Check & Radios",
              },
              {
                path: "/components/forms/formelements/form-select",
                type: "link",
                active: false,
                selected: false,
                title: "Form Select",
              },
              {
                path: "/components/forms/formelements/range-slider",
                type: "link",
                active: false,
                selected: false,
                title: "Range Slider",
              },
              {
                path: "/components/forms/formelements/input-masks",
                type: "link",
                active: false,
                selected: false,
                title: "Input Masks",
              },
              {
                path: "/components/forms/formelements/file-uploads",
                type: "link",
                active: false,
                selected: false,
                title: "File Uploads",
              },
              {
                path: "/components/forms/formelements/datetimepicker",
                type: "link",
                active: false,
                selected: false,
                title: "Date,Time Picker",
              },
              {
                path: "/components/forms/formelements/colorpicker",
                type: "link",
                active: false,
                selected: false,
                title: "Color Picker",
              }
            ]
          },
          {
            path: "/components/forms/floatinglabels",
            type: "link",
            active: false,
            selected: false,
            title: "Floating Labels",
          },
          {
            path: "/components/forms/form-layouts",
            type: "link",
            active: false,
            selected: false,
            title: "Form Layouts",
          },
          {
            path: "/components/forms/form-validation",
            type: "link",
            active: false,
            selected: false,
            title: "Validation",
          },
      
          {
            path: "/components/forms/formeditor",
            type: "sub",
            active: false,
            selected: false,
            title: "Form Editor",
            children:[
            { 
              path: "/components/forms/quilleditor/quilleditor",
            type: "link",
            active: false,
            selected: false,
            title: "Quill Editor"
            ,}
            ]
          },
        
          {
            path: "/components/forms/select2",
            type: "link",
            active: false,
            selected: false,
            title: "Select2",
          },
        ],
      },

      {
        title: "Charts",
        icon: "ti-bar-chart",
        type: "sub",
        background: "hor-rightangle",
        badge1: true,
        active: false,
        selected: false,
        children: [
          {
            path: "/components/charts/chartjs",
            type: "link",
            active: false,
            selected: false,
            title: "Chartjs",
          },
          {
            path: "/components/charts/echart",
            type: "link",
            active: false,
            selected: false,
            title: "Echart",
          },
          {
            path: "/components/charts/nvd3charts",
            type: "link",
            active: false,
            selected: false,
            title: "Nvd3charts",
          },
          {
            path: "/components/charts/piacharts",
            type: "link",
            active: false,
            selected: false,
            title: "Pie charts",
          },
        ],
      },
    ],
  },
];