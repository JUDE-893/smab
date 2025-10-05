import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCurrencyDollar,
  IconShoppingCartBolt
} from "@tabler/icons-react"
import { Modal } from '@/components/shadcnkit/modal'
import SearchBox from '@/components/shadcnkit/page-content-searchBox'


export const sectionsConfig = {
  user: {
    name: "John Deer",
    email: "JD@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/sales#dashboard",
      icon: IconDashboard,
    },
    {
      title: "Growth Metrics",
      url: "/growth-metrics",
      icon: IconChartBar,
    },
    {
      title: "Sales Metrics",
      url: "/sales",
      icon: IconCurrencyDollar,
    },
    {
      title: "Fast Moving Products",
      url: "/products",
      icon: IconShoppingCartBolt,
    },
    {
      title: "Customers Activities",
      url: "/customers",
      icon: IconUsers,
    },
    // {
    //   title: "Lifecycle",
    //   url: "#",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: IconFolder,
    // }
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#Help",
      icon: IconHelp,
    },
    {
      title: (<Modal trigger={<h1>Search</h1>}
                     className='w-[2000]'
              >
                <SearchBox />
             </Modal>),
      url: "#Search",
      icon: IconSearch,
    },
  ],
  documents: [
    // {
    //   name: "Data Library",
    //   url: "#",
    //   icon: IconDatabase,
    // },
    {
      name: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
}

export const sectionsSetting = {
  navMain: [
    { ref: "/sales#dashboard", active: true },          // Dashboard
    { ref: "/growth-metrics", active: false },
    { ref: "/sales", active: true },          // Sales Metrics
    { ref: "/products", active: true },
    { ref: "/customers", active: true },
  ],
  navSecondary: [
    { ref: "/settings", active: true },
    { ref: "#Help", active: true },
    { ref: "#Search", active: true },               // Search (Modal)
  ],
  documents: [
    { ref: "/reports", active: true },        // Reports
  ],
};

/**
 * Reconciles two navigation objects by removing entries from `secondObject`
 * that are marked as inactive (active === false) in `firstObject`.
 *
 * @param {Object} firstObject - Contains simplified refs with active flags.
 * @param {Object} secondObject - Contains full navigation metadata.
 * @returns {Object} - A new object with inactive entries removed.
 */
export function reconcileObjects(firstObject, secondObject) {
  const result = {};

  // Iterate over each top-level key (e.g., navMain, navClouds, etc.)
  for (const key in firstObject) {
    if (!Array.isArray(firstObject[key]) || !Array.isArray(secondObject[key])) {
      continue; // skip if not arrays in both objects
    }

    // Build a Set of refs that are active in firstObject
    const activeRefs = new Set(
      firstObject[key]
        .filter(item => item.active) // keep only active
        .map(item => item.ref)       // extract ref
    );

    // Filter secondObject[key] to keep only items whose url matches active refs
    result[key] = secondObject[key].filter(item => activeRefs.has(item.url));
  }

  return result;
}
